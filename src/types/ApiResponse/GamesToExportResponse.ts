import { GameToExportConfig } from "../GameToExportConfig";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GetGamesToExportResponse extends ApiResponse<GameToExportConfig[]> {}

export interface GetGameToExportByIdResponse extends ApiResponse<GameToExportConfig> {}

export interface SetGamesToExportResponse extends ApiResponse {}

export interface AddGameToExportConfigResponse extends ApiResponse {}

export interface CreateGameToExportConfigResponse extends ApiResponse<GameToExportConfig> {}

export interface UpdateGameToExportConfigResponse extends ApiResponse {}

export interface RemoveGameToExportConfigResponse extends ApiResponse {}

export interface RemoveGamesToExportByAppIdResponse extends ApiResponse {}

export interface RemoveAllGamesToExportResponse extends ApiResponse {}
