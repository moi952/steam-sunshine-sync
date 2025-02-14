import { SteamGame } from "steam-library-scanner";
import { SunshineConfig } from "./SunshineConfig";

export interface ExportGameConfig {
  uniqueId: string;
  appId: string;
  sunshineConfig: SunshineConfig;
  gameInfos: SteamGame;
}
