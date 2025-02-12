import { contextBridge, ipcRenderer } from "electron";
import { SteamGame } from "steam-library-scanner";

contextBridge.exposeInMainWorld("electronSettingsStorageApi", {
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings: any) => ipcRenderer.invoke("save-settings", settings),
});

contextBridge.exposeInMainWorld("electronGameStorageApi", {
  // Retrieve Steam games
  getSteamGames: () => ipcRenderer.invoke("getSteamGames"),

  // Retrieve Non-Steam games
  getNonSteamGames: () => ipcRenderer.invoke("getNonSteamGames"),

  // Retrieve all games (Steam + Non-Steam)
  getAllGames: () => ipcRenderer.invoke("getAllGames"),

  // Add a Steam game
  addSteamGame: (game: SteamGame) => ipcRenderer.invoke("addSteamGame", game),

  // Add a Non-Steam game
  addNonSteamGame: (game: SteamGame) => ipcRenderer.invoke("addNonSteamGame", game),

  // Update a Steam game
  updateSteamGame: (updatedGame: SteamGame) => ipcRenderer.invoke("updateSteamGame", updatedGame),

  // Update a Non-Steam game
  updateNonSteamGame: (updatedGame: SteamGame) =>
    ipcRenderer.invoke("updateNonSteamGame", updatedGame),

  // Delete a game
  deleteGame: (gameId: string) => ipcRenderer.invoke("deleteGame", gameId),

  // Retrieve a game by its ID
  getGameById: (gameId: string) => ipcRenderer.invoke("getGameById", gameId),
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
