import { TApiRole, api } from "../api/api";
import AppStore from "../stores/AppStore";
import { NavigateFunction } from "react-router-dom";

const dispatchAuthUpdate = (key: string, value: any) => {
  AppStore.dispatch({
    type: "auth.update",
    key,
    value,
  });
};

export const doLogin = (
  role: TApiRole,
  password: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  navigate: NavigateFunction,
  username?: string,
  email?: string
) => {
  api("post", `/api/auth/${role}/login`, role, {
    ...(role.includes("administrator") ? { username } : { email }),
    password,
  })
    .then((res) => {
      if (res.status !== "ok") {
        throw new Error(
          "Could not log in. Reason: " + JSON.stringify(res.data)
        );
      }

      return res.data;
    })
    .then((data) => {
      dispatchAuthUpdate("authToken", data?.authToken);
      dispatchAuthUpdate("refreshToken", data?.refreshToken);
      dispatchAuthUpdate(
        "identity",
        role.includes("administrator") ? username : email
      );
      dispatchAuthUpdate("id", +data?.id);
      dispatchAuthUpdate("role", role);

      if (role.includes("administrator")) {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }
    })
    .catch((error) => {
      setError(error?.message ?? "Could not log in!");

      setTimeout(() => {
        setError("");
      }, 3500);
    });
};
