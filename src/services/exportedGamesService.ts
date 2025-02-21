import { v4 as uuidv4 } from "uuid";
import { SteamGame } from "steam-library-scanner";
import { ExportGameConfig, SunshineAppConfig } from "../types";
import { initEmptySunshineApp } from "../utils/sunshineAppHelper";

interface ExportedGamesService {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;

  getExportedGames: () => Promise<ExportGameConfig[]>;
  getExportedGameById: (_uniqueId: string) => Promise<ExportGameConfig | undefined>;
  setExportedGames: (_games: ExportGameConfig[]) => Promise<void>;
  addExportedGameConfig: (_game: ExportGameConfig) => Promise<void>;
  createExportedGameConfig: (
    _sunshineAppConfig: SunshineAppConfig,
    _gameDetails: SteamGame,
    _scannedGameUniqueId?: string,
  ) => Promise<ExportGameConfig>;
  updateExportedGameConfig: (_uniqueId: string, _game: ExportGameConfig) => Promise<void>;
  removeExportedGameConfig: (_uniqueId: string) => Promise<void>;
  removeExportedGameConfigsByAppId: (_appId: string) => Promise<void>;
  removeAllExportedGames: () => Promise<void>;
  resetState: () => void;
}

function initNewExportedGame(
  sunshineAppConfig: SunshineAppConfig,
  gameDetails: SteamGame,
): ExportGameConfig {
  const newSunshineApp = initEmptySunshineApp(sunshineAppConfig);
  return {
    uniqueId: uuidv4(),
    isExported: false,
    appId: gameDetails.appId,
    sunshineConfig: newSunshineApp,
    gameInfos: gameDetails,
  };
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

  getExportedGameById: async (uniqueId: string) => {
    const games = await exportedGamesService.getExportedGames();
    return games.find((game) => game.uniqueId === uniqueId);
  },

  setExportedGames: async (games: ExportGameConfig[]) => {
    await window.electronGameStorageApi.setExportedGames(games);
  },

  createExportedGameConfig: async (
    sunshineAppConfig: SunshineAppConfig,
    gameDetails: SteamGame,
    scannedGameUniqueId?: string,
  ) => {
    const newExportedGameConfig = initNewExportedGame(sunshineAppConfig, gameDetails);
    if (scannedGameUniqueId) newExportedGameConfig.scannedGameUniqueId = scannedGameUniqueId;
    const games = await exportedGamesService.getExportedGames();
    const updatedGames = [...games, newExportedGameConfig];
    await exportedGamesService.setExportedGames(updatedGames);

    return newExportedGameConfig;
  },

  addExportedGameConfig: async (game: ExportGameConfig) => {
    game.uniqueId = uuidv4();
    const games = await exportedGamesService.getExportedGames();
    const updatedGames = [...games, game];
    await exportedGamesService.setExportedGames(updatedGames);
  },

  updateExportedGameConfig: async (uniqueId: string, updatedGame: ExportGameConfig) => {
    const games = await exportedGamesService.getExportedGames();
    const updatedGames = games.map((game) =>
      game.uniqueId === uniqueId ? { ...game, ...updatedGame } : game,
    );
    console.log("updatedGames", updatedGames);
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
