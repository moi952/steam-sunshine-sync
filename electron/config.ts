import { Conf } from "electron-conf";
import { GameCollections } from "./types/GameCollections";

const config = new Conf<GameCollections>({
  defaults: {
    scannedGames: [],
    selectedGames: [],
    exportedGames: [],
  },
});

export default config;
