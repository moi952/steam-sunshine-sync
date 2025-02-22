// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "path";
import * as os from "os";
import dotenv from "dotenv";
import {
  registerIpcAppSettings,
  registerIpcCryptoApi,
  registerIpcPathDectector,
  registerIpcSteamLibraryScanner,
  registerIpcSunshineApi,
  registerScannedGamesIpc,
  registerIpcGamesToExport,
} from "./ipcHandlers";

dotenv.config();

let mainWindow: BrowserWindow | null = null;

// Register IPC path detector
registerIpcPathDectector();

registerIpcSunshineApi();
const normalizePath = (filePath: string): string => {
  if (filePath.startsWith("~")) {
    return path.join(os.homedir(), filePath.slice(1));
  }
  return path.normalize(filePath);
};

ipcMain.handle("normalizePath", (_, filePath: string) => normalizePath(filePath));
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
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

registerIpcCryptoApi();
// Register IPC app settings
registerIpcAppSettings();
// Register IPC handlers for game library scanner
registerIpcSteamLibraryScanner();
// Register IPC handlers for game storage
registerIpcGamesToExport();
registerScannedGamesIpc();

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
