import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronSettingsStorageApi", {
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings: any) => ipcRenderer.invoke("save-settings", settings),
});

// Exposing functions to React via `window`
contextBridge.exposeInMainWorld("electron", {
  openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
  detectSunshinePath: () => ipcRenderer.invoke("path-detector:detectSunshine"),
  detectSteamPath: () => ipcRenderer.invoke("path-detector:getSteamPath"),
  addToSunshine: (app: any) => ipcRenderer.invoke("add-to-sunshine", app),
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
