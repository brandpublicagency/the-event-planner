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
          }
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
          }
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
          }
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
          {
            foreignKeyName: "events_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_selections: {
        Row: {
          canape_package: string | null
          canape_selections: string[] | null
          created_at: string
          custom_menu_details: string | null
          event_code: string
          is_custom: boolean | null
          notes: string | null
          plated_starter: string | null
          starter_type: string | null
          updated_at: string
        }
        Insert: {
          canape_package?: string | null
          canape_selections?: string[] | null
          created_at?: string
          custom_menu_details?: string | null
          event_code: string
          is_custom?: boolean | null
          notes?: string | null
          plated_starter?: string | null
          starter_type?: string | null
          updated_at?: string
        }
        Update: {
          canape_package?: string | null
          canape_selections?: string[] | null
          created_at?: string
          custom_menu_details?: string | null
          event_code?: string
          is_custom?: boolean | null
          notes?: string | null
          plated_starter?: string | null
          starter_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_selections_event_code_fkey"
            columns: ["event_code"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["event_code"]
          }
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
      pdf_processed_content: {
        Row: {
          id: string
          pdf_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pdf_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pdf_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_processed_content_pdf_id_fkey"
            columns: ["pdf_id"]
            isOneToOne: false
            referencedRelation: "event_documents"
            referencedColumns: ["id"]
          }
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
          }
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