import { SteamGame } from "steam-library-scanner";

export interface GameCollections {
  scannedGames: SteamGame[];
  selectedGames: SteamGame[];
  exportedGames: SteamGame[];
}
