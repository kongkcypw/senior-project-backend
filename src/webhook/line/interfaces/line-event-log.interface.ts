export interface LineEventLog {
  uid?: string;
  type: string;
  message?: string;
  message_type?: string;
  message_text?: string;
  message_address?: string;
  message_latitude?: number;
  message_longitude?: number;
}