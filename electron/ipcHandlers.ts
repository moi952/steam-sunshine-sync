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

const settingsService = new SettingsService();
const pathDetector = new PathDetector();

export function registerIpcPathDectector() {
  ipcMain.handle("path-detector:detectSunshine", async () => pathDetector.detectSunshinePath());
  ipcMain.handle("path-detector:getSteamPath", async () => pathDetector.detectSteamPath());
}

export function registerIpcAppSettings() {
  // Handle settings with IPC: retrieve settings
  ipcMain.handle(
    "get-settings",
    () => settingsService.getSettings(), // Use the class method
  );

  // Handle settings with IPC: save settings
  ipcMain.handle(
    "save-settings",
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

export function registerIpcGameStorage() {
  ipcMain.handle("get-scanned-games", () => config.get("scannedGames"));

  ipcMain.handle("set-scanned-games", (_event, games: GameCollections["scannedGames"]) => {
    config.set("scannedGames", games);
  });

  ipcMain.handle("get-selected-games", () => config.get("selectedGames"));

  ipcMain.handle("set-selected-games", (_event, games: GameCollections["selectedGames"]) => {
    config.set("selectedGames", games);
  });

  ipcMain.handle("get-exported-games", () => config.get("exportedGames"));

  ipcMain.handle("set-exported-games", (_event, games: GameCollections["exportedGames"]) => {
    config.set("exportedGames", games);
  });
}
