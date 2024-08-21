import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { Box, MenuItem, Select, useMediaQuery } from "@mui/material";

import { COLOR_BLUE, COLOR_WHITE } from "../../Utils/Colors";
import { languages } from "../../Utils/languages";

import waves from "../../Assets/Images/Waves.png";
import waves2 from "../../Assets/Images/Waves-2.png";

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["token"]);
  const { pathname } = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState(languages.en.key);

  const isMobileScreen = useMediaQuery("(max-width:428px)");

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  const handleCheckCoockieExpiration = useCallback(() => {
    const currentTime = new Date().getTime();
    const expirationTime = cookies.exp ? parseInt(cookies.exp) : null;

    if (!cookies.token || (expirationTime && currentTime > expirationTime)) {
      localStorage.removeItem("token");
      navigate(pathname === "/signup" ? "/signup" : "/");
    }
  }, [navigate, cookies, pathname]);

  useEffect(() => {
    handleCheckCoockieExpiration();
  }, [cookies, handleCheckCoockieExpiration]);

  useEffect(() => {
    const listener = (e) => {
      const token = localStorage.getItem("token");
      if (!token) {
        removeCookie("token");
        navigate("/");
      }
    };

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [navigate, removeCookie]);

  const handleChangeLanguage = (lang) => {
    setSelectedLanguage(lang);
  };

  return (
    // Main screen with image in layout
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: COLOR_BLUE,
        position: "relative",
        "&::before": {
          content: '""',
          display: "block",
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${isMobileScreen ? waves2 : waves})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 100%",
          backgroundSize: "contain",
        },
      }}
    >
      {/* Language dropdown */}
      <Select
        id="language"
        name="language"
        size="small"
        placeholder={t("selectLanguage")}
        value={selectedLanguage}
        onChange={(e) => handleChangeLanguage(e.target.value)}
        MenuProps={{ sx: { height: "300px" } }}
        renderValue={(value) => {
          return (
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {value?.toUpperCase()}
            </Box>
          );
        }}
        sx={{
          height: "30px",
          width: "95px",
          border: "1px solid #fff !important",
          position: "absolute",
          right: "10px",
          top: "10px",
          zIndex: 2,
          ".MuiSelect-icon": {
            color: COLOR_WHITE,
          },
          ".MuiSelect-outlined": {
            color: COLOR_WHITE,
          },
        }}
      >
        {Object.values(languages)?.map((language, i) => (
          <MenuItem value={language.key} key={i}>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {language.name} - {language.key.toUpperCase()}
            </Box>
          </MenuItem>
        ))}
      </Select>

      {/* UI on main layout */}
      {children}
    </Box>
  );
};

export default Layout;
