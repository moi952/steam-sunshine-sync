import { SunshineAppConfig } from "./SunshineAppConfig";

export type ResponseSunshine = {
  env: {
    PATH: string;
  };
  apps: SunshineAppConfig[];
};
