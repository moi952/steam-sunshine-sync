import { SteamGame } from "steam-library-scanner";
import { SyncResult } from "../types";
import ScannedGamesClient from "../services/scannedGamesClient";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomGame(isSteam: boolean = true): SteamGame {
  return {
    cmd: `fake-game-${getRandomInt(1000, 9999)}`,
    appId: isSteam ? getRandomInt(100000, 999999).toString() : "0",
    name: `Game ${getRandomInt(1, 1000)}`,
    imagePath: "",
    exe: `/fake/path/game${getRandomInt(1, 100)}.exe`,
    startDir: `/fake/path/`,
    shortcutPath: "",
    launchOptions: "",
    hidden: Math.random() < 0.5,
    tags: ["Action", "RPG"].slice(0, getRandomInt(0, 2)),
    universe: isSteam ? getRandomInt(1000, 9999).toString() : undefined,
    stateFlags: isSteam ? getRandomInt(1, 10).toString() : undefined,
    installdir: isSteam ? `/fake/path/installdir` : undefined,
    lastUpdated: isSteam ? new Date().toISOString() : undefined,
    sizeOnDisk: isSteam ? getRandomInt(5000000, 500000000).toString() : undefined,
    buildid: isSteam ? getRandomInt(10000, 99999).toString() : undefined,
    lastPlayed: isSteam ? new Date().toISOString() : undefined,
  };
}

export const addFakeData = async (): Promise<SyncResult> => {
  const emptyResult: SyncResult = {
    toAdd: [],
    toUpdate: [],
    toRemove: [],
  };
  try {
    const scannedGamesResponse = await ScannedGamesClient.getScannedGames();
    if (!scannedGamesResponse.success) {
      console.error("Error fetching scanned games:", scannedGamesResponse.error);
      return emptyResult;
    }

    // Generate a random number of Steam games (0 to 3) and non-Steam games (0 to 3)
    const steamGameCount = getRandomInt(0, 3);
    const nonSteamGameCount = getRandomInt(0, 3);

    const fakeSteamGames: SteamGame[] = Array.from({ length: steamGameCount }, () =>
      generateRandomGame(true),
    );
    const fakeNonSteamGames: SteamGame[] = Array.from({ length: nonSteamGameCount }, () =>
      generateRandomGame(false),
    );
    const fakeGames: SteamGame[] = [
      ...fakeSteamGames,
      ...fakeNonSteamGames,
      ...scannedGamesResponse.data.map((game) => game.gameDetails),
    ];

    // Synchronize scanned games
    const syncResult = await ScannedGamesClient.syncScannedGames(fakeGames);
    if (!syncResult.success) {
      console.error("Error syncing scanned games:", syncResult.error);
      return emptyResult;
    }

    // Apply the synchronization result
    if (syncResult.syncResult) {
      console.log("Sync result:", syncResult.syncResult);
      await ScannedGamesClient.applySyncResult(syncResult.syncResult);
      return syncResult.syncResult;
    }
    throw new Error("scannedGamesPage.errorScanningGames");
  } catch (err) {
    console.error("Error adding fake data:", err);
    return emptyResult;
  }
};
