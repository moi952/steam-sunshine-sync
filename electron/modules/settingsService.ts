import { Conf } from "electron-conf";

interface Settings {
  themeMode: "light" | "dark" | "system";
  steamPath: string;
  steamId: string;
  language: string;
  sunshinePath: string;
  firstLaunch: boolean;
  sunshineLogin: string;
  sunshinePassword: string;
  sunshineUrl: string;
}

class SettingsService {
  private store: Conf<Settings>;

  constructor() {
    this.store = new Conf<Settings>({
      defaults: {
        themeMode: "system",
        steamPath: "",
        steamId: "",
        language: "en",
        sunshinePath: "",
        firstLaunch: true,
        sunshineLogin: "",
        sunshinePassword: "",
        sunshineUrl: "https://localhost:47990",
      },
    });
  }

  // Get settings with a fallback to defaults
  getSettings(): Settings {
    const settings = this.store.store;
    // Fallback to default values if some settings are missing
    return {
      themeMode: settings.themeMode || "system",
      steamPath: settings.steamPath || "",
      steamId: settings.steamId || "",
      language: settings.language || "en",
      sunshinePath: settings.sunshinePath || "",
      firstLaunch: settings.firstLaunch,
      sunshineLogin: settings.sunshineLogin || "",
      sunshinePassword: settings.sunshinePassword || "",
      sunshineUrl: settings.sunshineUrl || "",
    };
  }

  saveSettings(settings: Partial<Settings>): void {
    // Ensure that only the provided settings are updated
    this.store.set(settings);
  }
}

export default SettingsService;
