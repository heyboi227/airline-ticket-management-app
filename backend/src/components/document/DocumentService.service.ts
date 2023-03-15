import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import DocumentModel from "./DocumentModel.model";
import { IAddDocument } from "./dto/IAddDocument.dto";

export interface IDocumentAdapterOptions extends IAdapterOptions {
  showCountry: boolean;
  showUser: boolean;
}

export const DefaultDocumentAdapterOptions: IDocumentAdapterOptions = {
  showCountry: true,
  showUser: true,
};

export default class DocumentService extends BaseService<
  DocumentModel,
  IDocumentAdapterOptions
> {
  tableName(): string {
    return "document";
  }

  protected async adaptToModel(
    data: any,
    options: IDocumentAdapterOptions
  ): Promise<DocumentModel> {
    const document = new DocumentModel();

    document.documentId = +data?.document_id;
    document.countryId = +data?.country_id;
    document.type = data?.type;
    document.documentNumber = data?.document_number;
    document.userId = +data?.user_id;

    if (options.showCountry) {
      document.country = await this.services.country.getById(
        document.countryId,
        {}
      );
    }

    if (options.showUser) {
      document.user = await this.services.user.getById(document.userId, {
        removeActivationCode: true,
        removePassword: true,
      });
    }

    return document;
  }

  public async add(data: IAddDocument): Promise<DocumentModel> {
    return this.baseAdd(data, DefaultDocumentAdapterOptions);
  }

  public async deleteById(documentId: number) {
    return this.baseDeleteById(documentId);
  }

  public async getByDocumentNumber(
    documentNumber: string
  ): Promise<DocumentModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue(
        "document_number",
        documentNumber,
        DefaultDocumentAdapterOptions
      )
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getAllByUserId(
    userId: number,
    options: IDocumentAdapterOptions = DefaultDocumentAdapterOptions
  ): Promise<DocumentModel[]> {
    return this.getAllByFieldNameAndValue("user_id", userId, options);
  }
}
