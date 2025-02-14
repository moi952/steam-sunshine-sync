import { SteamGame } from "steam-library-scanner";

interface SelectedGamesService {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;

  getSelectedGames: () => Promise<SteamGame[]>;
  setSelectedGames: (_games: SteamGame[]) => Promise<void>;
  addSelectedGame: (_game: SteamGame) => Promise<void>;
  removeSelectedGame: (_gameId: string) => Promise<void>;
  resetState: () => void;
}

export const selectedGamesService: SelectedGamesService = {
  isLoading: false,
  isError: false,
  errorMessage: "",

  getSelectedGames: async () => {
    selectedGamesService.isLoading = true;
    selectedGamesService.isError = false;
    selectedGamesService.errorMessage = "";
    try {
      const games = await window.electronGameStorageApi.getSelectedGames();
      selectedGamesService.isLoading = false;
      return games;
    } catch (error: any) {
      selectedGamesService.isLoading = false;
      selectedGamesService.isError = true;
      selectedGamesService.errorMessage = error.message;
      throw error;
    }
  },

  setSelectedGames: async (games: SteamGame[]) => {
    await window.electronGameStorageApi.setSelectedGames(games);
  },

  addSelectedGame: async (game: SteamGame) => {
    const games = await selectedGamesService.getSelectedGames();
    const updatedGames = [...games, game];
    await selectedGamesService.setSelectedGames(updatedGames);
  },

  removeSelectedGame: async (gameId: string) => {
    const games = await selectedGamesService.getSelectedGames();
    const updatedGames = games.filter((game) => game.appId !== gameId);
    await selectedGamesService.setSelectedGames(updatedGames);
  },

  resetState: () => {
    selectedGamesService.isLoading = false;
    selectedGamesService.isError = false;
    selectedGamesService.errorMessage = "";
  },
};
