import { SteamGame } from "steam-library-scanner";

export interface ScannedGamesConfig {
  id: string;
  isSteamGame: boolean;
  gameDetails: SteamGame;
}
