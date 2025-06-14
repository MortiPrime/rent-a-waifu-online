export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          reason: string | null
          target_user_id: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
          target_user_id: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          client_id: string
          companion_id: string
          conversation_id: string
          created_at: string | null
          duration_minutes: number | null
          ended_at: string | null
          id: string
          payment_status: string | null
          session_type: string | null
          started_at: string | null
          total_cost: number | null
        }
        Insert: {
          client_id: string
          companion_id: string
          conversation_id: string
          created_at?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          payment_status?: string | null
          session_type?: string | null
          started_at?: string | null
          total_cost?: number | null
        }
        Update: {
          client_id?: string
          companion_id?: string
          conversation_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          payment_status?: string | null
          session_type?: string | null
          started_at?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companion_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      companion_listings: {
        Row: {
          age: number | null
          city: string | null
          companion_id: string | null
          contact_number: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          municipality: string | null
          pricing: Json | null
          promotion_plan: string | null
          stage_name: string
          state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          city?: string | null
          companion_id?: string | null
          contact_number?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          municipality?: string | null
          pricing?: Json | null
          promotion_plan?: string | null
          stage_name: string
          state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          city?: string | null
          companion_id?: string | null
          contact_number?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          municipality?: string | null
          pricing?: Json | null
          promotion_plan?: string | null
          stage_name?: string
          state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companion_listings_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companion_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companion_photos: {
        Row: {
          caption: string | null
          companion_id: string
          created_at: string | null
          display_order: number | null
          id: string
          is_primary: boolean | null
          photo_url: string
        }
        Insert: {
          caption?: string | null
          companion_id: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          photo_url: string
        }
        Update: {
          caption?: string | null
          companion_id?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "companion_photos_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companion_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companion_profiles: {
        Row: {
          age: number
          availability: Json | null
          city: string | null
          contact_number: string | null
          created_at: string | null
          description: string
          exit_rules: string[] | null
          id: string
          is_active: boolean | null
          municipality: string | null
          pricing: Json | null
          promotion_plan: string | null
          real_name: string
          stage_name: string
          state: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age: number
          availability?: Json | null
          city?: string | null
          contact_number?: string | null
          created_at?: string | null
          description: string
          exit_rules?: string[] | null
          id?: string
          is_active?: boolean | null
          municipality?: string | null
          pricing?: Json | null
          promotion_plan?: string | null
          real_name: string
          stage_name: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number
          availability?: Json | null
          city?: string | null
          contact_number?: string | null
          created_at?: string | null
          description?: string
          exit_rules?: string[] | null
          id?: string
          is_active?: boolean | null
          municipality?: string | null
          pricing?: Json | null
          promotion_plan?: string | null
          real_name?: string
          stage_name?: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      companion_rules: {
        Row: {
          companion_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          rule_text: string
          rule_type: string
        }
        Insert: {
          companion_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_text: string
          rule_type: string
        }
        Update: {
          companion_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_text?: string
          rule_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "companion_rules_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companion_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          character_id: number
          character_name: string
          created_at: string | null
          id: string
          last_message_at: string | null
          messages: Json | null
          user_id: string
        }
        Insert: {
          character_id: number
          character_name: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          messages?: Json | null
          user_id: string
        }
        Update: {
          character_id?: number
          character_name?: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          messages?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      mercadopago_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          external_reference: string | null
          id: string
          payment_id: string | null
          preference_id: string
          status: string | null
          subscription_months: number | null
          subscription_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          external_reference?: string | null
          id?: string
          payment_id?: string | null
          preference_id: string
          status?: string | null
          subscription_months?: number | null
          subscription_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          external_reference?: string | null
          id?: string
          payment_id?: string | null
          preference_id?: string
          status?: string | null
          subscription_months?: number | null
          subscription_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_proofs: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          message: string | null
          payment_method: string
          payment_month: string
          proof_image_url: string | null
          status: string
          subscription_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string | null
          payment_method: string
          payment_month: string
          proof_image_url?: string | null
          status?: string
          subscription_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string | null
          payment_method?: string
          payment_month?: string
          proof_image_url?: string | null
          status?: string
          subscription_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          favorite_characters: number[] | null
          full_name: string | null
          id: string
          subscription_expires_at: string | null
          subscription_type: string | null
          updated_at: string | null
          user_role: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          favorite_characters?: number[] | null
          full_name?: string | null
          id: string
          subscription_expires_at?: string | null
          subscription_type?: string | null
          updated_at?: string | null
          user_role?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          favorite_characters?: number[] | null
          full_name?: string | null
          id?: string
          subscription_expires_at?: string | null
          subscription_type?: string | null
          updated_at?: string | null
          user_role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          expires_at: string
          id: string
          payment_method: string | null
          payment_status: string | null
          starts_at: string
          subscription_type: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          expires_at: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          starts_at: string
          subscription_type: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          expires_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          starts_at?: string
          subscription_type?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_auth_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          email_confirmed_at: string
          created_at: string
          updated_at: string
          last_sign_in_at: string
          raw_user_meta_data: Json
          is_super_admin: boolean
          phone: string
          phone_confirmed_at: string
          banned_until: string
          deleted_at: string
        }[]
      }
      admin_update_auth_user: {
        Args: {
          target_user_id: string
          new_email?: string
          new_email_confirmed?: boolean
          new_banned_until?: string
          reason?: string
        }
        Returns: Json
      }
      admin_update_companion_plan: {
        Args: {
          companion_profile_id: string
          new_promotion_plan: string
          reason?: string
        }
        Returns: Json
      }
      admin_update_subscription_expiry: {
        Args: {
          target_user_id: string
          new_expires_at: string
          reason?: string
        }
        Returns: Json
      }
      admin_update_user_subscription: {
        Args: {
          target_user_id: string
          new_subscription_type: string
          new_expires_at: string
          reason?: string
        }
        Returns: Json
      }
      process_mercadopago_webhook: {
        Args: { payment_data: Json }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
