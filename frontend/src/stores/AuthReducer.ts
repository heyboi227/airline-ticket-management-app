export interface AuthStoreData {
  role: "visitor" | "user" | "administrator";
  identity: string;
  id: number;
  authToken: string;
  refreshToken: string;
}

export const DefaultAuthStoreData: AuthStoreData = {
  role: "visitor",
  identity: "",
  id: 0,
  authToken: "",
  refreshToken: "",
};

let InitialAuthStoreData: AuthStoreData = DefaultAuthStoreData;

type TUpdateRole = {
  type: "auth.update";
  key: "role";
  value: "visitor" | "user" | "administrator";
};
type TUpdateId = { type: "auth.update"; key: "id"; value: number };
type TUpdateStrings = {
  type: "auth.update";
  key: "identity" | "authToken" | "refreshToken";
  value: string;
};
type TReset = { type: "auth.reset" };

type TAuthStoreAction = TUpdateRole | TUpdateId | TUpdateStrings | TReset;

export function AuthStoreReducer(
  state: AuthStoreData = InitialAuthStoreData,
  action: TAuthStoreAction
): AuthStoreData {
  switch (action.type) {
    case "auth.update":
      return { ...state, [action.key]: action.value } as AuthStoreData;
    case "auth.reset":
      return { ...DefaultAuthStoreData };
    default:
      return { ...state } as AuthStoreData;
  }
}
