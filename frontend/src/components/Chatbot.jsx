import React, { useState, useEffect, useRef } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { content: input, sender: 'user' };
      setMessages(prev => [...prev, newMessage]);
      setInput('');

      try {
        const response = await axios.post('/api/chatbot/message', {
          message: input,
          conversationId,
          conversationType: 'prospecting'
        });

        setMessages(prev => [...prev, { content: response.data.message, sender: 'bot' }]);
        setConversationId(response.data.conversationId);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, { content: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="rounded-full p-4">
          Chat with us
        </Button>
      )}
      {isOpen && (
        <Card className="w-80 h-96 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat with D-Rock Bot</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>X</Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full pr-4" ref={scrollAreaRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <div className="flex items-center mt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-grow mr-2"
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;
