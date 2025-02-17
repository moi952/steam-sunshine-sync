import { SteamGame } from "steam-library-scanner";
import { SunshineAppConfig } from "./SunshineAppConfig";

export interface ExportGameConfig {
  uniqueId: string;
  appId: string;
  sunshineConfig: SunshineAppConfig;
  gameInfos: SteamGame;
}
