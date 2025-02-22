import { SteamGame } from "steam-library-scanner";
import { SunshineGetAppsResponse, SunshineConfig, ScannedGamesConfig, SyncResult } from "./types";
import { SunshineCreateAppResponse } from "./types/SunshineApi";
import {
  ApplySyncResultResponse,
  GetScannedGameByIdResponse,
  GetScannedGamesResponse,
  RemoveGamesResponse,
  SetScannedGamesResponse,
  SyncScannedGamesResponse,
} from "./types/ApiResponse/ScannedGamesResponse";

export interface NewElectronGameStorageApi {
  getScannedGames: () => Promise<GetScannedGamesResponse>;
  getScannedGameById: (_uniqueId: string) => Promise<GetScannedGameByIdResponse>;
  setScannedGames: (_games: ScannedGamesConfig[]) => Promise<SetScannedGamesResponse>;
  syncScannedGames: (_newGames: SteamGame[]) => Promise<SyncScannedGamesResponse>;
  applySyncResult: (_syncResult: SyncResult) => Promise<ApplySyncResultResponse>;
  removeGames: (_ids: string[]) => Promise<RemoveGamesResponse>;
}

export interface ElectronGamesToExportApi {
  getGamesToExport: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
  getGameToExportById: (
    _uniqueId: string,
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  setGamesToExport: (_games: any[]) => Promise<{ success: boolean; error?: string }>;
  addGameToExportConfig: (_game: any) => Promise<{ success: boolean; error?: string }>;
  createGameToExportConfig: (
    _sunshineAppConfig: any,
    _gameDetails: any,
    _scannedGameUniqueId?: string,
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  updateGameToExportConfig: (
    _uniqueId: string,
    _updatedGame: any,
  ) => Promise<{ success: boolean; error?: string }>;
  removeGameToExportConfig: (_uniqueId: string) => Promise<{ success: boolean; error?: string }>;
  removeGamesToExportByAppId: (_appId: string) => Promise<{ success: boolean; error?: string }>;
  removeAllGamesToExport: () => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electron: {
      invoke: (_channel: string, ..._args: any[]) => Promise<any>;
      openFileDialog: () => Promise<string>;
      detectSunshinePath: () => Promise<string>;
      detectSteamPath: () => Promise<string>;
      normalizePath: (_filePath: string) => Promise<string>;
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
    electronScannedGamesApi: NewElectronGameStorageApi;
    electronGamesToExportApi: ElectronGamesToExportApi;
    electronSunshineApi: {
      getApps: () => Promise<SunshineGetAppsResponse>;
      createApp: (_appData: any) => Promise<SunshineCreateAppResponse>;
      updateApp: (_appId: number, _appData: any) => Promise<SunshineCreateAppResponse>;
      deleteApp: (_appId: number) => Promise<void>;
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
