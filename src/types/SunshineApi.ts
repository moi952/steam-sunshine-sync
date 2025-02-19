import { SunshineAppConfigNew } from "./SunshineAppConfigNew";

export type SunshineGetAppsResponse = {
  env: {
    PATH: string;
  };
  apps: SunshineAppConfigNew[];
};

export type SunshineCreateAppResponse = {
  status: boolean;
  status_code?: string;
  error?: string;
};
