import IModel from "../../common/IModel.interface";

export default class AircraftModel implements IModel {
  aircraftId: number;
  type: "Narrow-body" | "Wide-body";
  name: string;
}
