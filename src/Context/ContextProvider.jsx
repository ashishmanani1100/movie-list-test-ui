import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";

import { languages } from "../Utils/languages";
import { toast } from "react-toastify";

const defaultValue = {
  selectedLanguage: "en",
  handleChangeLanguage: () => {},
  handleLogout: () => {},
  handleShowError: () => {},
};

export const ActionContext = createContext(defaultValue);

const ContextProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const client = useApolloClient();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["token"]);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lang");
    removeCookie("token");
    navigate("/");
    client.clearStore();
  };

  const handleShowError = ({ networkError, graphQLErrors }) => {
    if (networkError?.result?.errors?.length) {
      toast.error(
        networkError.result.errors.map(({ message }) => message).join(" ")
      );
      return;
    }
    if (graphQLErrors?.[0]?.message) {
      toast.error(graphQLErrors[0].message);
      handleLogout();
      return;
    }
    toast.error("Something went wrong");
  };

  return (
    <ActionContext.Provider
      value={{
        selectedLanguage,
        handleChangeLanguage,
        handleLogout,
        handleShowError,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export default ContextProvider;
