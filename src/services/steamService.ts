import { SteamGame } from "steam-library-scanner";

interface ScanResult {
  steamGames: SteamGame[];
  nonSteamGames: SteamGame[];
}

export const steamService = {
  isLoading: false,
  isError: false,
  errorMessage: "",

  scanGames: async (steamPath: string, steamId: string): Promise<ScanResult> => {
    steamService.isLoading = true;
    steamService.isError = false;
    steamService.errorMessage = "";

    try {
      const result = await window.electronSteamLibraryScannerApi.getAllSteamGames(
        steamPath,
        steamId,
      );
      steamService.isLoading = false;
      return result;
    } catch (error: any) {
      steamService.isLoading = false;
      steamService.isError = true;
      steamService.errorMessage = error.message;
      throw error;
    }
  },

  resetState: () => {
    steamService.isLoading = false;
    steamService.isError = false;
    steamService.errorMessage = "";
  },
};
