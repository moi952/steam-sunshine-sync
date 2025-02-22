import { SteamGame } from "steam-library-scanner";
import { SunshineAppConfig } from "./SunshineAppConfig";

export interface GameToExportConfig {
  uniqueId: string;
  scannedGameUniqueId?: string;
  isExported: boolean;
  appId: string;
  sunshineConfig: SunshineAppConfig;
  gameInfos: SteamGame;
}
