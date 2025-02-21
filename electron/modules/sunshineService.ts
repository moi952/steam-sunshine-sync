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

  private static getAppWithMandatoryFields() {
    return {
      "prep-cmd": [],
      "detached": [],
    };
  }

  public async getApps(): Promise<{ env: any; apps: App[] }> {
    const response = await this.axiosInstance.get<{ env: any; apps: any[] }>("/api/apps");

    // Keys to convert to boolean in the application object
    const boolKeys = ["exclude-global-prep-cmd", "elevated", "auto-detach", "wait-all"];

    // Transform the apps array
    response.data.apps = response.data.apps.map((app) => {
      // Create a copy of the application object
      const newApp = { ...app };

      // Convert boolean fields at the root level
      boolKeys.forEach((key) => {
        if (typeof newApp[key] === "string") {
          try {
            newApp[key] = JSON.parse(newApp[key]);
          } catch (error) {
            console.error(`Error parsing key ${key} with value ${newApp[key]}`);
          }
        }
      });

      // If the application contains a "prep-cmd" array, convert the "elevated" field in each command object
      if (Array.isArray(newApp["prep-cmd"])) {
        newApp["prep-cmd"] = newApp["prep-cmd"].map((cmdObj: any) => {
          if (typeof cmdObj.elevated === "string") {
            try {
              cmdObj.elevated = JSON.parse(cmdObj.elevated);
            } catch (error) {
              console.error(`Error parsing elevated in prep-cmd: ${cmdObj.elevated}`);
            }
          }
          return cmdObj;
        });
      }

      return newApp;
    });

    // Return the modified response object
    return response.data;
  }

  public async createApp(appData: any): Promise<App> {
    const emptyAppWithMandatoryFields = SunshineService.getAppWithMandatoryFields();
    const data = {
      ...emptyAppWithMandatoryFields,
      ...appData,
      ...{ index: -1 },
    };
    const response = await this.axiosInstance.post<App>("/api/apps", data);
    return response.data;
  }

  public async updateApp(appId: string, appData: any): Promise<App> {
    const emptyAppWithMandatoryFields = SunshineService.getAppWithMandatoryFields();
    const data = {
      ...emptyAppWithMandatoryFields,
      ...appData,
      ...{ index: appId },
    };
    console.log("data", data);
    const response = await this.axiosInstance.post<App>("/api/apps", data);
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
