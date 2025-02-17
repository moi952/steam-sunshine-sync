import { GameCollections, ResponseSunshine, SunshineConfig } from "./types";
import { SunshineAppConfig } from "./types/SunshineAppConfig";

declare global {
  interface Window {
    electron: {
      invoke: (_channel: string, ..._args: any[]) => Promise<any>;
      openFileDialog: () => Promise<string>;
      detectSunshinePath: () => Promise<string>;
      detectSteamPath: () => Promise<string>;
    };
    electronSteamLibraryScannerApi: {
      getAllSteamGames: (_steamPath: string, _userId: string) => Promise<any>;
      getNonSteamGames: (_steamPath: string, _userId: string) => Promise<any>;
      getSteamGames: (_steamPath: string) => Promise<any>;
      getSteamUsers: (_steamPath: string) => Promise<{ id: string; name: string }[]>;
    };
    electronSettingsStorageApi: {
      getSettings: () => Promise<Record<string, any>>;
      saveSettings: (_settings: Record<string, any>) => Promise<void>;
    };
    electronGameStorageApi: {
      getScannedGames: () => Promise<GameCollections["scannedGames"]>;
      setScannedGames: (_games: GameCollections["scannedGames"]) => Promise<void>;
      getSelectedGames: () => Promise<GameCollections["selectedGames"]>;
      setSelectedGames: (_games: GameCollections["selectedGames"]) => Promise<void>;
      getExportedGames: () => Promise<GameCollections["exportedGames"]>;
      setExportedGames: (_games: GameCollections["exportedGames"]) => Promise<void>;
    };
    electronSunshineApi: {
      getApps: () => Promise<ResponseSunshine>;
      createApp: (_appData: any) => Promise<SunshineAppConfig>;
      updateApp: (_appId: string, _appData: any) => Promise<SunshineAppConfig>;
      deleteApp: (_appId: string) => Promise<void>;
      getConfig: () => Promise<SunshineConfig>;
      updateConfig: (_configData: any) => Promise<SunshineConfig>;
    };
    cryptoAPI: {
      encrypt: (_text: string) => string;
      decrypt: (_text: string) => string;
    };
  }
}

export {};
