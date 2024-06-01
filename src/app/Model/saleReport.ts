export interface SaleReport {
    id:number
    userid: number
    invoice_no: number
    date: string
    name: string
    gsttin_no: string
    session: string
    gsttype: string
    hsn_code: string
    rate: number
    cgst_per: number
    cgst_per_value: number
    sgst_per: number
    sgst_per_value: number
    igst_per: number
    igst_per_value: number
    gst_tax_value: number
    item_amount: number
    isdeleted: string
}
