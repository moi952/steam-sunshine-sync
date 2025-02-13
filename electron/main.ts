import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "path";
import SettingsService from "./modules/settingsService";
import { PathDetector } from "./modules/pathDetector";
import { AppManager } from "./modules/appManager";
import {
  getAllSteamGames,
  getNonSteamGames,
  getSteamInstalledGames,
  getSteamUsers,
} from "steam-library-scanner";
import { registerIpcHandlers } from "./ipcHandlers";

let mainWindow: BrowserWindow | null = null;
const settingsService = new SettingsService();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const startUrl = app.isPackaged
    ? `file://${path.join(__dirname, "..", "index.html")}`
    : "http://localhost:3000";

  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.handle("open-file-dialog", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"], // To select a folder
  });
  return result.filePaths[0] || ""; // Returns the path of the selected folder
});

ipcMain.handle("path-detector:detectSunshine", async () => await PathDetector.detectSunshinePath());
ipcMain.handle("path-detector:getSteamPath", async () => await PathDetector.detectSteamPath());

ipcMain.handle(
  "steam-library-scanner:getSteamUsers",
  async (_event: any, steamPath: string) => await getSteamUsers(steamPath),
);

ipcMain.handle("add-to-sunshine", async (event, app) => {
  try {
    await AppManager.addAppToSunshine(app);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to add application",
    };
  }
});

// Handle settings with IPC: retrieve settings
ipcMain.handle(
  "get-settings",
  () => settingsService.getSettings(), // Use the class method
);

// Handle settings with IPC: save settings
ipcMain.handle(
  "save-settings",
  (event, settings) => settingsService.saveSettings(settings), // Use the class method
);

ipcMain.handle("steam-library-scanner:getSteamGames", async (_event: any, steamPath: string) => {
  return getSteamInstalledGames(steamPath);
});

ipcMain.handle(
  "steam-library-scanner:getAllSteamGames",
  async (_event: any, steamPath: string, userId: string) => {
    return getAllSteamGames(steamPath, userId);
  },
);

ipcMain.handle(
  "steam-library-scanner:getNonSteamGames",
  async (_event: any, steamPath: string, userId: string) => {
    return getNonSteamGames(steamPath, userId);
  },
);

// Register IPC handlers
registerIpcHandlers();

// Initialize the Electron application
app.whenReady().then(() => {
  protocol.registerFileProtocol("local", (request, callback) => {
    // Remove the "local://" prefix using replace for robustness
    let url = request.url.replace(/^local:\/\//, "");
    // Decode URL-encoded characters (e.g. %20)
    url = decodeURIComponent(url);
    // If the URL starts with a drive letter followed immediately by '/', insert a colon after the drive letter
    if (/^[A-Za-z]\//.test(url)) {
      url = `${url[0]}:${url.substr(1)}`;
    }
    console.log("Custom protocol mapping, URL:", url);
    callback({ path: path.normalize(url) });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit the application when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
