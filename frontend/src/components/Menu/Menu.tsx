import { useState } from "react";
import MenuAdministrator from "./MenuAdministrator";
import MenuNonAdministrator from "./MenuNonAdministrator";
import AppStore from "../../stores/AppStore";

export default function Menu() {
  const [role, setRole] = useState<"visitor" | "user" | "administrator">(
    AppStore.getState().auth.role
  );

  AppStore.subscribe(() => {
    setRole(AppStore.getState().auth.role);
  });

  return (
    <>
      {role !== "administrator" && <MenuNonAdministrator />}
      {role === "administrator" && <MenuAdministrator />}
    </>
  );
}
