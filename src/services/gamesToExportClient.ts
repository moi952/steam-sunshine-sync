import {
  AddGameToExportConfigResponse,
  CreateGameToExportConfigResponse,
  GetGamesToExportResponse,
  GetGameToExportByIdResponse,
  RemoveGameToExportConfigResponse,
  SetGamesToExportResponse,
  UpdateGameToExportConfigResponse,
} from "../types/ApiResponse";
import {
  RemoveAllGamesToExportResponse,
  RemoveGamesToExportByAppIdResponse,
} from "../types/ApiResponse/GamesToExportResponse";

export class GamesToExportClient {
  static async getGamesToExport(): Promise<GetGamesToExportResponse> {
    return window.electronGamesToExportApi.getGamesToExport();
  }

  static async getGameToExportById(uniqueId: string): Promise<GetGameToExportByIdResponse> {
    return window.electronGamesToExportApi.getGameToExportById(uniqueId);
  }

  static async setGamesToExport(games: any[]): Promise<SetGamesToExportResponse> {
    return window.electronGamesToExportApi.setGamesToExport(games);
  }

  static async addGameToExportConfig(game: any): Promise<AddGameToExportConfigResponse> {
    return window.electronGamesToExportApi.addGameToExportConfig(game);
  }

  static async createGameToExportConfig(
    sunshineAppConfig: any,
    gameDetails: any,
    scannedGameUniqueId?: string,
  ): Promise<CreateGameToExportConfigResponse> {
    return window.electronGamesToExportApi.createGameToExportConfig(
      sunshineAppConfig,
      gameDetails,
      scannedGameUniqueId,
    );
  }

  static async updateGameToExportConfig(
    uniqueId: string,
    updatedGame: any,
  ): Promise<UpdateGameToExportConfigResponse> {
    return window.electronGamesToExportApi.updateGameToExportConfig(uniqueId, updatedGame);
  }

  static async removeGameToExportConfig(
    uniqueId: string,
  ): Promise<RemoveGameToExportConfigResponse> {
    return window.electronGamesToExportApi.removeGameToExportConfig(uniqueId);
  }

  static async removeGamesToExportByAppId(
    appId: string,
  ): Promise<RemoveGamesToExportByAppIdResponse> {
    return window.electronGamesToExportApi.removeGamesToExportByAppId(appId);
  }

  static async removeAllGamesToExport(): Promise<RemoveAllGamesToExportResponse> {
    return window.electronGamesToExportApi.removeAllGamesToExport();
  }
}
