import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { WindowsPlatform } from "./platform/WindowsPlatform";
import { LinuxPlatform } from "./platform/LinuxPlatform";
import { MacOSPlatform } from "./platform/MacOSPlatform";

const execPromise = promisify(exec);

export class PathDetector {
  private possibleSteamPaths: string[] = [];
  private possibleSunshinePaths: string[] = [];
  private platform: string = process.platform;
  private platformInstance: WindowsPlatform | LinuxPlatform | MacOSPlatform | null = null;

  private steamPath: string | null = null;
  private sunshinePath: string | null = null;

  constructor() {
    this.initializePlatformInstance();
  }

  private async initializePlatformInstance() {
    if (this.platform === "win32") {
      this.platformInstance = new WindowsPlatform();
    } else if (this.platform === "linux") {
      this.platformInstance = new LinuxPlatform();
    } else if (this.platform === "darwin") {
      this.platformInstance = new MacOSPlatform();
    }
    console.log(`Initialized platform to ${this.platform}`);
    this.possibleSteamPaths = this.platformInstance!.getSteamPaths();
    this.possibleSunshinePaths = this.platformInstance!.getSunshinePaths();
  }

  async detectSteamPath(): Promise<string | null> {
    if (this.steamPath) {
      return this.steamPath;
    }

    console.log("Scanning possible paths for Steam installation...");

    const steamExecutable = this.platform === "win32" ? "steam.exe" : "steam";

    if (this.platform === "darwin") {
      return this.possibleSteamPaths[0];
    }
    for (const possibleSteamPath of this.possibleSteamPaths) {
      const fullPath = path.join(possibleSteamPath, steamExecutable);
      console.log(`Steam search at: ${fullPath}`);
      if (fs.existsSync(fullPath)) {
        this.steamPath = possibleSteamPath;
        console.log(`Steam executable found at: ${fullPath}`);
        return this.steamPath;
      }
    }

    console.log("Steam installation not found in predefined paths. Performing manual search...");

    try {
      const searchCommand = this.platform === "win32" ? "where steam.exe" : "command -v steam";
      const { stdout } = await execPromise(searchCommand);
      const steamPaths = stdout.split("\n").filter(Boolean);
      if (steamPaths.length > 0) {
        this.steamPath = path.dirname(steamPaths[0].trim());
        console.log(`Steam executable found at: ${steamPaths[0]}`);
        return this.steamPath;
      }
    } catch (error) {
      console.error("Error searching for Steam executable:", error);
    }

    console.log("Steam installation not found.");
    return null;
  }

  async detectSunshinePath(): Promise<string | null> {
    console.log("Scanning possible paths for Sunshine installation...");

    const sunshineExecutable = this.platform === "win32" ? "sunshine.exe" : "sunshine";

    if (this.platform === "darwin") {
      return this.possibleSunshinePaths[0];
    }

    for (const possibleSunshinePath of this.possibleSunshinePaths) {
      const fullPath = path.join(possibleSunshinePath, sunshineExecutable);
      console.log(`Sunshine search at: ${fullPath}`);
      if (fs.existsSync(fullPath)) {
        this.sunshinePath = possibleSunshinePath;
        console.log(`Sunshine executable found at: ${fullPath}`);
        return this.sunshinePath;
      }
    }

    console.log("Sunshine installation not found in predefined paths. Performing manual search...");

    try {
      const searchCommand =
        this.platform === "win32" ? "where sunshine.exe" : "command -v sunshine";
      const { stdout } = await execPromise(searchCommand);
      const sunshinePaths = stdout.split("\n").filter(Boolean);
      if (sunshinePaths.length > 0) {
        console.log(`Sunshine executable found at: ${sunshinePaths[0].trim()}`);
        return path.dirname(sunshinePaths[0].trim());
      }
    } catch (error) {
      console.error("Error searching for Sunshine executable:", error);
    }

    console.log("Sunshine installation not found.");
    return null;
  }
}
