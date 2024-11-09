export interface DatabaseEnums {
  availability_type: "available" | "tentative" | "booked" | "blocked";
  event_status:
    | "Inquiry"
    | "Tentative"
    | "Confirmed"
    | "Completed"
    | "Cancelled";
  event_type:
    | "Wedding"
    | "Corporate Event"
    | "Celebration"
    | "Conference"
    | "Other";
  package_type: "full_package" | "medium_package" | "venue_only";
}