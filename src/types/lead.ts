export type LeadStatus = "New" | "Called" | "Closed" | "Lost";

export interface Lead {
  id?: string;
  created_at?: string;
  full_name?: string;
  phone?: string;
  state?: string;
  city?: string;
  pincode?: string;
  location_type?: string;
  camera_brand?: string;
  camera_count?: number | string;
  features?: string[];
  total_quote?: number;
  price_quote?: string;
  status?: LeadStatus;
}
