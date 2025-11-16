export interface TechnitiumErrorContext {
  readonly endpointId?: string;
  readonly endpointPath?: string;
  readonly statusCode?: number;
  readonly statusText?: string;
  readonly status?: string;
  readonly payload?: unknown;
  readonly cause?: unknown;
}

export class TechnitiumError extends Error {
  public readonly context: TechnitiumErrorContext;

  constructor(message: string, context: TechnitiumErrorContext = {}) {
    super(message);
    this.name = "TechnitiumError";
    this.context = context;
  }
}

export class TechnitiumConfigurationError extends TechnitiumError {
  constructor(message: string, context: TechnitiumErrorContext = {}) {
    super(message, context);
    this.name = "TechnitiumConfigurationError";
  }
}

export class TechnitiumTimeoutError extends TechnitiumError {
  constructor(message: string, context: TechnitiumErrorContext = {}) {
    super(message, context);
    this.name = "TechnitiumTimeoutError";
  }
}

export class TechnitiumHttpError extends TechnitiumError {
  constructor(message: string, context: TechnitiumErrorContext = {}) {
    super(message, context);
    this.name = "TechnitiumHttpError";
  }
}

export class TechnitiumApiError extends TechnitiumError {
  public readonly status: string | undefined;

  constructor(message: string, context: TechnitiumErrorContext & { status?: string } = {}) {
    super(message, context);
    this.name = "TechnitiumApiError";
    this.status = context.status;
  }
}
