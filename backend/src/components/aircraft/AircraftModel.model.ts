import Model from "../../common/Model.interface";

export default class AircraftModel implements Model {
  aircraftId: number;
  aircraftType: "Narrow-body" | "Wide-body";
  aircraftName: string;
}
