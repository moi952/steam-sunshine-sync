// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain } from "electron";
import {
  getAllSteamGames,
  getNonSteamGames,
  getSteamInstalledGames,
  getSteamUsers,
} from "steam-library-scanner";
import config from "./config";
import { GameCollections } from "./types/GameCollections";
import SettingsService from "./modules/settingsService";
import { PathDetector } from "./modules/PathDetector";
import { SunshineService } from "./modules/sunshineService";
import { decrypt, encrypt } from "./modules/cryptoService";
import { scannedGamesService } from "./modules/ScannedGamesService";

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

export function registerIpcGameStorage() {
  ipcMain.handle("get-exported-games", () => config.get("exportedGames"));

  ipcMain.handle("set-exported-games", (_event, games: GameCollections["exportedGames"]) => {
    config.set("exportedGames", games);
  });
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
