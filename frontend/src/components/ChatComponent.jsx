import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Send, Loader } from 'lucide-react';
import CallbackForm from '../components/forms/CallbackForm';
import QuoteRequestForm from '../components/forms/QuoteRequestForm';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [modelPerformance, setModelPerformance] = useState(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([{
      sender: 'bot',
      content: "Hello! I'm here to help you schedule a quote or request a callback. How can I assist you today?"
    }]);

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
      const response = await axios.post('http://localhost:8000/api/chat/process-message', {
        message: input,
        conversationId: conversationId
      });
      console.log('Chat response:', response.data);

      setMessages(prev => [...prev, {
        sender: 'bot',
        content: response.data.response,
        options: response.data.options
      }]);

      setConversationId(response.data.conversationId);
    } catch (error) {
      console.error('Error sending message:', error.response || error);
      setMessages(prev => [...prev, {
        sender: 'system',
        content: 'An error occurred while processing your message. Please try again.'
      }]);
    }
  };

  const handleOptionSelect = (optionValue) => {
    console.log('Option selected:', optionValue);
    if (optionValue === 'quote') {
      setShowQuoteForm(true);
    } else if (optionValue === 'callback') {
      setShowCallbackForm(true);
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

})

return (
  <div className="flex flex-col h-full">
    <ScrollArea className="flex-grow mb-4 p-4">
      {messages.map((msg, index) => (
        <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
            {msg.content}
          </div>
          {msg.options && (
            <div className="mt-2 space-x-2">
              {msg.options.map((option, i) => (
                <Button
                  key={i}
                  onClick={() => handleOptionSelect(option.value)}
                  variant="outline"
                  size="sm"
                >
                  {option.text}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </ScrollArea>
    <div className="flex items-center space-x-2 p-4 bg-gray-100 rounded-b-lg">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        className="flex-grow"
      />
      <Button onClick={handleSend} disabled={isLoading}>
        {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
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
  </div>
);
};

export default ChatComponent;
