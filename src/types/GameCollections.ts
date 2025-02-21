import { ExportGameConfig } from "./ExportGameConfig";
import { ScannedGamesConfig } from "./ScannedGamesConfig";

export interface GameCollections {
  scannedGames: ScannedGamesConfig[];
  exportedGames: ExportGameConfig[];
}
