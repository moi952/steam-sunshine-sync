import { Conf } from "electron-conf";
import { SteamGame } from "steam-library-scanner";
import { v4 as uuidv4 } from "uuid";
import { isEqual } from "lodash";

export interface ScannedGamesConfig {
  id: string;
  uniqueId: string;
  isSteamGame: boolean;
  gameDetails: SteamGame;
}

interface SyncResult {
  toAdd: ScannedGamesConfig[];
  toUpdate: ScannedGamesConfig[];
  toRemove: ScannedGamesConfig[];
}

class ScannedGamesService {
  private config = new Conf<{ scannedGames: ScannedGamesConfig[] }>({
    defaults: {
      scannedGames: [],
    },
  });

  private static generateUniqueId(): string {
    return uuidv4();
  }

  private static generateComposedId(game: SteamGame): string {
    return game.cmd;
  }

  private static isSteamGame(game: SteamGame): boolean {
    return Boolean(game.appId && game.appId !== "0");
  }

  private static removeUndefinedFields(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Get the list of scanned games
  public getScannedGames(): { success: boolean; data: ScannedGamesConfig[]; error?: string } {
    try {
      const games = this.config.get("scannedGames", []);
      return { success: true, data: games };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: `Error retrieving scanned games: ${error.message}`,
      };
    }
  }

  // Retrieve a specific scanned game by its unique ID
  public getScannedGameById(uniqueId: string): {
    success: boolean;
    data?: ScannedGamesConfig;
    error?: string;
  } {
    const gamesResponse = this.getScannedGames();
    if (!gamesResponse.success) {
      return {
        success: false,
        error: gamesResponse.error || "Failed to retrieve scanned games",
      };
    }

    const foundGame = gamesResponse.data.find((game) => game.uniqueId === uniqueId);
    return foundGame
      ? { success: true, data: foundGame }
      : { success: false, error: "Game not found" };
  }

  // Set the scanned games in storage
  public setScannedGames(games: ScannedGamesConfig[]): { success: boolean; error?: string } {
    try {
      if (!Array.isArray(games) || games === null || games === undefined) {
        return { success: false, error: "Invalid data format: expected a non-null array" };
      }

      this.config.set("scannedGames", games);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: `Error setting scanned games: ${error.message}`,
      };
    }
  }

  // Sync the scanned games
  public syncScannedGames(newGames: SteamGame[]): {
    success: boolean;
    syncResult?: SyncResult;
    error?: string;
  } {
    if (!Array.isArray(newGames) || newGames.length === 0) {
      return { success: false, error: "No new games provided for sync" };
    }
    try {
      const storedGames = this.getScannedGames().data;
      const newGamesWithId: ScannedGamesConfig[] = newGames.map((game) => ({
        id: ScannedGamesService.generateComposedId(game),
        uniqueId:
          storedGames.find((g) => g.id === ScannedGamesService.generateComposedId(game))
            ?.uniqueId || ScannedGamesService.generateUniqueId(),
        isSteamGame: ScannedGamesService.isSteamGame(game),
        gameDetails: game,
      }));
      const storedGamesMap = new Map(storedGames.map((game) => [game.id, game]));
      const newGamesMap = new Map(newGamesWithId.map((game) => [game.id, game]));
      const toAdd = newGamesWithId.filter((game) => !storedGamesMap.has(game.id));
      const toUpdate = newGamesWithId.filter(
        (game) =>
          storedGamesMap.has(game.id) &&
          !isEqual(
            ScannedGamesService.removeUndefinedFields(storedGamesMap.get(game.id)?.gameDetails),
            ScannedGamesService.removeUndefinedFields(game.gameDetails),
          ),
      );
      const toRemove = storedGames.filter((game) => !newGamesMap.has(game.id));

      return {
        success: true,
        syncResult: { toAdd, toUpdate, toRemove },
      };
    } catch (error: any) {
      return { success: false, error: `Error syncing games: ${error.message}` };
    }
  }

  // Apply sync result
  public applySyncResult(syncResult: SyncResult): { success: boolean; error?: string } {
    if (!syncResult || typeof syncResult !== "object") {
      return { success: false, error: "Invalid sync result format" };
    }

    try {
      const storedGames = this.getScannedGames().data;

      // Add check to avoid duplicates
      const updatedGames = [
        // Filter games to delete
        ...storedGames.filter((game) => !syncResult.toRemove.some((g) => g.id === game.id)),

        // Add only non-existing games (by checking the `uniqueId`)
        ...syncResult.toAdd.filter(
          (newGame) =>
            !storedGames.some((existingGame) => existingGame.uniqueId === newGame.uniqueId),
        ),

        // Update existing games
        ...syncResult.toUpdate,
      ];

      // Update configuration with new list
      this.config.set("scannedGames", updatedGames);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Error applying sync result: ${error.message}` };
    }
  }

  // Remove games
  public removeGames(ids: string[]): { success: boolean; error?: string } {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { success: false, error: "Invalid game IDs provided" };
    }
    try {
      const storedGames = this.getScannedGames().data;
      const updatedGames = storedGames.filter((game) => !ids.includes(game.id));
      this.config.set("scannedGames", updatedGames);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: `Error removing games: ${error.message}` };
    }
  }
}

export const scannedGamesService = new ScannedGamesService();
