import { SteamGame } from "steam-library-scanner";

export interface GameCollections {
  scannedGames: SteamGame[];
  exportedGames: SteamGame[];
}
