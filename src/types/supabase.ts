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
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          address: string
          city: string
          state: string
          zip: string
          date_of_birth: string
          ssn: string
          mothers_maiden_name: string
          referral_source: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          address: string
          city: string
          state: string
          zip: string
          date_of_birth: string
          ssn: string
          mothers_maiden_name: string
          referral_source: string
          is_admin: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          date_of_birth?: string
          ssn?: string
          mothers_maiden_name?: string
          referral_source?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
