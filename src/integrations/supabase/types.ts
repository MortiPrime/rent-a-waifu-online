export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
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
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string
          display_location: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          display_location?: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          display_location?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
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
            isOneToOne: true
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
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
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
