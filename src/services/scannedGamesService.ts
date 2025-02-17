import { SteamGame } from "steam-library-scanner";

// Define interfaces
interface StoredGame {
  id: string;
  isSteamGame: boolean;
  gameDetails: SteamGame;
}

interface SyncResult {
  toAdd: StoredGame[];
  toUpdate: StoredGame[];
  toRemove: StoredGame[];
}

// Generate a stable unique ID based on unique game properties (e.g., cmd and appId)
const generateUniqueId = (game: SteamGame): string => `${game.cmd}_${game.appId}`;

const isSteamGame = (game: SteamGame): boolean => Boolean(game.appId && game.appId !== "0");

export const scannedGamesService = {
  async getScannedGames(): Promise<StoredGame[]> {
    return window.electronGameStorageApi.getScannedGames();
  },

  async setScannedGames(games: StoredGame[]): Promise<void> {
    await window.electronGameStorageApi.setScannedGames(games);
  },

  async syncScannedGames(newGames: SteamGame[]): Promise<SyncResult> {
    const storedGames = await this.getScannedGames();

    const newGamesWithId: StoredGame[] = newGames.map((game) => ({
      id: generateUniqueId(game),
      isSteamGame: isSteamGame(game),
      gameDetails: game,
    }));

    const storedGamesMap = new Map(storedGames.map((game) => [game.id, game]));
    const newGamesMap = new Map(newGamesWithId.map((game) => [game.id, game]));

    const toAdd = newGamesWithId.filter((game) => !storedGamesMap.has(game.id));
    const toUpdate = newGamesWithId.filter(
      (game) =>
        storedGamesMap.has(game.id) &&
        JSON.stringify(storedGamesMap.get(game.id)) !== JSON.stringify(game),
    );
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
