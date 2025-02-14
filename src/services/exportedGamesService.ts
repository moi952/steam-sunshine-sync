import { v4 as uuidv4 } from "uuid";
import { ExportGameConfig } from "../types";

interface ExportedGamesService {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;

  getExportedGames: () => Promise<ExportGameConfig[]>;
  setExportedGames: (_games: ExportGameConfig[]) => Promise<void>;
  addExportedGameConfig: (_game: ExportGameConfig) => Promise<void>;
  removeExportedGameConfig: (_uniqueId: string) => Promise<void>;
  removeExportedGameConfigsByAppId: (_appId: string) => Promise<void>;
  removeAllExportedGames: () => Promise<void>;
  resetState: () => void;
}

export const exportedGamesService: ExportedGamesService = {
  isLoading: false,
  isError: false,
  errorMessage: "",

  getExportedGames: async () => {
    exportedGamesService.isLoading = true;
    exportedGamesService.isError = false;
    exportedGamesService.errorMessage = "";
    try {
      const games = await window.electronGameStorageApi.getExportedGames();
      exportedGamesService.isLoading = false;
      return games;
    } catch (error: any) {
      exportedGamesService.isLoading = false;
      exportedGamesService.isError = true;
      exportedGamesService.errorMessage = error.message;
      throw error;
    }
  },

  setExportedGames: async (games: ExportGameConfig[]) => {
    await window.electronGameStorageApi.setExportedGames(games);
  },

  addExportedGameConfig: async (game: ExportGameConfig) => {
    game.uniqueId = uuidv4(); // Génère un identifiant unique
    const games = await exportedGamesService.getExportedGames();
    const updatedGames = [...games, game];
    await exportedGamesService.setExportedGames(updatedGames);
  },

  removeExportedGameConfig: async (uniqueId: string) => {
    const games = await exportedGamesService.getExportedGames();
    const updatedGames = games.filter((game) => game.uniqueId !== uniqueId);
    await exportedGamesService.setExportedGames(updatedGames);
  },

  removeExportedGameConfigsByAppId: async (appId: string) => {
    const games = await exportedGamesService.getExportedGames();
    const updatedGames = games.filter((game) => game.appId !== appId);
    await exportedGamesService.setExportedGames(updatedGames);
  },

  removeAllExportedGames: async () => {
    await exportedGamesService.setExportedGames([]);
  },

  resetState: () => {
    exportedGamesService.isLoading = false;
    exportedGamesService.isError = false;
    exportedGamesService.errorMessage = "";
  },
};
