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
      document_categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category_ids: string[] | null
          content: Json | null
          created_at: string
          deleted_at: string | null
          id: string
          mentioned_in: Json | null
          mentions: Json | null
          template: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_ids?: string[] | null
          content?: Json | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          mentioned_in?: Json | null
          mentions?: Json | null
          template?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category_ids?: string[] | null
          content?: Json | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          mentioned_in?: Json | null
          mentions?: Json | null
          template?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_documents: {
        Row: {
          content_type: string | null
          created_at: string
          event_code: string | null
          file_name: string
          file_path: string
          id: string
          updated_at: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          event_code?: string | null
          file_name: string
          file_path: string
          id?: string
          updated_at?: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          event_code?: string | null
          file_name?: string
          file_path?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_documents_event_code_fkey"
            columns: ["event_code"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_code"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          company: string | null
          completed: boolean | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          end_time: string | null
          event_code: string
          event_date: string | null
          event_notes: string | null
          event_type: string
          external_event_id: string | null
          mentioned_in: Json | null
          mentions: Json | null
          name: string
          package_id: string | null
          pax: number | null
          primary_email: string | null
          primary_name: string | null
          primary_phone: string | null
          secondary_email: string | null
          secondary_name: string | null
          secondary_phone: string | null
          start_time: string | null
          updated_at: string
          vat_number: string | null
          venues: string[] | null
        }
        Insert: {
          address?: string | null
          company?: string | null
          completed?: boolean | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          end_time?: string | null
          event_code: string
          event_date?: string | null
          event_notes?: string | null
          event_type: string
          external_event_id?: string | null
          mentioned_in?: Json | null
          mentions?: Json | null
          name: string
          package_id?: string | null
          pax?: number | null
          primary_email?: string | null
          primary_name?: string | null
          primary_phone?: string | null
          secondary_email?: string | null
          secondary_name?: string | null
          secondary_phone?: string | null
          start_time?: string | null
          updated_at?: string
          vat_number?: string | null
          venues?: string[] | null
        }
        Update: {
          address?: string | null
          company?: string | null
          completed?: boolean | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          end_time?: string | null
          event_code?: string
          event_date?: string | null
          event_notes?: string | null
          event_type?: string
          external_event_id?: string | null
          mentioned_in?: Json | null
          mentions?: Json | null
          name?: string
          package_id?: string | null
          pax?: number | null
          primary_email?: string | null
          primary_name?: string | null
          primary_phone?: string | null
          secondary_email?: string | null
          secondary_name?: string | null
          secondary_phone?: string | null
          start_time?: string | null
          updated_at?: string
          vat_number?: string | null
          venues?: string[] | null
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
      menu_choices: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          label: string
          section_id: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: string
          label: string
          section_id: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          label?: string
          section_id?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_choices_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "menu_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category: string | null
          choice: string
          choice_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          label: string
          updated_at: string | null
          value: string
        }
        Insert: {
          category?: string | null
          choice: string
          choice_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          label: string
          updated_at?: string | null
          value: string
        }
        Update: {
          category?: string | null
          choice?: string
          choice_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          label?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "menu_choices"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_options: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          price_type: string
          type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          price_type: string
          type: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          price_type?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_sections: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          label: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: string
          label: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          label?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      menu_selections: {
        Row: {
          buffet_meat_selections: string[] | null
          buffet_salad_selection: string | null
          buffet_starch_selections: string[] | null
          buffet_vegetable_selections: string[] | null
          canape_package: string | null
          canape_selections: string[] | null
          created_at: string
          custom_menu_details: string | null
          dessert_canapes: string[] | null
          dessert_type: string | null
          event_code: string
          individual_cake_quantities: Json | null
          individual_cakes: string[] | null
          is_custom: boolean | null
          karoo_meat_selection: string | null
          karoo_salad_selection: string | null
          karoo_starch_selection: string[] | null
          karoo_vegetable_selections: string[] | null
          main_course_type: string | null
          notes: string | null
          other_selections: string[] | null
          other_selections_quantities: Json | null
          plated_main_selection: string | null
          plated_salad_selection: string | null
          plated_starter: string | null
          starter_type: string | null
          traditional_dessert: string | null
          updated_at: string
        }
        Insert: {
          buffet_meat_selections?: string[] | null
          buffet_salad_selection?: string | null
          buffet_starch_selections?: string[] | null
          buffet_vegetable_selections?: string[] | null
          canape_package?: string | null
          canape_selections?: string[] | null
          created_at?: string
          custom_menu_details?: string | null
          dessert_canapes?: string[] | null
          dessert_type?: string | null
          event_code: string
          individual_cake_quantities?: Json | null
          individual_cakes?: string[] | null
          is_custom?: boolean | null
          karoo_meat_selection?: string | null
          karoo_salad_selection?: string | null
          karoo_starch_selection?: string[] | null
          karoo_vegetable_selections?: string[] | null
          main_course_type?: string | null
          notes?: string | null
          other_selections?: string[] | null
          other_selections_quantities?: Json | null
          plated_main_selection?: string | null
          plated_salad_selection?: string | null
          plated_starter?: string | null
          starter_type?: string | null
          traditional_dessert?: string | null
          updated_at?: string
        }
        Update: {
          buffet_meat_selections?: string[] | null
          buffet_salad_selection?: string | null
          buffet_starch_selections?: string[] | null
          buffet_vegetable_selections?: string[] | null
          canape_package?: string | null
          canape_selections?: string[] | null
          created_at?: string
          custom_menu_details?: string | null
          dessert_canapes?: string[] | null
          dessert_type?: string | null
          event_code?: string
          individual_cake_quantities?: Json | null
          individual_cakes?: string[] | null
          is_custom?: boolean | null
          karoo_meat_selection?: string | null
          karoo_salad_selection?: string | null
          karoo_starch_selection?: string[] | null
          karoo_vegetable_selections?: string[] | null
          main_course_type?: string | null
          notes?: string | null
          other_selections?: string[] | null
          other_selections_quantities?: Json | null
          plated_main_selection?: string | null
          plated_salad_selection?: string | null
          plated_starter?: string | null
          starter_type?: string | null
          traditional_dessert?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_selections_event_code_fkey"
            columns: ["event_code"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["event_code"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          event_code: string | null
          id: string
          notification_type: string
          read: boolean
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          event_code?: string | null
          id?: string
          notification_type: string
          read?: boolean
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          event_code?: string | null
          id?: string
          notification_type?: string
          read?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_event_code_fkey"
            columns: ["event_code"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_code"]
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
            referencedRelation: "event_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          mobile: string | null
          notification_preferences: Json | null
          surname: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          mobile?: string | null
          notification_preferences?: Json | null
          surname?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          mobile?: string | null
          notification_preferences?: Json | null
          surname?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      task_files: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_files_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed: boolean | null
          created_at: string
          due_date: string | null
          id: string
          mentioned_in: Json | null
          mentions: Json | null
          notes: string[] | null
          priority: string | null
          status: string | null
          task_code: string | null
          title: string
          todos: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string
          due_date?: string | null
          id?: string
          mentioned_in?: Json | null
          mentions?: Json | null
          notes?: string[] | null
          priority?: string | null
          status?: string | null
          task_code?: string | null
          title: string
          todos?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string
          due_date?: string | null
          id?: string
          mentioned_in?: Json | null
          mentions?: Json | null
          notes?: string[] | null
          priority?: string | null
          status?: string | null
          task_code?: string | null
          title?: string
          todos?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _ltree_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      delete_event_venues: {
        Args: { event_code_param: string }
        Returns: undefined
      }
      generate_unique_event_code: {
        Args: { base_code: string }
        Returns: string
      }
      get_pdf_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          pdf_id: string
          content: string
          created_at: string
          updated_at: string
        }[]
      }
      lca: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      log_user_activity: {
        Args: {
          p_user_id: string
          p_user_name: string
          p_action: string
          p_entity_type: string
          p_entity_id: string
          p_details?: Json
        }
        Returns: string
      }
      lquery_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_send: {
        Args: { "": unknown }
        Returns: string
      }
      ltree_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_send: {
        Args: { "": unknown }
        Returns: string
      }
      ltree2text: {
        Args: { "": unknown }
        Returns: string
      }
      ltxtq_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_send: {
        Args: { "": unknown }
        Returns: string
      }
      nlevel: {
        Args: { "": unknown }
        Returns: number
      }
      text2ltree: {
        Args: { "": string }
        Returns: unknown
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
