import Router from "./Router.interface";
import { Algorithm } from "jsonwebtoken";

export interface MailConfiguration {
  host: string;
  port: number;
  email: string;
  password: string;
  debug: boolean;
}

export interface TokenProperties {
  duration: number;
  keys: {
    public: string;
    private: string;
  };
}

export interface AuthTokenOptions {
  issuer: string;
  algorithm: Algorithm;
  tokens: {
    auth: TokenProperties;
    refresh: TokenProperties;
  };
}

interface Config {
  server: {
    port: number;
    static: {
      index: string | false;
      dotfiles: "allow" | "deny";
      cacheControl: boolean;
      etag: boolean;
      maxAge: number;
      route: string;
      path: string;
    };
  };
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    charset: "utf8" | "utf8mb4" | "ascii";
    timezone: string;
    supportBigNumbers: boolean;
  };
  routers: Router[];
  mail: MailConfiguration;
  auth: {
    user: AuthTokenOptions;
    administrator: AuthTokenOptions;
    allowAllRoutesWithoutAuthTokens: boolean;
  };
}

export default Config;
