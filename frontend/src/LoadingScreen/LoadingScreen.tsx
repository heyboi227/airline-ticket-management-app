import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import "./LoadingScreen.scss";
import AppStore from "../stores/AppStore";

interface LoadingScreenProps {
  loadingTime: number;
  loadingLogoImage: React.ReactNode;
}

export default function LoadingScreen(props: Readonly<LoadingScreenProps>) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (AppStore.getState().auth.id !== 0) return setLoading(false);

    const timer = setTimeout(() => {
      setLoading(false);
    }, props.loadingTime);

    return () => clearTimeout(timer);
  }, [props.loadingTime]);

  return (
    <div
      className={`loading-screen ${
        loading ? "show" : "hide"
      } d-flex flex-column align-items-center`}
    >
      {props.loadingLogoImage}
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}
