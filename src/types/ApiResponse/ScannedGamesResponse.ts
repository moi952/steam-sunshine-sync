import { ScannedGamesConfig } from "../ScannedGamesConfig";
import { SyncResult } from "../SyncResult";

// Standard generic response with status and optional error message
interface BaseResponse {
  success: boolean;
  error?: string;
}

// Response for getScannedGames
export interface GetScannedGamesResponse extends BaseResponse {
  data: ScannedGamesConfig[];
}

// Response for getScannedGameById
export interface GetScannedGameByIdResponse extends BaseResponse {
  data?: ScannedGamesConfig;
}

// Response for setScannedGames
export interface SetScannedGamesResponse extends BaseResponse {}

// Response for syncScannedGames
export interface SyncScannedGamesResponse extends BaseResponse {
  syncResult?: SyncResult;
}

// Response for applySyncResult
export interface ApplySyncResultResponse extends BaseResponse {}

// Response for removeGames
export interface RemoveGamesResponse extends BaseResponse {}
