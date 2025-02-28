// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, dialog, ipcMain, protocol } from "electron";
import path from "path";
import * as os from "os";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import {
  registerIpcAppSettings,
  registerIpcCryptoApi,
  registerIpcPathDectector,
  registerIpcSteamLibraryScanner,
  registerIpcSunshineApi,
  registerScannedGamesIpc,
  registerIpcGamesToExport,
} from "./ipcHandlers";

const isDev = !app.isPackaged;
const title = "Steam Sunshine Sync";
const startUrl = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "..", "index.html")}`;

// Path Configuration
const envPath = isDev
  ? path.resolve(process.cwd(), ".env")
  : path.join(process.resourcesPath, ".env");

dotenv.config({
  path: envPath,
});

let mainWindow: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;

function createLoadingWindow() {
  loadingWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    transparent: true,
    show: false,
    movable: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const loadingUrl = isDev
    ? "http://localhost:3000/loading.html"
    : `file://${path.join(__dirname, "..", "loading.html")}`;

  loadingWindow.loadURL(loadingUrl);
  loadingWindow.once("ready-to-show", () => {
    if (loadingWindow) loadingWindow.show();
  });
}

function reactIsReady() {
  console.log("React is ready!");

  if (loadingWindow) {
    console.log("Closing loading window");
    loadingWindow.close();
    loadingWindow = null;
  }

  if (mainWindow) {
    console.log("Showing main window");
    mainWindow.show();
    mainWindow.focus();
  }
}

function waitForReactReady(maxRetries = 20, interval = 500) {
  let attempts = 0;

  const checkReady = setInterval(async () => {
    if (attempts >= maxRetries) {
      console.error("React app did not load in time.");
      clearInterval(checkReady);
      return;
    }

    // eslint-disable-next-line no-plusplus
    attempts++;

    try {
      if (isDev) {
        const response = await fetch("http://localhost:3000");
        if (response.ok) {
          reactIsReady();
          clearInterval(checkReady);
        }
      } else {
        mainWindow?.webContents
          .executeJavaScript(`document.readyState === 'complete'`)
          .then((ready) => {
            if (ready) {
              reactIsReady();
              clearInterval(checkReady);
            }
          });
      }
    } catch (error) {
      console.log("Waiting for React...");
    }
  }, interval);
}

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

async function initializeApp() {
  // Preload settings and other initializations here
  registerIpcCryptoApi();
  registerIpcAppSettings();
  registerIpcSteamLibraryScanner();
  registerIpcGamesToExport();
  registerScannedGamesIpc();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    title,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: isDev,
      sandbox: true,
    },
  });

  // Disable menu in production
  if (!isDev) {
    mainWindow.setMenu(null);
  }

  mainWindow.loadURL(startUrl);

  // Vérifier en boucle si React est prêt
  waitForReactReady();

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

// Initialize the Electron application
app.whenReady().then(async () => {
  app.name = "SteamSunshineSync";

  createLoadingWindow();

  // Initialize the application while the loading window is displayed
  await initializeApp();

  protocol.handle("local", async (request) => {
    let url = request.url.replace(/^local:\/\//, "");
    url = decodeURIComponent(url);
    if (/^[A-Za-z]\//.test(url)) {
      url = `${url[0]}:${url.slice(1)}`;
    }
    const filePath = path.normalize(url);

    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        return new Response("Not a file", { status: 404 });
      }
      return new Response(await fs.readFile(filePath));
    } catch (error) {
      return new Response("File not found", { status: 404 });
    }
  });

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit the application when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
