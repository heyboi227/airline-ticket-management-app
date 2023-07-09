import Model from "../../common/Model.interface";

export default class TravelClassModel implements Model {
  travelClassId: number;
  travelClassName: "Business" | "Economy";
  travelClassSubname: string;
}
