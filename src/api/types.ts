export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ResponseType = "json" | "text" | "arrayBuffer" | "stream";

export type EndpointCategory =
  | "User"
  | "Dashboard"
  | "Zones"
  | "Records"
  | "Cache"
  | "Allowed"
  | "Blocked"
  | "Apps"
  | "Settings"
  | "DnsClient"
  | "Administration"
  | "Logs";

export interface EndpointParam {
  readonly name: string;
  readonly description?: string;
  readonly required?: boolean;
  readonly type?: "string" | "number" | "boolean" | "enum";
  readonly values?: readonly string[];
}

export interface EndpointDefinition {
  readonly id: string;
  readonly category: EndpointCategory;
  readonly method: HttpMethod;
  readonly path: string;
  readonly description: string;
  readonly docUrl?: string;
  readonly requiresToken?: boolean;
  readonly defaultQuery?: Readonly<Record<string, string | number | boolean>>;
  readonly queryParams?: readonly EndpointParam[];
  readonly notes?: string;
}

export type QueryPrimitive = string | number | boolean;
export type QueryValue = QueryPrimitive | null | undefined;
export type QueryValues = QueryValue | QueryValue[];

export type QueryParams = Record<string, QueryValues>;
export type HeaderRecord = Record<string, string>;

export interface ApiCallOptions {
  readonly query?: QueryParams;
  readonly headers?: HeaderRecord;
  readonly body?: BodyInit | Record<string, unknown> | null;
  readonly method?: HttpMethod;
  readonly token?: string;
  readonly responseType?: ResponseType;
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
  readonly includeToken?: boolean;
}

export interface ApiCallResult<T = unknown> {
  readonly endpoint: EndpointDefinition;
  readonly data: T;
  readonly status: string;
  readonly raw: unknown;
  readonly response: Response;
}

export interface TechnitiumApiEnvelope<T = unknown> {
  status?: string;
  response?: T;
  errorCode?: string;
  errorMessage?: string;
  errorDetails?: unknown;
  [key: string]: unknown;
}

export interface LoginResponse {
  displayName: string;
  username: string;
  totpEnabled: boolean;
  token: string;
  info?: Record<string, unknown>;
  [key: string]: unknown;
}

export type SessionInfoResponse = LoginResponse;

export interface DashboardStatsResponse {
  stats?: Record<string, unknown>;
  mainChartData?: Record<string, unknown>;
  queryResponseChartData?: Record<string, unknown>;
  queryTypeChartData?: Record<string, unknown>;
  protocolTypeChartData?: Record<string, unknown>;
  topClients?: Array<Record<string, unknown>>;
  topDomains?: Array<Record<string, unknown>>;
  topBlockedDomains?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface ZoneSummary {
  name: string;
  type: string;
  [key: string]: unknown;
}

export interface PaginatedZoneList {
  pageNumber: number;
  totalPages: number;
  totalZones: number;
  zones: ZoneSummary[];
}

export interface ZoneRecord {
  name: string;
  type: string;
  ttl?: number;
  disabled?: boolean;
  rData?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ZoneRecordListResponse {
  zone?: Record<string, unknown>;
  records: ZoneRecord[];
}

export interface CachedZoneList {
  domain: string;
  zones?: Array<Record<string, unknown>>;
  records?: Array<Record<string, unknown>>;
}

export interface AllowedZoneList {
  domain: string;
  zones?: Array<Record<string, unknown>>;
}

export interface BlockedZoneList {
  domain: string;
  zones?: Array<Record<string, unknown>>;
}

export interface LogFileSummary {
  fileName: string;
  size: string;
}

export interface LogListResponse {
  logFiles: LogFileSummary[];
}

export interface DnsResolveResponse {
  question?: Array<Record<string, unknown>>;
  answer?: Array<Record<string, unknown>>;
  authority?: Array<Record<string, unknown>>;
  additional?: Array<Record<string, unknown>>;
  rawResponses?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface TechnitiumConfigAuth {
  username?: string;
  password?: string;
  token?: string;
  totp?: string;
}

export interface TechnitiumConfigApi {
  baseUrl: string;
  timeoutMs?: number;
  verifyTls?: boolean;
  defaultHeaders?: HeaderRecord;
}

export interface TechnitiumConfigCli {
  defaultOutputFormat?: "json" | "text" | "raw";
  prettyPrintJson?: boolean;
  colorizeJson?: boolean;
}

export interface TechnitiumConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  api: TechnitiumConfigApi;
  auth: TechnitiumConfigAuth;
  cli: TechnitiumConfigCli;
  commands?: Array<Record<string, unknown>>;
}
