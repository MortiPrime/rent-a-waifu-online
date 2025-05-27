
import { useState, useEffect, useRef } from 'react';
import { Send, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/hooks/useChat';

interface ChatInterfaceProps {
  characterId: number;
  characterName: string;
  characterImage: string;
  onBack: () => void;
}

const ChatInterface = ({ characterId, characterName, characterImage, onBack }: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const { currentConversation, createConversation, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create conversation if it doesn't exist
    if (!currentConversation || currentConversation.character_id !== characterId) {
      createConversation(characterId, characterName);
    }
  }, [characterId, characterName, currentConversation, createConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-secondary">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 p-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img
          src={characterImage}
          alt={characterName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg">{characterName}</h2>
          <p className="text-sm text-gray-600">En línea</p>
        </div>
        <div className="ml-auto">
          <Heart className="w-6 h-6 text-red-400 animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation?.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-primary text-white'
                  : 'bg-white/90 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/90 backdrop-blur-sm border-t border-white/20">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Escribe un mensaje a ${characterName}...`}
            className="flex-1"
          />
          <Button type="submit" className="anime-button px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
