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
  occupation: string;
  personality: string[];
}

export interface CompanionProfile {
  id: string;
  user_id: string;
  stage_name: string;
  real_name: string;
  age: number;
  description: string;
  state: string;
  city: string;
  municipality: string;
  contact_number: string;
  pricing: {
    basic_chat: number;
    premium_chat: number;
    video_call: number;
  };
  availability: {
    days: string[];
    hours: string;
  };
  promotion_plan: 'basic' | 'premium' | 'vip';
  exit_rules: string[];
  is_active: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface CompanionPhoto {
  id: string;
  companion_id: string;
  photo_url: string;
  is_primary: boolean;
  caption?: string;
  display_order: number;
  created_at: string;
}

export interface ChatSession {
  id: string;
  conversation_id: string;
  client_id: string;
  companion_id: string;
  session_type: 'basic_chat' | 'premium_chat' | 'video_call';
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  total_cost?: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export interface CompanionRule {
  id: string;
  companion_id: string;
  rule_type: 'boundary' | 'availability' | 'pricing' | 'behavior';
  rule_text: string;
  is_active: boolean;
  created_at: string;
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

export type UserRole = 'client' | 'girlfriend' | 'admin';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  user_role: UserRole;
  subscription_type?: string;
  subscription_expires_at?: string;
  favorite_characters?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface CompanionListing {
  id: string;
  companion_id: string;
  user_id: string;
  stage_name: string;
  description: string;
  age: number;
  state: string;
  city: string;
  municipality: string;
  contact_number: string;
  pricing: {
    basic_chat: number;
    premium_chat: number;
    video_call: number;
  };
  promotion_plan: 'basic' | 'premium' | 'vip';
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MercadoPagoTransaction {
  id: string;
  user_id: string;
  preference_id: string;
  payment_id?: string;
  external_reference?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  amount: number;
  currency: string;
  subscription_type: string;
  subscription_months: number;
  created_at: string;
  updated_at: string;
}

export interface LocationFilter {
  state?: string;
  city?: string;
  municipality?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // months
  features: string[];
  popular?: boolean;
}
