import fs from "node:fs";
import path from "node:path";

import TOML from "@iarna/toml";
import config from "config";
import { logger } from "@/lib/logger";
import type { Config, AppConfig, ApiConfig, AuthConfig, CliConfig } from "@/types/config";

const fallbackConfig: Config = {
  app: {
    name: "technitiumdns-cli",
    version: "0.0.0",
    description: "Technitium DNS CLI",
  },
  api: {
    baseUrl: "http://localhost:5380/api",
    timeoutMs: 15000,
    verifyTls: true,
  },
  auth: {
    username: undefined,
    password: undefined,
    token: undefined,
    totp: undefined,
  },
  cli: {
    defaultOutputFormat: "json",
    prettyPrintJson: true,
    colorizeJson: true,
  },
};

const secretsPath = path.resolve(process.cwd(), "config", "secrets.toml");
let secretsLoaded = false;
let secretsCache: Partial<Config> = {};

function loadSecretsConfig(): Partial<Config> {
  if (secretsLoaded) {
    return secretsCache;
  }

  secretsLoaded = true;

  if (!fs.existsSync(secretsPath)) {
    secretsCache = {};
    return secretsCache;
  }

  try {
    const raw = fs.readFileSync(secretsPath, "utf8");
    const parsed = TOML.parse(raw) as Partial<Config>;
    secretsCache = parsed ?? {};
  } catch (error) {
    secretsCache = {};
    const reason = error instanceof Error ? error.message : String(error);
    logger.warn(`Failed to load secrets configuration from ${secretsPath}: ${reason}`);
  }

  return secretsCache;
}

function readSection<T>(key: string, fallback: T): T {
  if (!config.has(key)) {
    return fallback;
  }

  try {
    return config.get<T>(key);
  } catch (error) {
    if (error instanceof Error) {
      logger.warn(`Failed to load configuration section "${key}": ${error.message}`);
    }
    return fallback;
  }
}

export function loadConfig(): Config {
  try {
    const secrets = loadSecretsConfig();
    const app = { ...fallbackConfig.app, ...readSection<AppConfig>("app", fallbackConfig.app) };
    const api = { ...fallbackConfig.api, ...readSection<ApiConfig>("api", fallbackConfig.api) };
    const auth = { ...fallbackConfig.auth, ...readSection<AuthConfig>("auth", fallbackConfig.auth) };
    const cli = { ...fallbackConfig.cli, ...readSection<CliConfig>("cli", fallbackConfig.cli) };

    const mergedApp = { ...app, ...(secrets.app ?? {}) } satisfies AppConfig;
    const mergedApi = { ...api, ...(secrets.api ?? {}) } satisfies ApiConfig;
    const mergedAuth = { ...auth, ...(secrets.auth ?? {}) } satisfies AuthConfig;
    const mergedCli = { ...cli, ...(secrets.cli ?? {}) } satisfies CliConfig;

    return { app: mergedApp, api: mergedApi, auth: mergedAuth, cli: mergedCli };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to load configuration: ${error.message}`);
    }
    return fallbackConfig;
  }
}

export const appConfig = loadConfig();
