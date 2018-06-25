export interface IPayloadDTO {
    dataCount: number,
    errorCount: number,
    getData: any[],
    getError: string[],
    httpStatusCode: number
    info: string,
}