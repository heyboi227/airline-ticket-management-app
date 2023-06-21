import { useLocation } from "react-router-dom";
import IFlight from "../../../models/IFlight.model";

export default function OrderPage() {
  const location = useLocation();

  const flights: IFlight[] = location.state[0];
  return <div>Order page</div>;
}
