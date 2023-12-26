import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import "./LoadingScreen.scss";
import AppStore from "../stores/AppStore";
import { useLocation } from "react-router-dom";

interface LoadingScreenProps {
  loadingTime: number;
  loadingLogoImage: React.ReactNode;
}

export default function LoadingScreen(props: Readonly<LoadingScreenProps>) {
  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, props.loadingTime);

    return () => clearTimeout(timer);
  }, [location.pathname, props.loadingTime]);

  if (AppStore.getState().auth.id !== 0 && location.pathname === "/")
    return null;

  return (
    <div
      className={`loading-screen ${
        loading ? "show" : "hide"
      } d-flex flex-column align-items-center`}
    >
      {props.loadingLogoImage}
      <output>
        <Spinner animation="border">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </output>
    </div>
  );
}
