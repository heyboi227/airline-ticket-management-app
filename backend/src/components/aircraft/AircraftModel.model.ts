import IModel from "../../common/IModel.interface";

export default class AircraftModel implements IModel {
  aircraftId: number;
  aircraftType: "Narrow-body" | "Wide-body";
  aircraftName: string;
}
