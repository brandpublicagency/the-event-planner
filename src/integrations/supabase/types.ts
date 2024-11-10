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
      event_venues: {
        Row: {
          event_id: string
          venue_id: string
        }
        Insert: {
          event_id: string
          venue_id: string
        }
        Update: {
          event_id?: string
          venue_id?: string
        }
        Relationships: [
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
          bride_email: string | null
          bride_mobile: string | null
          bride_name: string | null
          client_address: string | null
          company_address: string | null
          company_name: string | null
          company_vat: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          event_code: string
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          groom_email: string | null
          groom_mobile: string | null
          groom_name: string | null
          name: string
          package_id: string | null
          pax: number | null
          status: Database["public"]["Enums"]["event_status"] | null
        }
        Insert: {
          bride_email?: string | null
          bride_mobile?: string | null
          bride_name?: string | null
          client_address?: string | null
          company_address?: string | null
          company_name?: string | null
          company_vat?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          event_code: string
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          groom_email?: string | null
          groom_mobile?: string | null
          groom_name?: string | null
          name: string
          package_id?: string | null
          pax?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
        }
        Update: {
          bride_email?: string | null
          bride_mobile?: string | null
          bride_name?: string | null
          client_address?: string | null
          company_address?: string | null
          company_name?: string | null
          company_vat?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          event_code?: string
          event_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          groom_email?: string | null
          groom_mobile?: string | null
          groom_name?: string | null
          name?: string
          package_id?: string | null
          pax?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "events_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_venues: {
        Row: {
          package_id: string
          venue_id: string
        }
        Insert: {
          package_id: string
          venue_id: string
        }
        Update: {
          package_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_venues_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_venues_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          accommodation_nights: number | null
          accommodation_rooms: number | null
          base_price: number
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          id: string
          max_guests: number | null
          name: string
          package_type: string
        }
        Insert: {
          accommodation_nights?: number | null
          accommodation_rooms?: number | null
          base_price: number
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          max_guests?: number | null
          name: string
          package_type: string
        }
        Update: {
          accommodation_nights?: number | null
          accommodation_rooms?: number | null
          base_price?: number
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: string
          max_guests?: number | null
          name?: string
          package_type?: string
        }
        Relationships: []
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
        Relationships: []
      }
      venues: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_available: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      block_venues_for_package: {
        Args: {
          package_uuid: string
        }
        Returns: undefined
      }
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
      package_type: "full_package" | "medium_package" | "venue_only"
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
