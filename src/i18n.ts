import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const getSettings = async () => {
  try {
    const settings = await window.electronSettingsStorageApi.getSettings();
    console.log("Settings received in renderer:", settings);
    return settings;
  } catch (error) {
    console.error("Error getting settings:", error);
    return { language: "en" }; // Fallback to English in case of error
  }
};

const initializeI18n = async () => {
  const settings = await getSettings();

  i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, fr: { translation: fr } },
    fallbackLng: settings.language || "en", // Fallback to 'en' if no language is set
    interpolation: { escapeValue: false },
  });

  console.log("i18n initialized with language:", settings.language || "en");
};

initializeI18n(); // Call the initialization function

export default i18n;
