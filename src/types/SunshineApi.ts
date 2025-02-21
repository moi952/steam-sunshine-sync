import { SunshineAppConfig } from "./SunshineAppConfig";

export type SunshineGetAppsResponse = {
  env: {
    PATH: string;
  };
  apps: SunshineAppConfig[];
};

export type SunshineCreateAppResponse = {
  status: boolean;
  status_code?: string;
  error?: string;
};
