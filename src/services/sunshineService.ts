import { ExportGameConfig } from "../types";

export const sunshineService = {
  exportGame: (game: ExportGameConfig): void => {
    // Logic to export a game to Sunshine
    console.log(`Exporting to Sunshine`, game);
  },
};
