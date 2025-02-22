// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain } from "electron";
import {
  getAllSteamGames,
  getNonSteamGames,
  getSteamInstalledGames,
  getSteamUsers,
} from "steam-library-scanner";
import SettingsService from "./modules/settingsService";
import { PathDetector } from "./modules/PathDetector";
import { SunshineService } from "./modules/sunshineService";
import { decrypt, encrypt } from "./modules/cryptoService";
import { scannedGamesService } from "./modules/ScannedGamesService";
import { gamesToExportService } from "./modules/GamesToExportService";

const settingsService = new SettingsService();
const pathDetector = new PathDetector();
const sunshineService = new SunshineService(settingsService);

export function registerIpcPathDectector() {
  ipcMain.handle("path-detector:detectSunshine", async () => pathDetector.detectSunshinePath());
  ipcMain.handle("path-detector:getSteamPath", async () => pathDetector.detectSteamPath());
}

export function registerIpcAppSettings() {
  // Handle settings with IPC: retrieve settings
  ipcMain.handle(
    "settings:getSettings",
    () => settingsService.getSettings(), // Use the class method
  );

  // Handle settings with IPC: save settings
  ipcMain.handle(
    "settings:saveSettings",
    (_event, settings) => settingsService.saveSettings(settings), // Use the class method
  );
}

export function registerIpcSteamLibraryScanner() {
  ipcMain.handle("steam-library-scanner:getSteamGames", async (_event: any, steamPath: string) =>
    getSteamInstalledGames(steamPath),
  );

  ipcMain.handle(
    "steam-library-scanner:getAllSteamGames",
    async (_event: any, steamPath: string, userId: string) => getAllSteamGames(steamPath, userId),
  );

  ipcMain.handle(
    "steam-library-scanner:getNonSteamGames",
    async (_event: any, steamPath: string, userId: string) => getNonSteamGames(steamPath, userId),
  );

  ipcMain.handle("steam-library-scanner:getSteamUsers", async (_event: any, steamPath: string) =>
    getSteamUsers(steamPath),
  );
}

export function registerScannedGamesIpc() {
  // Retrieve all scanned games
  ipcMain.handle("getScannedGames", async () => scannedGamesService.getScannedGames());

  // Retrieve a specific game by its uniqueId
  ipcMain.handle("getScannedGameById", async (_, uniqueId: string) =>
    scannedGamesService.getScannedGameById(uniqueId),
  );

  // Set all scanned games
  ipcMain.handle("setScannedGames", async (_, games) => scannedGamesService.setScannedGames(games));

  // Synchronize scanned games
  ipcMain.handle("syncScannedGames", async (_, newGames) =>
    scannedGamesService.syncScannedGames(newGames),
  );

  // Apply synchronization results
  ipcMain.handle("applySyncResult", async (_, syncResult) =>
    scannedGamesService.applySyncResult(syncResult),
  );

  // Delete games by ID
  ipcMain.handle("removeGames", async (_, ids) => scannedGamesService.removeGames(ids));
}

export function registerIpcGamesToExport() {
  ipcMain.handle("get-games-to-export", () => gamesToExportService.getGamesToExport());

  ipcMain.handle("get-game-to-export-by-id", (_event, uniqueId: string) =>
    gamesToExportService.getGameToExportById(uniqueId),
  );

  ipcMain.handle("set-games-to-export", (_event, games: any[]) =>
    gamesToExportService.setGamesToExport(games),
  );

  ipcMain.handle("add-game-to-export-config", (_event, game: any) =>
    gamesToExportService.addGameToExportConfig(game),
  );

  ipcMain.handle(
    "create-game-to-export-config",
    (_event, sunshineAppConfig: any, gameDetails: any, scannedGameUniqueId?: string) =>
      gamesToExportService.createGameToExportConfig(
        sunshineAppConfig,
        gameDetails,
        scannedGameUniqueId,
      ),
  );

  ipcMain.handle("update-game-to-export-config", (_event, uniqueId: string, updatedGame: any) =>
    gamesToExportService.updateGameToExportConfig(uniqueId, updatedGame),
  );

  ipcMain.handle("remove-game-to-export-config", (_event, uniqueId: string) =>
    gamesToExportService.removeGameToExportConfig(uniqueId),
  );

  ipcMain.handle("remove-games-to-export-by-app-id", (_event, appId: string) =>
    gamesToExportService.removeGamesToExportByAppId(appId),
  );

  ipcMain.handle("remove-all-games-to-export", () => gamesToExportService.removeAllGamesToExport());
}

export function registerIpcSunshineApi() {
  ipcMain.handle("sunshine:getApps", async () => sunshineService.getApps());

  ipcMain.handle("sunshine:createApp", async (_event, appData: any) =>
    sunshineService.createApp(appData),
  );

  ipcMain.handle("sunshine:updateApp", async (_event, appId: string, appData: any) =>
    sunshineService.updateApp(appId, appData),
  );

  ipcMain.handle("sunshine:deleteApp", async (_event, appId: string) =>
    sunshineService.deleteApp(appId),
  );

  ipcMain.handle("sunshine:getConfig", async () => sunshineService.getConfig());

  ipcMain.handle("sunshine:updateConfig", async (_event, configData: any) =>
    sunshineService.updateConfig(configData),
  );
}

export function registerIpcCryptoApi() {
  ipcMain.handle("encrypt", async (_event, text: string) => encrypt(text));
  ipcMain.handle("decrypt", async (_event, data: string) => decrypt(data));
}
