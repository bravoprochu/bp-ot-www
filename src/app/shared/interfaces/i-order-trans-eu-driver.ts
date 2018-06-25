export interface IOrderTransEuDriver {
    trans_id: string, //TransID,
    custom_id: string,
    family_name:string,
    given_name: string,
    id_card_number: string, //driver's ID card number
    email: string,
    telephone: string // digits, and +-() characters and whitespaces
}
