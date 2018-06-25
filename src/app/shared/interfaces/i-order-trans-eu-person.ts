export interface IOrderTransEuPerson {
    trans_id: string,
    custom_id: string,
    family_name: string,
    given_name: string,
    email: string, // valid email
    telepone: string, // digits, and +-() characters and whitespaces
    fax: string  // digits, and +-() characters and whitespaces
}
