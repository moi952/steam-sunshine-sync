import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

export type Settings = {
  themeMode: "light" | "dark" | "system";
  firstLaunch: boolean;
  steamPath?: string;
  steamId?: string;
  language?: string;
  sunshinePath?: string;
  sunshineLogin?: string;
  sunshinePassword?: string;
};

type SettingsContextType = {
  settings: Settings;
  saveSettings: (_newSettings: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({ firstLaunch: true, themeMode: "system" });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await window.electronSettingsStorageApi.getSettings();
        setSettings((prev) => ({ ...prev, ...loadedSettings }));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updatedSettings = { ...prev, ...newSettings, ...{ firstLaunch: false } };
      console.log("SettingsContext | Saving settings:", updatedSettings);
      window.electronSettingsStorageApi.saveSettings(updatedSettings);
      return updatedSettings;
    });
  }, []);

  const value = useMemo(() => ({ settings, saveSettings }), [settings, saveSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
