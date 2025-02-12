import { Conf as Store } from "electron-conf";
import { SteamGame } from "steam-library-scanner";

class GameService {
  private store: Store;

  constructor() {
    this.store = new Store({
      defaults: {
        steamGames: [],
        nonSteamGames: [],
      },
    });
  }

  // Récupérer tous les jeux Steam
  getSteamGames(): SteamGame[] {
    return this.store.get("steamGames") as SteamGame[];
  }

  // Récupérer tous les jeux Non-Steam (ajoutés dans Steam)
  getNonSteamGames(): SteamGame[] {
    return this.store.get("nonSteamGames") as SteamGame[];
  }

  // Récupérer tous les jeux (Steam + Non-Steam)
  getAllGames(): SteamGame[] {
    const steamGames = this.getSteamGames();
    const nonSteamGames = this.getNonSteamGames();
    return [...steamGames, ...nonSteamGames];
  }

  // Ajouter un jeu Steam
  addSteamGame(game: SteamGame): void {
    const steamGames = this.getSteamGames();
    steamGames.push(game);
    this.store.set("steamGames", steamGames);
  }

  // Ajouter un jeu Non-Steam (ajouté manuellement dans Steam)
  addNonSteamGame(game: SteamGame): void {
    const nonSteamGames = this.getNonSteamGames();
    nonSteamGames.push(game);
    this.store.set("nonSteamGames", nonSteamGames);
  }

  // Mettre à jour un jeu Steam
  updateSteamGame(updatedGame: SteamGame): void {
    const steamGames = this.getSteamGames();
    const index = steamGames.findIndex((game) => game.id === updatedGame.id);
    if (index !== -1) {
      steamGames[index] = updatedGame;
      this.store.set("steamGames", steamGames);
    }
  }

  // Mettre à jour un jeu Non-Steam (ajouté manuellement dans Steam)
  updateNonSteamGame(updatedGame: SteamGame): void {
    const nonSteamGames = this.getNonSteamGames();
    const index = nonSteamGames.findIndex((game) => game.id === updatedGame.id);
    if (index !== -1) {
      nonSteamGames[index] = updatedGame;
      this.store.set("nonSteamGames", nonSteamGames);
    }
  }

  // Supprimer un jeu Steam
  deleteSteamGame(gameId: string): void {
    const steamGames = this.getSteamGames();
    const updatedSteamGames = steamGames.filter((game) => game.id !== gameId);
    this.store.set("steamGames", updatedSteamGames);
  }

  // Supprimer un jeu Non-Steam (ajouté manuellement dans Steam)
  deleteNonSteamGame(gameId: string): void {
    const nonSteamGames = this.getNonSteamGames();
    const updatedNonSteamGames = nonSteamGames.filter((game) => game.id !== gameId);
    this.store.set("nonSteamGames", updatedNonSteamGames);
  }

  // Supprimer un jeu (tous types)
  deleteGame(gameId: string): void {
    this.deleteSteamGame(gameId);
    this.deleteNonSteamGame(gameId);
  }

  // Récupérer un jeu spécifique par son ID (Steam ou Non-Steam)
  getGameById(gameId: string): SteamGame | undefined {
    const steamGames = this.getSteamGames();
    const nonSteamGames = this.getNonSteamGames();
    return (
      steamGames.find((game) => game.id === gameId) ||
      nonSteamGames.find((game) => game.id === gameId)
    );
  }
}

export default GameService;
