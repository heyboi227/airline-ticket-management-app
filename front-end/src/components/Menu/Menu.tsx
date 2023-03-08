import { useState } from "react";
import MenuAdministrator from "./MenuAdministrator";
import MenuUser from "./MenuUser";
import MenuVisitor from "./MenuVisitor";
import AppStore from "../../stores/AppStore";
import React from "react";

export default function Menu() {
  const [role, setRole] = useState<
    "visitor" | "user" | "activeUser" | "administrator"
  >(AppStore.getState().auth.role);

  AppStore.subscribe(() => {
    setRole(AppStore.getState().auth.role);
  });

  return (
    <>
      {(role === "visitor" || role === "user") && <MenuVisitor />}
      {role === "activeUser" && <MenuUser />}
      {role === "administrator" && <MenuAdministrator />}
    </>
  );
}
