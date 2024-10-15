import React, { useState, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X } from 'lucide-react';
import ChatComponent from '@/components/ChatComponent';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <ChatContext.Provider value={{ isChatOpen, toggleChat }}>
      {children}
      <Button
        className="fixed bottom-6 right-6 rounded-full p-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
        onClick={toggleChat}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white shadow-2xl rounded-lg overflow-hidden z-50">
          <Card className="h-full">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex justify-between items-center">
                D-Rock Bot
                <Button size="sm" variant="ghost" onClick={toggleChat} className="text-white hover:text-blue-200">
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <ChatComponent />
            </CardContent>
          </Card>
        </div>
      )}
    </ChatContext.Provider>
  );
};
