declare module "config" {
  export interface IConfig {
    get<T>(setting: string): T;
    has(setting: string): boolean;
  }

  const config: IConfig;
  export default config;
}

export interface AppConfig {
  name: string;
  version: string;
  description: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeoutMs?: number;
  verifyTls?: boolean;
}

export interface AuthConfig {
  username?: string;
  password?: string;
  token?: string;
  totp?: string;
}

export interface CliConfig {
  defaultOutputFormat?: "json" | "text" | "raw";
  prettyPrintJson?: boolean;
  colorizeJson?: boolean;
}

export interface Config {
  app: AppConfig;
  api: ApiConfig;
  auth: AuthConfig;
  cli: CliConfig;
}
