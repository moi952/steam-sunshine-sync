import { contextBridge, ipcRenderer } from "electron";
import { App, Config } from "./modules/sunshineService";

contextBridge.exposeInMainWorld("electronSunshineApi", {
  getApps: () => ipcRenderer.invoke("sunshine:getApps"),
  createApp: (appData: App) => ipcRenderer.invoke("sunshine:createApp", appData),
  updateApp: (appId: string, appData: App) =>
    ipcRenderer.invoke("sunshine:updateApp", appId, appData),
  deleteApp: (appId: string) => ipcRenderer.invoke("sunshine:deleteApp", appId),
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

//
contextBridge.exposeInMainWorld("electronGameStorageApi", {
  getScannedGames: () => ipcRenderer.invoke("get-scanned-games"),
  setScannedGames: (games: any) => ipcRenderer.invoke("set-scanned-games", games),
  getSelectedGames: () => ipcRenderer.invoke("get-selected-games"),
  setSelectedGames: (games: any) => ipcRenderer.invoke("set-selected-games", games),
  getExportedGames: () => ipcRenderer.invoke("get-exported-games"),
  setExportedGames: (games: any) => ipcRenderer.invoke("set-exported-games", games),
});

contextBridge.exposeInMainWorld("cryptoAPI", {
  encrypt: (text: string): Promise<string> => ipcRenderer.invoke("encrypt", text),
  decrypt: (data: string): Promise<string> => ipcRenderer.invoke("decrypt", data),
});
