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
      events: EventsTable;
      profiles: ProfilesTable;
      venue_availability: VenueAvailabilityTable;
      venues: VenuesTable;
      packages: PackagesTable;
      package_venues: PackageVenuesTable;
      package_inclusions: PackageInclusionsTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: DatabaseFunctions;
    Enums: DatabaseEnums;
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}