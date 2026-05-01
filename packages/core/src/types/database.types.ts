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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string | null
          id: string
          recipient_id: string
          requester_id: string
          status: Database["public"]["Enums"]["connection_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["connection_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connections_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_tags: {
        Row: {
          created_at: string | null
          profile_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          profile_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          profile_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_tags_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_color: string
          bio: string | null
          contact_email: string | null
          contact_email_privacy:
            | Database["public"]["Enums"]["privacy_level"]
            | null
          created_at: string | null
          full_name: string
          id: string
          onboarding_completed_at: string | null
          social_links: Json | null
          social_links_privacy:
            | Database["public"]["Enums"]["privacy_level"]
            | null
          updated_at: string | null
        }
        Insert: {
          avatar_color: string
          bio?: string | null
          contact_email?: string | null
          contact_email_privacy?:
            | Database["public"]["Enums"]["privacy_level"]
            | null
          created_at?: string | null
          full_name: string
          id: string
          onboarding_completed_at?: string | null
          social_links?: Json | null
          social_links_privacy?:
            | Database["public"]["Enums"]["privacy_level"]
            | null
          updated_at?: string | null
        }
        Update: {
          avatar_color?: string
          bio?: string | null
          contact_email?: string | null
          contact_email_privacy?:
            | Database["public"]["Enums"]["privacy_level"]
            | null
          created_at?: string | null
          full_name?: string
          id?: string
          onboarding_completed_at?: string | null
          social_links?: Json | null
          social_links_privacy?:
            | Database["public"]["Enums"]["privacy_level"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          created_at: string | null
          display_name: string | null
          domain: string
          id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          domain: string
          id?: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          domain?: string
          id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          is_system: boolean | null
          name: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          is_system?: boolean | null
          name: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_schools: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          school_domain: string
          school_email: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          school_domain: string
          school_email: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          school_domain?: string
          school_email?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_schools_school_domain_fkey"
            columns: ["school_domain"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["domain"]
          },
          {
            foreignKeyName: "user_schools_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_is_connected: { Args: { target_user_id: string }; Returns: boolean }
      check_same_school: { Args: { target_user_id: string }; Returns: boolean }
    }
    Enums: {
      connection_status: "pending" | "accepted" | "rejected"
      privacy_level: "public" | "connections" | "private"
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
      connection_status: ["pending", "accepted", "rejected"],
      privacy_level: ["public", "connections", "private"],
    },
  },
} as const
