
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'character';
  timestamp: Date;
}

interface Conversation {
  id: string;
  character_id: number;
  character_name: string;
  messages: Message[];
  last_message_at: string;
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const createConversation = async (characterId: number, characterName: string) => {
    if (!user) return;

    try {
      const newConversation = {
        user_id: user.id,
        character_id: characterId,
        character_name: characterName,
        messages: [],
        last_message_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('conversations')
        .insert(newConversation)
        .select()
        .single();

      if (error) throw error;

      const conversation = data as Conversation;
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversation(conversation);
      return conversation;
    } catch (error) {
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
      timestamp: new Date(),
    };

    // Simulate character response
    const characterResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: generateCharacterResponse(content, currentConversation.character_name),
      sender: 'character',
      timestamp: new Date(),
    };

    const updatedMessages = [...currentConversation.messages, userMessage, characterResponse];

    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          messages: updatedMessages,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', currentConversation.id);

      if (error) throw error;

      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        last_message_at: new Date().toISOString(),
      };

      setCurrentConversation(updatedConversation);
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversation.id ? updatedConversation : conv
        )
      );
    } catch (error) {
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
      `¡Hola! Soy ${characterName}. Me alegra mucho poder hablar contigo. ¿Cómo ha sido tu día?`,
      `Eso es muy interesante... Como ${characterName}, creo que deberíamos conocernos mejor. ¿Qué te gusta hacer en tu tiempo libre?`,
      `*sonríe tímidamente* Me haces sentir especial cuando me hablas así. ¿Te gustaría que hablemos de nuestros sueños?`,
      `¡Me encanta tu energía! ${characterName} encuentra eso muy atractivo. ¿Qué opinas de las aventuras emocionantes?`,
      `*se sonroja* No esperaba que dijeras algo así... pero me gusta. ¿Siempre eres tan directo/a?`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    createConversation,
    sendMessage,
    loading,
    fetchConversations,
  };
};
