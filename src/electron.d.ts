import { SteamGame } from "steam-library-scanner";
import { Game } from "./types";

declare global {
  interface Window {
    electron: {
      invoke: (_channel: string, ..._args: any[]) => Promise<any>;
      openFileDialog: () => Promise<string>;
      detectSunshinePath: () => Promise<string>;
      detectSteamPath: () => Promise<string>;
      addToSunshine: (_app: any) => Promise<void>;
    };
    electronSteamLibraryScannerApi: {
      getAllSteamGames: (_steamPath: string, _userId: string) => Promise<any>;
      getNonSteamGames: (_steamPath: string, _userId: string) => Promise<any>;
      getSteamGames: (_steamPath: string) => Promise<any>;
      getSteamUsers: (_steamPath: string) => Promise<{ id: string; name: string }[]>;
    };
    electronGameStorageApi: {
      // Retrieve Steam games
      getSteamGames: () => Promise<any>;

      // Retrieve Non-Steam games
      getNonSteamGames: () => Promise<any>;

      // Retrieve all games (Steam + Non-Steam)
      getAllGames: () => Promise<any>;

      // Add a Steam game
      addSteamGame: (_game: SteamGame) => Promise<void>;

      // Add a Non-Steam game
      addNonSteamGame: (_game: SteamGame) => Promise<void>;

      // Update a Steam game
      updateSteamGame: (_updatedGame: SteamGame) => Promise<void>;

      // Update a Non-Steam game
      updateNonSteamGame: (_updatedGame: SteamGame) => Promise<void>;

      // Delete a game
      deleteGame: (_gameId: string) => Promise<void>;

      // Retrieve a game by its ID
      getGameById: (_gameId: string) => Promise<any>;
    };
    electronSettingsStorageApi: {
      getSettings: () => Promise<Record<string, any>>;
      saveSettings: (_settings: Record<string, any>) => Promise<void>;
    };
  }
}

export {};
