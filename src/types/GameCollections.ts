import { SteamGame } from "steam-library-scanner";
import { ExportGameConfig } from "./ExportGameConfig";
import { ScannedGamesConfig } from "./ScannedGamesConfig";

export interface GameCollections {
  scannedGames: ScannedGamesConfig[];
  selectedGames: SteamGame[];
  exportedGames: ExportGameConfig[];
}
