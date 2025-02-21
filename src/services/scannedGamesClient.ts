import { SteamGame } from "steam-library-scanner";
import {
  ApplySyncResultResponse,
  GetScannedGameByIdResponse,
  GetScannedGamesResponse,
  RemoveGamesResponse,
  SetScannedGamesResponse,
  SyncScannedGamesResponse,
} from "../types/ScannedGamesResponse";
import { ScannedGamesConfig, SyncResult } from "../types";

class ScannedGamesClient {
  static async getScannedGames(): Promise<GetScannedGamesResponse> {
    return window.newElectronGameStorageApi.getScannedGames();
  }

  static async getScannedGameById(uniqueId: string): Promise<GetScannedGameByIdResponse> {
    return window.newElectronGameStorageApi.getScannedGameById(uniqueId);
  }

  static async setScannedGames(games: ScannedGamesConfig[]): Promise<SetScannedGamesResponse> {
    return window.newElectronGameStorageApi.setScannedGames(games);
  }

  static async syncScannedGames(newGames: SteamGame[]): Promise<SyncScannedGamesResponse> {
    return window.newElectronGameStorageApi.syncScannedGames(newGames);
  }

  static async applySyncResult(syncResult: SyncResult): Promise<ApplySyncResultResponse> {
    return window.newElectronGameStorageApi.applySyncResult(syncResult);
  }

  static async removeGames(ids: string[]): Promise<RemoveGamesResponse> {
    return window.newElectronGameStorageApi.removeGames(ids);
  }
}
export default ScannedGamesClient;
