import * as fs from "fs";
import * as path from "path";
import * as drivelist from "drivelist";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export class PathDetector {
  private static steamPath: string | null = null;

  // Detects the Steam installation path by checking predefined paths and then searching using shell commands
  static async detectSteamPath(): Promise<string | null> {
    if (this.steamPath) {
      return this.steamPath;
    }

    console.log("Scanning predefined paths for Steam installation...");

    // Predefined paths to check
    const predefinedPaths = ["Program Files/Steam", "Program Files (x86)/Steam", "Steam"];

    const drives = await drivelist.list();
    for (const drive of drives) {
      const drivePath = drive.mountpoints[0]?.path;
      if (!drivePath) continue;

      for (const predefinedPath of predefinedPaths) {
        const fullPath = path.join(drivePath, predefinedPath, "steam.exe");
        if (fs.existsSync(fullPath)) {
          this.steamPath = path.dirname(fullPath);
          console.log(`Steam executable found at: ${fullPath}`);
          return this.steamPath;
        }
      }
    }

    console.log("Steam installation not found in predefined paths. Performing manual search...");

    for (const drive of drives) {
      const drivePath = drive.mountpoints[0]?.path;
      if (!drivePath) continue;

      try {
        // Use shell command to search for steam.exe in the drive
        const { stdout } = await execPromise(`dir /s /b ${path.join(drivePath, "steam.exe")}`);
        const steamPaths = stdout.split("\n").filter(Boolean);
        if (steamPaths.length > 0) {
          this.steamPath = path.dirname(steamPaths[0]);
          console.log(`Steam executable found at: ${steamPaths[0]}`);
          return this.steamPath;
        }
      } catch (error) {
        console.error(`Error searching in ${drivePath}:`, error);
      }
    }

    console.log("Steam installation not found.");
    return null;
  }

  // Detects the Sunshine installation path by checking predefined paths and then searching using shell commands
  static async detectSunshinePath(): Promise<string | null> {
    console.log("Scanning predefined paths for Sunshine installation...");

    // Predefined paths to check
    const predefinedPaths = ["Program Files/Sunshine", "Program Files (x86)/Sunshine"];

    const drives = await drivelist.list();
    for (const drive of drives) {
      const drivePath = drive.mountpoints[0]?.path;
      if (!drivePath) continue;

      for (const predefinedPath of predefinedPaths) {
        const fullPath = path.join(drivePath, predefinedPath, "sunshine.exe");
        if (fs.existsSync(fullPath)) {
          console.log(`Sunshine executable found at: ${fullPath}`);
          return path.dirname(fullPath);
        }
      }
    }

    console.log("Sunshine installation not found in predefined paths. Performing manual search...");

    for (const drive of drives) {
      const drivePath = drive.mountpoints[0]?.path;
      if (!drivePath) continue;

      try {
        // Use shell command to search for sunshine.exe in the drive
        const { stdout } = await execPromise(`dir /s /b ${path.join(drivePath, "sunshine.exe")}`);
        const sunshinePaths = stdout.split("\n").filter(Boolean);
        if (sunshinePaths.length > 0) {
          console.log(`Sunshine executable found at: ${sunshinePaths[0]}`);
          return path.dirname(sunshinePaths[0]);
        }
      } catch (error) {
        console.error(`Error searching in ${drivePath}:`, error);
      }
    }

    console.log("Sunshine installation not found.");
    return null;
  }
}
