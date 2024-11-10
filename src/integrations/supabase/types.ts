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
      corporate_details: {
        Row: {
          company_address: string | null
          company_name: string | null
          company_vat: string | null
          contact_email: string | null
          contact_mobile: string | null
          contact_person: string | null
          created_at: string
          event_code: string
          updated_at: string
        }
        Insert: {
          company_address?: string | null
          company_name?: string | null
          company_vat?: string | null
          contact_email?: string | null
          contact_mobile?: string | null
          contact_person?: string | null
          created_at?: string
          event_code: string
          updated_at?: string
        }
        Update: {
          company_address?: string | null
          company_name?: string | null
          company_vat?: string | null
          contact_email?: string | null
          contact_mobile?: string | null
          contact_person?: string | null
          created_at?: string
          event_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "corporate_details_event_code_fkey"
            columns: ["event_code"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["event_code"]
          },
        ]
      }
      event_venues: {
        Row: {
          event_code: string
          venue_id: string
        }
        Insert: {
          event_code: string
          venue_id: string
        }
        Update: {
          event_code?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_venues_event_code_fkey"
            columns: ["event_code"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_code"]
          },
          {
            foreignKeyName: "event_venues_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          client_address: string | null
          created_at: string
          created_by: string | null
          description: string | null
          event_code: string
          event_date: string | null
          event_type: string
          name: string
          package_id: string | null
          pax: number | null
          updated_at: string
        }
        Insert: {
          client_address?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_code: string
          event_date?: string | null
          event_type: string
          name: string
          package_id?: string | null
          pax?: number | null
          updated_at?: string
        }
        Update: {
          client_address?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_code?: string
          event_date?: string | null
          event_type?: string
          name?: string
          package_id?: string | null
          pax?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      pdf_files: {
        Row: {
          created_at: string
          file_path: string
          filename: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_path: string
          filename: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string
          filename?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pdf_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_processed_content: {
        Row: {
          content: string | null
          created_at: string
          id: string
          pdf_id: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          pdf_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          pdf_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_processed_content_pdf_id_fkey"
            columns: ["pdf_id"]
            isOneToOne: false
            referencedRelation: "pdf_files"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          mobile: string | null
          surname: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          mobile?: string | null
          surname?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          mobile?: string | null
          surname?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      wedding_details: {
        Row: {
          bride_email: string | null
          bride_mobile: string | null
          bride_name: string | null
          created_at: string
          event_code: string
          groom_email: string | null
          groom_mobile: string | null
          groom_name: string | null
          updated_at: string
        }
        Insert: {
          bride_email?: string | null
          bride_mobile?: string | null
          bride_name?: string | null
          created_at?: string
          event_code: string
          groom_email?: string | null
          groom_mobile?: string | null
          groom_name?: string | null
          updated_at?: string
        }
        Update: {
          bride_email?: string | null
          bride_mobile?: string | null
          bride_name?: string | null
          created_at?: string
          event_code?: string
          groom_email?: string | null
          groom_mobile?: string | null
          groom_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_details_event_code_fkey"
            columns: ["event_code"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["event_code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
