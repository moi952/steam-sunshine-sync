import { SteamGame } from "steam-library-scanner";
import { ExportGameConfig } from "./ExportGameConfig";

export interface GameCollections {
  scannedGames: SteamGame[];
  selectedGames: SteamGame[];
  exportedGames: ExportGameConfig[];
}
