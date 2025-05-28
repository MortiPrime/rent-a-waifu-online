
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'character';
  timestamp: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  character_id: number;
  character_name: string;
  messages: Message[];
  last_message_at: string;
  created_at: string;
}

export interface Character {
  id: number;
  name: string;
  description: string;
  image: string;
  tier: 'basic' | 'premium' | 'vip';
  traits: string[];
  age: number;
  occupation?: string;
  personality?: string;
}

export interface GirlfriendProfile {
  id?: string;
  user_id: string;
  stage_name: string;
  real_name: string;
  age: number;
  description: string;
  images: string[];
  pricing: {
    basic_chat: number;
    premium_chat: number;
    video_call: number;
  };
  availability: {
    days: string[];
    hours: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
