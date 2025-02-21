import { ScannedGamesConfig } from "./ScannedGamesConfig";

export interface SyncResult {
  toAdd: ScannedGamesConfig[];
  toUpdate: ScannedGamesConfig[];
  toRemove: ScannedGamesConfig[];
}
