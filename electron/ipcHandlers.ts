import { ipcMain } from "electron";
import { SteamGame } from "steam-library-scanner";
import GameService from "./modules/GameService";

// Create a new instance of the GameService class
const gameService = new GameService();

export function registerIpcHandlers() {
  // Get all Steam games
  ipcMain.handle("getSteamGames", () => {
    return gameService.getSteamGames();
  });

  // Get all Non-Steam games
  ipcMain.handle("getNonSteamGames", () => {
    return gameService.getNonSteamGames();
  });

  // Get all games (Steam + Non-Steam)
  ipcMain.handle("getAllGames", () => {
    return gameService.getAllGames();
  });

  // Add a Steam game
  ipcMain.handle("addSteamGame", (event, game: SteamGame) => {
    gameService.addSteamGame(game);
  });

  // Add a Non-Steam game
  ipcMain.handle("addNonSteamGame", (event, game: SteamGame) => {
    gameService.addNonSteamGame(game);
  });

  // Update a Steam game
  ipcMain.handle("updateSteamGame", (event, updatedGame: SteamGame) => {
    gameService.updateSteamGame(updatedGame);
  });

  // Update a Non-Steam game
  ipcMain.handle("updateNonSteamGame", (event, updatedGame: SteamGame) => {
    gameService.updateNonSteamGame(updatedGame);
  });

  // Delete a game
  ipcMain.handle("deleteGame", (event, gameId: string) => {
    gameService.deleteGame(gameId);
  });

  // Get a game by its ID
  ipcMain.handle("getGameById", (event, gameId: string) => {
    return gameService.getGameById(gameId);
  });
}
