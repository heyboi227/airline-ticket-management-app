import {
  faCheckSquare,
  faEdit,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Address, { formatAddress } from "../../../models/Address.model";
import User from "../../../models/User.model";
import UserAddressEditor from "./UserAddressEditor";

export interface UserAddressChangerProperties {
  address: Address;
  onAddressChange: (user: User) => void;
}

export default function UserAddressChanger(
  props: Readonly<UserAddressChangerProperties>
) {
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <>
      {editing && (
        <UserAddressEditor
          address={props.address}
          onAddressChange={props.onAddressChange}
          setEditing={setEditing}
        />
      )}

      {!editing && (
        <div className="row mb-1">
          <div className="col col-10">{formatAddress(props.address)}</div>
          <div className="col col-1">
            <FontAwesomeIcon
              icon={props.address.isActive ? faCheckSquare : faSquare}
            />{" "}
            {props.address.isActive ? "Active" : "Inactive"}
          </div>
          <div className="col col-1">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setEditing(true)}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
