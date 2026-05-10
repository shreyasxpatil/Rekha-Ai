export type LeadStatus = "New" | "Called" | "Closed" | "Lost";

export interface Lead {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  location_type: string;
  camera_brand: string;
  camera_count: number;
  features: string[];
  total_quote: number;
  city: string;
  state?: string;
  pincode?: string;
  status: LeadStatus;
}
