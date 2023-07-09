import Ajv from "ajv";
import addFormats from "ajv-formats";
import ServiceData from "../../../common/ServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface EditTimeZoneDto {
  timeZoneName: string;
}

export interface EditTimeZone extends ServiceData {
  time_zone_name: string;
}

const EditTimeZoneValidator = ajv.compile({
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

export { EditTimeZoneValidator };
