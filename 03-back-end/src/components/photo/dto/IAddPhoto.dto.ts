import IServiceData from "../../../common/IServiceData.interface";

export default interface IAddPhoto extends IServiceData {
    file_path: string;
    document_id: number;
}
