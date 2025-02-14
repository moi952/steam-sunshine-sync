import { SteamGame } from "steam-library-scanner";

interface ScannedGamesService {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;

  getScannedGames: () => Promise<SteamGame[]>;
  setScannedGames: (_games: SteamGame[]) => Promise<void>;
  addScannedGame: (_game: SteamGame) => Promise<void>;
  removeScannedGame: (_gameId: string) => Promise<void>;
  resetState: () => void;
}

export const scannedGamesService: ScannedGamesService = {
  isLoading: false,
  isError: false,
  errorMessage: "",

  getScannedGames: async () => {
    scannedGamesService.isLoading = true;
    scannedGamesService.isError = false;
    scannedGamesService.errorMessage = "";
    try {
      const games = await window.electronGameStorageApi.getScannedGames();
      scannedGamesService.isLoading = false;
      return games;
    } catch (error: any) {
      scannedGamesService.isLoading = false;
      scannedGamesService.isError = true;
      scannedGamesService.errorMessage = error.message;
      throw error;
    }
  },

  setScannedGames: async (games: SteamGame[]) => {
    try {
      await window.electronGameStorageApi.setScannedGames(games);
    } catch (error: any) {
      scannedGamesService.isError = true;
      scannedGamesService.errorMessage = error.message;
      throw error;
    }
  },

  addScannedGame: async (game: SteamGame) => {
    try {
      const games = await scannedGamesService.getScannedGames();
      const updatedGames = [...games, game];
      await scannedGamesService.setScannedGames(updatedGames);
    } catch (error) {
      console.error("Error adding scanned game:", error);
      throw new Error("Failed to add scanned game.");
    }
  },

  removeScannedGame: async (gameId: string) => {
    try {
      const games = await scannedGamesService.getScannedGames();
      const updatedGames = games.filter((game) => game.appId !== gameId);
      await scannedGamesService.setScannedGames(updatedGames);
    } catch (error) {
      console.error("Error removing scanned game:", error);
      throw new Error("Failed to remove scanned game.");
    }
  },

  resetState: () => {
    scannedGamesService.isLoading = false;
    scannedGamesService.isError = false;
    scannedGamesService.errorMessage = "";
  },
};
