import axios, { AxiosInstance } from "axios";
import https from "https";
import SettingsService from "./settingsService";
import { decrypt } from "./cryptoService";

export interface PrepCommand {
  do: string;
  undo: string;
  elevated: boolean;
}

export interface App {
  id: string;
  name: string;
  output: string;
  cmd: string;
  index: number;
  excludeGlobalPrepCmd: boolean;
  elevated: boolean;
  autoDetach: boolean;
  waitAll: boolean;
  exitTimeout: number;
  prepCmd: PrepCommand[];
  detached: string[];
  imagePath: string;
}

export interface Config {
  // ... configuration properties
}

export class SunshineService {
  private axiosInstance: AxiosInstance;
  private settingsService: SettingsService;

  /**
   *
   * @param settingsService
   */
  constructor(settingsService: SettingsService) {
    this.settingsService = settingsService;
    this.axiosInstance = axios.create({
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    // Interceptor to update base URL and authentication headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const settings = this.settingsService.getSettings();
        const { sunshineLogin, sunshinePassword, sunshineUrl } = settings;

        // Update Base URL
        config.baseURL = sunshineUrl;
        const decryptedPassword = decrypt(sunshinePassword);
        // Update the Authorization header
        config.headers.Authorization = `Basic ${Buffer.from(`${sunshineLogin}:${decryptedPassword}`).toString("base64")}`;

        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  // --- Endpoints Apps ---

  public async getApps(): Promise<App[]> {
    const response = await this.axiosInstance.get<App[]>("/api/apps");
    return response.data;
  }

  public async createApp(appData: any): Promise<App> {
    const response = await this.axiosInstance.post<App>("/api/apps", appData);
    return response.data;
  }

  public async updateApp(appId: string, appData: any): Promise<App> {
    const response = await this.axiosInstance.put<App>(`/api/apps/${appId}`, appData);
    return response.data;
  }

  public async deleteApp(appId: string): Promise<void> {
    await this.axiosInstance.delete(`/api/apps/${appId}`);
  }

  // --- Endpoints Configuration ---
  public async getConfig(): Promise<Config> {
    const response = await this.axiosInstance.get<Config>("/api/config");
    return response.data;
  }

  public async updateConfig(configData: any): Promise<Config> {
    const response = await this.axiosInstance.post<Config>("/api/config", configData);
    return response.data;
  }
}
