import { Conf } from "electron-conf";
import { SteamGame } from "steam-library-scanner";
import { v4 as uuidv4 } from "uuid";
import { GameToExportConfig } from "../types/GameToExportConfig";
import { SunshineAppConfig } from "../types/SunshineAppConfig";

interface GamesToExportServiceType {
  getGamesToExport(): { success: boolean; data?: GameToExportConfig[]; error?: string };
  getGameToExportById(_uniqueId: string): {
    success: boolean;
    data?: GameToExportConfig;
    error?: string;
  };
  setGamesToExport(_games: GameToExportConfig[]): { success: boolean; error?: string };
  addGameToExportConfig(_game: GameToExportConfig): { success: boolean; error?: string };
  createGameToExportConfig(
    _sunshineAppConfig: SunshineAppConfig,
    _gameDetails: SteamGame,
    _scannedGameUniqueId?: string,
  ): { success: boolean; data?: GameToExportConfig; error?: string };
  updateGameToExportConfig(
    _uniqueId: string,
    _updatedGame: GameToExportConfig,
  ): { success: boolean; error?: string };
  removeGameToExportConfig(_uniqueId: string): { success: boolean; error?: string };
  removeGamesToExportByAppId(_appId: string): { success: boolean; error?: string };
  removeAllGamesToExport(): { success: boolean; error?: string };
  resetState(): void;
}

class GamesToExportService implements GamesToExportServiceType {
  private config = new Conf<{ gamesToExport: GameToExportConfig[] }>({
    defaults: {
      gamesToExport: [],
    },
  });

  isLoading = false;
  isError = false;
  errorMessage = "";

  private static generateUniqueId(): string {
    return uuidv4();
  }

  private static initNewGameToExport(
    sunshineAppConfig: SunshineAppConfig,
    gameDetails: SteamGame,
  ): GameToExportConfig {
    const newSunshineApp = { ...sunshineAppConfig }; // Assuming this is your helper
    return {
      uniqueId: GamesToExportService.generateUniqueId(),
      isExported: false,
      appId: gameDetails.appId,
      sunshineConfig: newSunshineApp,
      gameInfos: gameDetails,
    };
  }

  public getGamesToExport(): { success: boolean; data?: GameToExportConfig[]; error?: string } {
    try {
      const games = this.config.get("gamesToExport", []);
      return { success: true, data: games };
    } catch (error: any) {
      return { success: false, error: `Error fetching games to export: ${error.message}` };
    }
  }

  public getGameToExportById(uniqueId: string): {
    success: boolean;
    data?: GameToExportConfig;
    error?: string;
  } {
    try {
      const games = this.getGamesToExport().data;
      if (!games) return { success: false, error: "No games to export found" };
      const gameToExport = games.find((game) => game.uniqueId === uniqueId);
      if (!gameToExport) return { success: false, error: "Game not found" };
      return { success: true, data: gameToExport };
    } catch (error: any) {
      return { success: false, error: `Error fetching game to export by ID: ${error.message}` };
    }
  }

  public setGamesToExport(games: GameToExportConfig[]): { success: boolean; error?: string } {
    try {
      this.config.set("gamesToExport", games);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Error setting games to export: ${error.message}` };
    }
  }

  public addGameToExportConfig(game: GameToExportConfig): { success: boolean; error?: string } {
    try {
      const games = this.getGamesToExport().data;
      if (games) {
        games.push(game);
      } else {
        return { success: false, error: "Failed to add game to export: games is undefined" };
      }
      this.setGamesToExport(games);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Error adding game to export: ${error.message}` };
    }
  }

  public createGameToExportConfig(
    sunshineAppConfig: SunshineAppConfig,
    gameDetails: SteamGame,
    scannedGameUniqueId?: string,
  ): { success: boolean; data?: GameToExportConfig; error?: string } {
    try {
      const newGameToExportConfig = GamesToExportService.initNewGameToExport(
        sunshineAppConfig,
        gameDetails,
      );
      if (scannedGameUniqueId) newGameToExportConfig.scannedGameUniqueId = scannedGameUniqueId;
      const games = this.getGamesToExport().data;
      if (games) {
        games.push(newGameToExportConfig);
      } else {
        return {
          success: false,
          error: "Failed to create game to export config: games is undefined",
        };
      }
      this.setGamesToExport(games);
      return { success: true, data: newGameToExportConfig };
    } catch (error: any) {
      return { success: false, error: `Error creating game to export config: ${error.message}` };
    }
  }

  public updateGameToExportConfig(
    uniqueId: string,
    updatedGame: GameToExportConfig,
  ): { success: boolean; error?: string } {
    try {
      const games = this.getGamesToExport().data;
      if (!games) {
        return { success: false, error: "No games to export found" };
      }
      const updatedGames = games.map((game) =>
        game.uniqueId === uniqueId ? { ...game, ...updatedGame } : game,
      );
      this.setGamesToExport(updatedGames);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Error updating game to export config: ${error.message}` };
    }
  }

  public removeGameToExportConfig(uniqueId: string): { success: boolean; error?: string } {
    try {
      const games = this.getGamesToExport().data;
      if (!games) {
        return { success: false, error: "No games to export found" };
      }
      const updatedGames = games.filter((game) => game.uniqueId !== uniqueId);
      this.setGamesToExport(updatedGames);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Error removing game to export config: ${error.message}` };
    }
  }

  public removeGamesToExportByAppId(appId: string): { success: boolean; error?: string } {
    try {
      const games = this.getGamesToExport().data;
      if (!games) {
        return { success: false, error: "No games to export found" };
      }
      const updatedGames = games.filter((game) => game.appId !== appId);
      this.setGamesToExport(updatedGames);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Error removing games to export by appId: ${error.message}` };
    }
  }

  public removeAllGamesToExport(): { success: boolean; error?: string } {
    try {
      this.setGamesToExport([]);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Error removing all games to export: ${error.message}` };
    }
  }

  public resetState(): void {
    this.isLoading = false;
    this.isError = false;
    this.errorMessage = "";
  }
}

export const gamesToExportService = new GamesToExportService();
