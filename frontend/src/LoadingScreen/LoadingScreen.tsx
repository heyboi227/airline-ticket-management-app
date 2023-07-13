import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import "./LoadingScreen.scss";
import blackLogo from "../static/png/logo-black.png";
import AppStore from "../stores/AppStore";

export default function LoadingScreen() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (AppStore.getState().auth.id !== 0) return setLoading(false);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`loading-screen ${
        loading ? "show" : "hide"
      } d-flex flex-column align-items-center`}
    >
      <img
        src={blackLogo}
        alt="Air Soko black text logo"
        className="loading-logo"
      />
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}
