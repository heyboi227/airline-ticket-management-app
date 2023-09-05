import {
  CLSReportCallback,
  FCPReportCallback,
  FIDReportCallback,
  LCPReportCallback,
  TTFBReportCallback,
} from "web-vitals";

type WebVitalsCallback =
  | CLSReportCallback
  | FIDReportCallback
  | FCPReportCallback
  | LCPReportCallback
  | TTFBReportCallback;

const reportWebVitals = (onPerfEntry: WebVitalsCallback) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals")
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(onPerfEntry as CLSReportCallback);
        onFID(onPerfEntry as FIDReportCallback);
        onFCP(onPerfEntry as FCPReportCallback);
        onLCP(onPerfEntry as LCPReportCallback);
        onTTFB(onPerfEntry as TTFBReportCallback);
      })
      .catch((error) => console.error("An error occured: ", error));
  }
};

export default reportWebVitals;
