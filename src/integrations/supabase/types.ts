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
          template?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_notification_id: string | null
          id: string
          recipient: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_notification_id?: string | null
          id?: string
          recipient: string
          status: string
          subject: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_notification_id?: string | null
          id?: string
          recipient?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_event_notification_id_fkey"
            columns: ["event_notification_id"]
            isOneToOne: false
            referencedRelation: "event_notifications"
            referencedColumns: ["id"]
          },
        ]
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
      event_notifications: {
        Row: {
          created_at: string
          event_code: string
          id: string
          is_completed: boolean
          is_read: boolean
          notification_type: string
          scheduled_for: string
          sent_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_code: string
          id?: string
          is_completed?: boolean
          is_read?: boolean
          notification_type: string
          scheduled_for: string
          sent_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_code?: string
          id?: string
          is_completed?: boolean
          is_read?: boolean
          notification_type?: string
          scheduled_for?: string
          sent_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_notifications_event_code_fkey"
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
      holiday_messages: {
        Row: {
          created_at: string
          holiday_date: string
          holiday_name: string
          id: string
          message_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          holiday_date: string
          holiday_name: string
          id?: string
          message_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          holiday_date?: string
          holiday_name?: string
          id?: string
          message_text?: string
          updated_at?: string
        }
        Relationships: []
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
      motivational_messages: {
        Row: {
          created_at: string
          id: string
          message_text: string
          message_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_text: string
          message_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_text?: string
          message_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          action_type: string | null
          created_at: string
          description_template: string
          id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          description_template: string
          id?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          action_type?: string | null
          created_at?: string
          description_template?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_triggers: {
        Row: {
          created_at: string
          days_offset: number | null
          enabled: boolean
          event_relative: boolean
          id: string
          template_type: string
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          days_offset?: number | null
          enabled?: boolean
          event_relative?: boolean
          id?: string
          template_type: string
          trigger_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          days_offset?: number | null
          enabled?: boolean
          event_relative?: boolean
          id?: string
          template_type?: string
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_triggers_template_type_fkey"
            columns: ["template_type"]
            isOneToOne: true
            referencedRelation: "notification_templates"
            referencedColumns: ["type"]
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
      user_activities: {
        Row: {
          action: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          timestamp: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          action: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          timestamp?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          action?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          timestamp?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      generate_unique_event_code: {
        Args: {
          base_code: string
        }
        Returns: string
      }
      get_entity_history: {
        Args: {
          p_entity_type: string
          p_entity_id: string
          p_limit?: number
        }
        Returns: {
          action: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          timestamp: string | null
          user_id: string
          user_name: string
        }[]
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
      get_recent_activities: {
        Args: {
          p_limit?: number
        }
        Returns: {
          action: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          timestamp: string | null
          user_id: string
          user_name: string
        }[]
      }
      lca: {
        Args: {
          "": unknown[]
        }
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
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree2text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltxtq_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      nlevel: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      text2ltree: {
        Args: {
          "": string
        }
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
