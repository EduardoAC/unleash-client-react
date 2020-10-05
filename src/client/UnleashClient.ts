import { Metrics } from "../metrics";
import type { Config, Toggle } from "../types/unleash-flags";

export class UnleashClient {
  private flags: Toggle[];
  private url: URL;
  private clientKey: string;
  private timerRef?: any;
  private refreshInterval: number;
  private etag: string = "";
  private metrics: Metrics;

  constructor(config: Config) {
    const {
      url,
      clientKey,
      refreshInterval = 30,
      appName,
      metricsInterval = 30,
      disableMetrics,
    } = config
    this.flags = []
    this.validateConfiguration(config);
    this.url = new URL(`${url}`);
    this.clientKey = clientKey;
    this.refreshInterval = refreshInterval * 1000;
    this.metrics = new Metrics({
      appName,
      metricsInterval,
      disableMetrics,
      url,
      clientKey,
    });
  }

  public stop(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = undefined;
    }
  }

  public async start(): Promise<void> {
    this.stop();
    const interval = this.refreshInterval;
    await this.fetchFlags();
    this.timerRef = setInterval(() => this.fetchFlags(), interval);
  }

  public isEnabled(toggleName: string): boolean {
    const toggle = this.flags.find((t: Toggle) => t.name === toggleName);
    const enabled = toggle ? toggle.enabled : false;
    this.metrics.count(toggleName, enabled);
    return enabled;
  }
  /**
   * Fetch all the flags from the API and store them on the flags prop
   */
  private async fetchFlags() {
    const { url } = this;
    const headers: { [key: string]: string } = {
      Authorization: this.clientKey,
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-None-Match": this.etag,
    };

    try {
      const response = await fetch(url.toString(), {
        headers,
        method: "GET",
      });

      if (response.ok && response.status !== 304) {
        this.etag = response.headers.get("ETag") || "";
        const data = await response.json();
        this.flags = data.toggles;
      } else if (!response.ok) {
        throw Error("Request failed");
      }
    } catch {
      // no json, return nothing
      this.flags = [];
    }
  }

  private validateConfiguration(config: Config) {
    const { url, clientKey, appName } = config;
    // Validations
    if (!url) {
      throw new Error("url is required");
    }
    if (!clientKey) {
      throw new Error("clientKey is required");
    }
    if (!appName) {
      throw new Error("appName is required.");
    }
  }
}
