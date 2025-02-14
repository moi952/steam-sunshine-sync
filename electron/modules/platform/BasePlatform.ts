export abstract class BasePlatform {
  protected abstract paths: { [key: string]: string[] };

  getSunshinePaths(): string[] {
    return this.paths.sunshine || [];
  }
  getSteamPaths(): string[] {
    return this.paths.steam || [];
  }
}
