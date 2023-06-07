import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddTimeZoneDto {
  timeZoneName: string;
}

export interface IAddTimeZone extends IServiceData {
  time_zone_name: string;
}

const AddTimeZoneValidator = ajv.compile({
  type: "object",
  properties: {
    timeZoneName: {
      type: "string",
      minLength: 2,
      maxLength: 128,
    },
  },
  required: ["timeZoneName"],
  additionalProperties: false,
});

export { AddTimeZoneValidator };
