import { Profile } from "./profile"

export interface SaleEntry {
  sale: Sale
  saleitem: SaleItem[]
}

export interface Sale {
  id: number
  userid: number
  invoice_no: number
  date: string
  name: string
  address: string
  total_amount: number
  amount_in_word: string
  state: string
  state_code: string
  total_tax_value: number
  total_rate_value: number
  gsttin_no: string
  vehicalno: string
  session: string
  type: string
  financeby: string
  financedownpayment: number
}

export interface SaleItem {
  id: number
  sl_no: number
  item: string
  hsn_code: string
  model_no: string
  sl_no_and_emie_no: string
  quantity: number
  rate: number
  cgst_per: number
  sgst_per: number
  igst_per: number
  gst_tax_value: number
  item_amount: number
}
export interface Print {
  saleData: SaleEntry, type: string, profile: Profile
}
