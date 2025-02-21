import { v4 as uuidv4 } from "uuid";
import { SteamGame } from "steam-library-scanner";
import { isEqual } from "lodash";
import { ScannedGamesConfig } from "../types";

interface SyncResult {
  toAdd: ScannedGamesConfig[];
  toUpdate: ScannedGamesConfig[];
  toRemove: ScannedGamesConfig[];
}

// Generate a stable unique ID based on unique game properties (e.g., cmd and appId)
const generateUniqueId = (): string => uuidv4();
const generateComposedId = (game: SteamGame): string => game.cmd;

const isSteamGame = (game: SteamGame): boolean => Boolean(game.appId && game.appId !== "0");

export const scannedGamesService = {
  async getScannedGames(): Promise<ScannedGamesConfig[]> {
    return window.electronGameStorageApi.getScannedGames();
  },

  getScannedGameById: async (uniqueId: string) => {
    const games = await scannedGamesService.getScannedGames();
    return games.find((game) => game.uniqueId === uniqueId);
  },

  async setScannedGames(games: ScannedGamesConfig[]): Promise<void> {
    await window.electronGameStorageApi.setScannedGames(games);
  },

  async syncScannedGames(newGames: SteamGame[]): Promise<SyncResult> {
    const storedGames = await this.getScannedGames();

    // Générer des IDs basés sur les propriétés stables
    const newGamesWithId: ScannedGamesConfig[] = newGames.map((game) => ({
      id: generateComposedId(game), // Identifiant stable
      uniqueId:
        storedGames.find((g) => g.id === generateComposedId(game))?.id || generateUniqueId(), // Réutiliser uniqueId si existant
      isSteamGame: isSteamGame(game),
      gameDetails: game,
    }));

    const storedGamesMap = new Map(storedGames.map((game) => [game.id, game]));
    const newGamesMap = new Map(newGamesWithId.map((game) => [game.id, game]));

    // Jeux à ajouter (nouveaux jeux non présents dans la base)
    const toAdd = newGamesWithId.filter((game) => !storedGamesMap.has(game.id));

    // Jeux à mettre à jour (existants mais modifiés)
    const toUpdate = newGamesWithId.filter(
      (game) =>
        storedGamesMap.has(game.id) &&
        !isEqual(storedGamesMap.get(game.id)?.gameDetails, game.gameDetails), // Comparaison profonde
    );

    // Jeux à supprimer (présents dans la base mais absents du scan)
    const toRemove = storedGames.filter((game) => !newGamesMap.has(game.id));

    return { toAdd, toUpdate, toRemove };
  },

  async applySyncResult(syncResult: SyncResult): Promise<void> {
    const storedGames = await this.getScannedGames();
    const updatedGames = [
      ...storedGames.filter((game) => !syncResult.toRemove.some((g) => g.id === game.id)),
      ...syncResult.toUpdate,
      ...syncResult.toAdd,
    ];
    await this.setScannedGames(updatedGames);
  },

  async removeGames(ids: string[]): Promise<void> {
    // Retrieve stored games
    const storedGames = await this.getScannedGames();
    // Filter out the games whose id is included in the ids array
    const updatedGames = storedGames.filter((game) => !ids.includes(game.id));
    // Save the updated list back to storage
    await this.setScannedGames(updatedGames);
  },
};
