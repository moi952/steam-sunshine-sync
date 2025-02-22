import { SteamGame } from "steam-library-scanner";
import {
  ApplySyncResultResponse,
  GetScannedGameByIdResponse,
  GetScannedGamesResponse,
  RemoveGamesResponse,
  SetScannedGamesResponse,
  SyncScannedGamesResponse,
} from "../types/ApiResponse";
import { ScannedGamesConfig, SyncResult } from "../types";

class ScannedGamesClient {
  static async getScannedGames(): Promise<GetScannedGamesResponse> {
    return window.electronScannedGamesApi.getScannedGames();
  }

  static async getScannedGameById(uniqueId: string): Promise<GetScannedGameByIdResponse> {
    return window.electronScannedGamesApi.getScannedGameById(uniqueId);
  }

  static async setScannedGames(games: ScannedGamesConfig[]): Promise<SetScannedGamesResponse> {
    return window.electronScannedGamesApi.setScannedGames(games);
  }

  static async syncScannedGames(newGames: SteamGame[]): Promise<SyncScannedGamesResponse> {
    return window.electronScannedGamesApi.syncScannedGames(newGames);
  }

  static async applySyncResult(syncResult: SyncResult): Promise<ApplySyncResultResponse> {
    return window.electronScannedGamesApi.applySyncResult(syncResult);
  }

  static async removeGames(ids: string[]): Promise<RemoveGamesResponse> {
    return window.electronScannedGamesApi.removeGames(ids);
  }
}
export default ScannedGamesClient;
