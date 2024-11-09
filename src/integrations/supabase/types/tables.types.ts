import { Database } from "./database.types";

export interface EventsTable {
  Row: {
    id: string;
    name: string;
    pax: number | null;
    event_date: string;
    event_type: Database["public"]["Enums"]["event_type"];
    status: Database["public"]["Enums"]["event_status"] | null;
    venue_id: string | null;
    created_by: string | null;
    created_at: string;
    bride_name: string | null;
    bride_email: string | null;
    bride_mobile: string | null;
    groom_name: string | null;
    groom_email: string | null;
    groom_mobile: string | null;
    client_address: string | null;
  };
  Insert: {
    id?: string;
    name: string;
    pax?: number | null;
    event_date: string;
    event_type: Database["public"]["Enums"]["event_type"];
    status?: Database["public"]["Enums"]["event_status"] | null;
    venue_id?: string | null;
    created_by?: string | null;
    created_at?: string;
    bride_name?: string | null;
    bride_email?: string | null;
    bride_mobile?: string | null;
    groom_name?: string | null;
    groom_email?: string | null;
    groom_mobile?: string | null;
    client_address?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    pax?: number | null;
    event_date?: string;
    event_type?: Database["public"]["Enums"]["event_type"];
    status?: Database["public"]["Enums"]["event_status"] | null;
    venue_id?: string | null;
    created_by?: string | null;
    created_at?: string;
    bride_name?: string | null;
    bride_email?: string | null;
    bride_mobile?: string | null;
    groom_name?: string | null;
    groom_email?: string | null;
    groom_mobile?: string | null;
    client_address?: string | null;
  };
}

export interface ProfilesTable {
  Row: {
    id: string;
    updated_at: string;
    full_name: string | null;
    avatar_url: string | null;
    cal_username: string | null;
  };
  Insert: {
    id: string;
    updated_at?: string;
    full_name?: string | null;
    avatar_url?: string | null;
    cal_username?: string | null;
  };
  Update: {
    id?: string;
    updated_at?: string;
    full_name?: string | null;
    avatar_url?: string | null;
    cal_username?: string | null;
  };
}

export interface VenueAvailabilityTable {
  Row: {
    id: string;
    venue_id: string;
    start_time: string;
    end_time: string;
    status: Database["public"]["Enums"]["availability_type"] | null;
    event_id: string | null;
    notes: string | null;
    created_at: string | null;
    created_by: string | null;
  };
  Insert: {
    id?: string;
    venue_id: string;
    start_time: string;
    end_time: string;
    status?: Database["public"]["Enums"]["availability_type"] | null;
    event_id?: string | null;
    notes?: string | null;
    created_at?: string | null;
    created_by?: string | null;
  };
  Update: {
    id?: string;
    venue_id?: string;
    start_time?: string;
    end_time?: string;
    status?: Database["public"]["Enums"]["availability_type"] | null;
    event_id?: string | null;
    notes?: string | null;
    created_at?: string | null;
    created_by?: string | null;
  };
}

export interface VenuesTable {
  Row: {
    id: string;
    name: string;
    description: string | null;
    capacity: number | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    description?: string | null;
    capacity?: number | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    description?: string | null;
    capacity?: number | null;
    created_at?: string;
  };
}

export interface PackagesTable {
  Row: {
    id: string;
    name: string;
    description: string | null;
    package_type: Database["public"]["Enums"]["package_type"];
    base_price: number;
    discount_percentage: number;
    max_guests: number | null;
    accommodation_nights: number | null;
    accommodation_rooms: number | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    name: string;
    description?: string | null;
    package_type: Database["public"]["Enums"]["package_type"];
    base_price: number;
    discount_percentage: number;
    max_guests?: number | null;
    accommodation_nights?: number | null;
    accommodation_rooms?: number | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    name?: string;
    description?: string | null;
    package_type?: Database["public"]["Enums"]["package_type"];
    base_price?: number;
    discount_percentage?: number;
    max_guests?: number | null;
    accommodation_nights?: number | null;
    accommodation_rooms?: number | null;
    created_at?: string;
  };
}

export interface PackageVenuesTable {
  Row: {
    package_id: string;
    venue_id: string;
  };
  Insert: {
    package_id: string;
    venue_id: string;
  };
  Update: {
    package_id?: string;
    venue_id?: string;
  };
}

export interface PackageInclusionsTable {
  Row: {
    id: string;
    package_id: string;
    category: string;
    item: string;
    quantity: number | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    package_id: string;
    category: string;
    item: string;
    quantity?: number | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    package_id?: string;
    category?: string;
    item?: string;
    quantity?: number | null;
    created_at?: string;
  };
}