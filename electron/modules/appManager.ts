import * as path from "path";
import { PowerShell } from "node-powershell";
import fsExtra from "fs-extra";
import jsonfile from "jsonfile";
import SettingsService from "./settingsService";

export class AppManager {
  static createConfigCommand(configDir: string, appsJsonPath: string, tempContent: string): string {
    // Log the paths and content for debugging
    console.log("Config Dir:", configDir);
    console.log("Apps JSON Path:", appsJsonPath);
    console.log("Content to write:", tempContent);

    const command = `
      Write-Host 'Starting config update...'

      try {
        if (-not (Test-Path '${configDir}')) {
          Write-Host 'Creating config directory...'
          New-Item -ItemType Directory -Path '${configDir}' -Force
        }

        Write-Host 'Writing content to file...'
        $content = @'
${tempContent}
'@

        Set-Content -Path '${appsJsonPath}' -Value $content -Force -ErrorAction Stop
        Write-Host 'File written successfully'
      } catch {
        Write-Error "An error occurred: $_"
        exit 1
      }
    `;

    console.log("Generated command:", command);
    return command;
  }

  static async addAppToSunshine(app: Record<string, any>): Promise<boolean> {
    try {
      console.log("Starting addAppToSunshine with app:", app);

      const SS = new SettingsService();
      const settings = await SS.getSettings();
      console.log("Got settings:", settings);

      const { sunshinePath } = settings;
      if (!sunshinePath) {
        throw new Error("Sunshine path not found in settings.");
      }

      const configDir = path.join(sunshinePath, "config");
      const appsJsonPath = path.join(configDir, "apps.json");
      console.log("Working with paths:", { configDir, appsJsonPath });

      // Ensure the config directory exists
      await fsExtra.ensureDir(configDir);

      // Read existing apps data
      let appsData: {
        env: Record<string, string>;
        apps: Array<Record<string, any>>;
      } = { env: {}, apps: [] };
      try {
        appsData = await jsonfile.readFile(appsJsonPath);
        console.log("Existing apps data:", appsData);
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          console.error("Error reading apps.json:", error);
        }
      }

      // Ensure appsData has an 'apps' array
      if (!appsData.apps) {
        appsData.apps = [];
      }

      const { apps } = appsData;

      // Add or update app
      const existingAppIndex = apps.findIndex((a: Record<string, any>) => a.name === app.name);
      if (existingAppIndex !== -1) {
        apps[existingAppIndex] = app;
        console.log("Updating existing app");
      } else {
        apps.push(app);
        console.log("Adding new app");
      }

      // Prepare the content to write
      const content = JSON.stringify(appsData, null, 2);

      // Create the PowerShell command to write the file with elevated privileges
      const command = this.createConfigCommand(configDir, appsJsonPath, content);

      // Execute the PowerShell command
      const result = await PowerShell.invoke(command);

      if (result.hadErrors) {
        console.error("PowerShell error:", result.stderr?.toString());
        throw new Error("Failed to execute PowerShell command");
      } else {
        console.log("Command output:", result.stdout?.toString());
        console.log("Command completed successfully");
        return true;
      }
    } catch (error) {
      console.error("Error in addAppToSunshine:", error);
      throw error;
    }
  }
}
