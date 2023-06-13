import IModel from "../../common/IModel.interface";

export default class TravelClassModel implements IModel {
  travelClassId: number;
  travelClassName: "Business" | "Economy";
  travelClassSubname: string;
}
