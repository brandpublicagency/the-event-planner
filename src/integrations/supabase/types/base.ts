export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      document_categories: {
        Row: {
          category_id: string
          created_at: string
          document_id: string
          id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          document_id: string
          id?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          document_id?: string
          id?: string
        }
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
          title: string | null
          updated_at: string
          user_id: string | null
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
          title?: string | null
          updated_at?: string
          user_id?: string | null
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
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
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
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed: boolean
          created_at: string
          due_date: string | null
          id: string
          mentioned_in: Json | null
          mentions: Json | null
          notes: string[] | null
          priority: string | null
          status: string
          task_code: string | null
          title: string
          todos: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean
          created_at?: string
          due_date?: string | null
          id?: string
          mentioned_in?: Json | null
          mentions?: Json | null
          notes?: string[] | null
          priority?: string | null
          status: string
          task_code?: string | null
          title: string
          todos?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean
          created_at?: string
          due_date?: string | null
          id?: string
          mentioned_in?: Json | null
          mentions?: Json | null
          notes?: string[] | null
          priority?: string | null
          status?: string
          task_code?: string | null
          title?: string
          todos?: string[] | null
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
