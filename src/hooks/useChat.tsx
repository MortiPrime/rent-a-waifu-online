
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useChat = (characterId?: number, characterName?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (user && characterId) {
      loadConversation();
    }
  }, [user, characterId]);

  const loadConversation = async () => {
    if (!user || !characterId) return;

    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('character_id', characterId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading conversation:', error);
        return;
      }

      if (conversations && conversations.length > 0) {
        const conversation = conversations[0];
        setConversationId(conversation.id);
        setCurrentConversation(conversation as Conversation);
        
        // Parse messages safely
        try {
          const parsedMessages = Array.isArray(conversation.messages) 
            ? (conversation.messages as unknown as Message[])
            : [];
          setMessages(parsedMessages);
        } catch (parseError) {
          console.error('Error parsing messages:', parseError);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error in loadConversation:', error);
    }
  };

  const createConversation = async (charId: number, charName: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          character_id: charId,
          character_name: charName,
          messages: [] as any,
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setConversationId(data.id);
        setCurrentConversation(data as Conversation);
        setMessages([]);
      }
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la conversación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !content.trim() || !characterId || !characterName) return;

    setLoading(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);

    try {
      // Generate AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content, characterName),
        sender: 'character',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage, aiResponse];
      setMessages(updatedMessages);

      // Save to database
      if (conversationId) {
        // Update existing conversation
        const { error } = await supabase
          .from('conversations')
          .update({
            messages: updatedMessages as any,
            last_message_at: new Date().toISOString(),
          })
          .eq('id', conversationId);

        if (error) throw error;
      } else {
        // Create new conversation
        const { data, error } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            character_id: characterId,
            character_name: characterName,
            messages: updatedMessages as any,
            last_message_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setConversationId(data.id);
          setCurrentConversation(data as Conversation);
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string, characterName: string): string => {
    const responses = [
      `¡Hola! Soy ${characterName}, es un placer conocerte 💕`,
      `${userMessage}... ¡qué interesante! Cuéntame más sobre eso ✨`,
      `Me encanta hablar contigo. ¿Qué planes tienes para hoy? 🌸`,
      `Eres muy dulce, me haces sonreír 😊`,
      `¿Te gusta el anime? ¡A mí me fascina! ¿Cuál es tu favorito? 🎌`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return {
    messages,
    loading,
    sendMessage,
    currentConversation,
    createConversation,
  };
};
