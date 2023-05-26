import { CLSReportCallback } from "web-vitals";

const reportWebVitals = (onPerfEntry: CLSReportCallback) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals")
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
      })
      .catch((error) => console.error("An error occured: ", error));
  }
};

export default reportWebVitals;
