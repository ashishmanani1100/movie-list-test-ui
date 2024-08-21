import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { languages } from "../Utils/languages";

const defaultValue = {
  selectedLanguage: "en",
  handleChangeLanguage: () => {},
};

export const LanguageContext = createContext(defaultValue);

const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(languages.en.key);

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    setSelectedLanguage(lang);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  const handleChangeLanguage = (lang) => {
    setSelectedLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ selectedLanguage, handleChangeLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
