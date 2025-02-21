import { SteamGame } from "steam-library-scanner";

export interface ScannedGamesConfig {
  id: string;
  uniqueId: string;
  isSteamGame: boolean;
  gameDetails: SteamGame;
}
