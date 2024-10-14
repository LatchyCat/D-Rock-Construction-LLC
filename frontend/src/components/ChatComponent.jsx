import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import CallbackForm from '../components/forms/CallbackForm';
import QuoteRequestForm from '../components/forms/QuoteRequestForm';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [modelPerformance, setModelPerformance] = useState(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  useEffect(() => {
    const checkProactiveEngagement = async () => {
      try {
        console.log('Checking proactive engagement...');
        const response = await axios.get('http://localhost:8000/api/chat/proactive-engagement');
        console.log('Proactive engagement response:', response.data);
        if (response.data.shouldEngage) {
          setMessages(prev => [...prev, {
            sender: 'bot',
            content: response.data.message,
            engagementReason: response.data.engagementReason
          }]);
        }
      } catch (error) {
        console.error('Error checking proactive engagement:', error.response || error);
      }
    };

    const fetchModelPerformance = async () => {
      try {
        console.log('Fetching model performance...');
        const response = await axios.get('http://localhost:8000/api/chat/model-performance');
        console.log('Model performance response:', response.data);
        setModelPerformance(response.data);
      } catch (error) {
        console.error('Error fetching model performance:', error.response || error);
      }
    };

    checkProactiveEngagement();
    fetchModelPerformance();
  }, []);

  const handleCallbackRequest = () => {
    setShowCallbackForm(true);
    setMessages(prev => [...prev, {
      sender: 'bot',
      content: "Sure, I'd be happy to help you schedule a callback. Please fill out the form below."
    }]);
  };

  const handleQuoteRequest = () => {
    setShowQuoteForm(true);
    setMessages(prev => [...prev, {
      sender: 'bot',
      content: "Certainly! To provide you with an accurate quote, please fill out the form below with details about your project."
    }]);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    console.log('Sending message:', input);
    setMessages(prev => [...prev, { sender: 'user', content: input }]);
    setInput('');

    try {
      const response = await axios.post('/api/chat', {
        message: input,
        conversationId: conversationId
      });
      console.log('Chat response:', response.data);

      setMessages(prev => [...prev, {
        sender: 'bot',
        content: response.data.response,
        sentiment: response.data.sentiment,
        entities: response.data.entities,
        intent: response.data.intent,
        confidenceScore: response.data.intentConfidence
      }]);

      setConversationId(response.data.conversationId);

      // Display recognized entities
      if (response.data.entities && Object.keys(response.data.entities).length > 0) {
        setMessages(prev => [...prev, {
          sender: 'system',
          content: `Recognized entities: ${JSON.stringify(response.data.entities)}`
        }]);
      }

      // Display sentiment and intent
      setMessages(prev => [...prev, {
        sender: 'system',
        content: `Sentiment: ${response.data.sentiment > 0 ? 'Positive' : response.data.sentiment < 0 ? 'Negative' : 'Neutral'}
                  Intent: ${response.data.intent} (Confidence: ${response.data.intentConfidence})`
      }]);

    } catch (error) {
      console.error('Error sending message:', error.response || error);
      setMessages(prev => [...prev, {
        sender: 'system',
        content: 'An error occurred while processing your message. Please try again.'
      }]);
    }
  };

  const handleFAQ = async () => {
    try {
      const response = await axios.post('/api/faq', { question: input });
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: response.data.answer,
        confidence: response.data.confidence,
        relatedQuestions: response.data.relatedQuestions
      }]);
    } catch (error) {
      console.error('Error getting FAQ answer:', error);
      setMessages(prev => [...prev, {
        sender: 'system',
        content: 'An error occurred while fetching the FAQ answer. Please try again.'
      }]);
    }
  };

  return (
    <div className="chat-container bg-white p-4 rounded-lg shadow-md">
      <div className="chat-messages h-64 overflow-y-auto mb-4 p-2 border border-gray-200 rounded">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender} mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
            {msg.content}
            {msg.sentiment && <div className="sentiment">Sentiment: {msg.sentiment}</div>}
            {msg.entities && <div className="entities">Entities: {JSON.stringify(msg.entities)}</div>}
            {msg.intent && <div className="intent">Intent: {msg.intent} (Confidence: {msg.confidenceScore})</div>}
            {msg.relatedQuestions && (
              <div className="related-questions">
                Related Questions:
                <ul>
                  {msg.relatedQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input flex flex-col">
        <div className="flex mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow mr-2 p-2 border border-gray-300 rounded"
            placeholder="Type your message..."
          />
          <Button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">Send</Button>
          <Button onClick={handleFAQ} className="bg-green-500 text-white px-4 py-2 rounded ml-2">FAQ</Button>
        </div>
        <div className="flex justify-between">
          <Button onClick={handleCallbackRequest} className="bg-purple-500 text-white px-4 py-2 rounded">Request Callback</Button>
          <Button onClick={handleQuoteRequest} className="bg-orange-500 text-white px-4 py-2 rounded">Schedule Quote</Button>
        </div>
      </div>

      {showCallbackForm && (
        <CallbackForm
          onClose={() => setShowCallbackForm(false)}
          conversationId={conversationId}
        />
      )}
      {showQuoteForm && (
        <QuoteRequestForm
          onClose={() => setShowQuoteForm(false)}
          conversationId={conversationId}
        />
      )}

      {modelPerformance && (
        <div className="model-performance mt-4 text-sm text-gray-600">
          Model Accuracy: {modelPerformance.accuracy}<br />
          F1 Score: {modelPerformance.f1Score}
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
