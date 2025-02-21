import { Conf } from "electron-conf";
import { GameCollections } from "./types/GameCollections";

const config = new Conf<GameCollections>({
  defaults: {
    scannedGames: [],
    exportedGames: [],
  },
});

export default config;
