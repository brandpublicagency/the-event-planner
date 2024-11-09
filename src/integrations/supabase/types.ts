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
      events: {
        Row: {
          bride_email: string | null
          bride_mobile: string | null
          bride_name: string | null
          client_address: string | null
          created_at: string
          created_by: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          groom_email: string | null
          groom_mobile: string | null
          groom_name: string | null
          id: string
          name: string
          pax: number | null
          status: Database["public"]["Enums"]["event_status"] | null
          venue_id: string | null
        }
        Insert: {
          bride_email?: string | null
          bride_mobile?: string | null
          bride_name?: string | null
          client_address?: string | null
          created_at?: string
          created_by?: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          groom_email?: string | null
          groom_mobile?: string | null
          groom_name?: string | null
          id?: string
          name: string
          pax?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
          venue_id?: string | null
        }
        Update: {
          bride_email?: string | null
          bride_mobile?: string | null
          bride_name?: string | null
          client_address?: string | null
          created_at?: string
          created_by?: string | null
          event_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          groom_email?: string | null
          groom_mobile?: string | null
          groom_name?: string | null
          id?: string
          name?: string
          pax?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cal_username: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cal_username?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cal_username?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      venue_availability: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_time: string
          event_id: string | null
          id: string
          notes: string | null
          start_time: string
          status: Database["public"]["Enums"]["availability_type"] | null
          venue_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_time: string
          event_id?: string | null
          id?: string
          notes?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["availability_type"] | null
          venue_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_time?: string
          event_id?: string | null
          id?: string
          notes?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["availability_type"] | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_availability_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_availability_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gbt_bit_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bool_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bool_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bpchar_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_bytea_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_cash_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_cash_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_date_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_date_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_enum_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_enum_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float4_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float4_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_float8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_inet_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int2_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int2_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int4_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int4_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_int8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_intv_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad8_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_macad8_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_numeric_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_oid_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_oid_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_text_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_time_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_time_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_timetz_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_ts_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_ts_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_tstz_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_uuid_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_uuid_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_var_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbt_var_fetch: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey_var_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey_var_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey16_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey16_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey2_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey2_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey32_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey32_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey4_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey4_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey8_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gbtreekey8_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
    }
    Enums: {
      availability_type: "available" | "tentative" | "booked" | "blocked"
      event_status:
        | "Inquiry"
        | "Tentative"
        | "Confirmed"
        | "Completed"
        | "Cancelled"
      event_type:
        | "Wedding"
        | "Corporate Event"
        | "Celebration"
        | "Conference"
        | "Other"
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
