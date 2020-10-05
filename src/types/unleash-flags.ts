import type { StorageProvider } from "../UnleashProvider/types";

interface Config {
  url: string;
  clientKey: string;
  appName: string;
  environment?: string;
  refreshInterval?: number;
  metricsInterval?: number;
  disableMetrics?: boolean;
  storageProvider?: StorageProvider;
}

interface Context {
  [key: string]: string;
}

interface Variant {
  name: string;
  payload?: {
    type: string;
    value: string;
  };
}

interface Toggle {
  name: string;
  enabled: boolean;
  variant: Variant;
}

export type { Config, Context, Toggle, Variant };
