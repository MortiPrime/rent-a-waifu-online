
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Message, Conversation } from '@/types';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  createConversation: (characterId: number, characterName: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const formattedConversations: Conversation[] = data?.map(conv => ({
        ...conv,
        messages: Array.isArray(conv.messages) ? conv.messages as Message[] : []
      })) || [];

      setConversations(formattedConversations);
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las conversaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (characterId: number, characterName: string) => {
    if (!user) return;

    try {
      // Check if conversation already exists
      const existingConv = conversations.find(conv => conv.character_id === characterId);
      if (existingConv) {
        setCurrentConversation(existingConv);
        return;
      }

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          character_id: characterId,
          character_name: characterName,
          messages: []
        })
        .select()
        .single();

      if (error) throw error;

      const newConversation: Conversation = {
        ...data,
        messages: []
      };

      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la conversación",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const characterMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: generateCharacterResponse(content, currentConversation.character_name),
      sender: 'character',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...currentConversation.messages, userMessage, characterMessage];

    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          messages: updatedMessages,
          last_message_at: new Date().toISOString()
        })
        .eq('id', currentConversation.id);

      if (error) throw error;

      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        last_message_at: new Date().toISOString()
      };

      setCurrentConversation(updatedConversation);
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation.id ? updatedConversation : conv
      ));
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    }
  };

  const generateCharacterResponse = (userMessage: string, characterName: string): string => {
    const responses = [
      `¡Hola! Soy ${characterName}, es genial conocerte 💕`,
      `Me encanta hablar contigo, cuéntame más sobre ti 😊`,
      `¡Qué interesante! ${characterName} piensa que eres muy dulce 💖`,
      `Me haces sonreír con cada mensaje que me envías ✨`,
      `¿Te gustaría saber más sobre mí? Me encanta compartir contigo 💫`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const value = {
    conversations,
    currentConversation,
    loading,
    createConversation,
    sendMessage,
    loadConversations,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
