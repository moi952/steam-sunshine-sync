// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge, ipcRenderer } from "electron";
import { App, Config } from "./modules/sunshineService";

contextBridge.exposeInMainWorld("electronSunshineApi", {
  getApps: () => ipcRenderer.invoke("sunshine:getApps"),
  createApp: (appData: App) => ipcRenderer.invoke("sunshine:createApp", appData),
  updateApp: (appId: number, appData: App) =>
    ipcRenderer.invoke("sunshine:updateApp", appId, appData),
  deleteApp: (appId: number) => ipcRenderer.invoke("sunshine:deleteApp", appId),
  getConfig: () => ipcRenderer.invoke("sunshine:getConfig"),
  updateConfig: (configData: Config) => ipcRenderer.invoke("sunshine:updateConfig", configData),
});

contextBridge.exposeInMainWorld("electronSettingsStorageApi", {
  getSettings: () => ipcRenderer.invoke("settings:getSettings"),
  saveSettings: (settings: any) => ipcRenderer.invoke("settings:saveSettings", settings),
});

// Exposing functions to React via `window`
contextBridge.exposeInMainWorld("electron", {
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  detectSunshinePath: () => ipcRenderer.invoke("path-detector:detectSunshine"),
  detectSteamPath: () => ipcRenderer.invoke("path-detector:getSteamPath"),
  normalizePath: (filePath: string): Promise<string> =>
    ipcRenderer.invoke("normalizePath", filePath),
});

// Expose the game scanner API to the renderer process
contextBridge.exposeInMainWorld("electronSteamLibraryScannerApi", {
  getSteamGames: (steamPath: string) =>
    ipcRenderer.invoke("steam-library-scanner:getSteamGames", steamPath),
  getNonSteamGames: (steamPath: string, userId: string) =>
    ipcRenderer.invoke("steam-library-scanner:getNonSteamGames", steamPath, userId),
  getAllSteamGames: (steamPath: string, userId: string) =>
    ipcRenderer.invoke("steam-library-scanner:getAllSteamGames", steamPath, userId),

  getSteamUsers: (steamPath: string) =>
    ipcRenderer.invoke("steam-library-scanner:getSteamUsers", steamPath),
});

contextBridge.exposeInMainWorld("electronGamesToExportApi", {
  getGamesToExport: () => ipcRenderer.invoke("get-games-to-export"),
  getGameToExportById: (uniqueId: string) =>
    ipcRenderer.invoke("get-game-to-export-by-id", uniqueId),
  setGamesToExport: (games: any[]) => ipcRenderer.invoke("set-games-to-export", games),
  addGameToExportConfig: (game: any) => ipcRenderer.invoke("add-game-to-export-config", game),
  createGameToExportConfig: (
    sunshineAppConfig: any,
    gameDetails: any,
    scannedGameUniqueId?: string,
  ) =>
    ipcRenderer.invoke(
      "create-game-to-export-config",
      sunshineAppConfig,
      gameDetails,
      scannedGameUniqueId,
    ),
  updateGameToExportConfig: (uniqueId: string, updatedGame: any) =>
    ipcRenderer.invoke("update-game-to-export-config", uniqueId, updatedGame),
  removeGameToExportConfig: (uniqueId: string) =>
    ipcRenderer.invoke("remove-game-to-export-config", uniqueId),
  removeGamesToExportByAppId: (appId: string) =>
    ipcRenderer.invoke("remove-games-to-export-by-app-id", appId),
  removeAllGamesToExport: () => ipcRenderer.invoke("remove-all-games-to-export"),
});

contextBridge.exposeInMainWorld("electronScannedGamesApi", {
  getScannedGames: () => ipcRenderer.invoke("getScannedGames"),
  getScannedGameById: (uniqueId: string) => ipcRenderer.invoke("getScannedGameById", uniqueId),
  setScannedGames: (games: any) => ipcRenderer.invoke("setScannedGames", games),
  syncScannedGames: (newGames: any) => ipcRenderer.invoke("syncScannedGames", newGames),
  applySyncResult: (syncResult: any) => ipcRenderer.invoke("applySyncResult", syncResult),
  removeGames: (ids: string[]) => ipcRenderer.invoke("removeGames", ids),
});

contextBridge.exposeInMainWorld("cryptoAPI", {
  encrypt: (text: string): Promise<string> => ipcRenderer.invoke("encrypt", text),
  decrypt: (data: string): Promise<string> => ipcRenderer.invoke("decrypt", data),
});
