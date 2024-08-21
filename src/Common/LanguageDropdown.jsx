import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Box, MenuItem, Select } from "@mui/material";

import { LanguageContext } from "../Context/LanguageProvider";

import { languages } from "../Utils/languages";
import { COLOR_WHITE } from "../Utils/Colors";

/* Language dropdown */
const LanguageDropdown = () => {
  const { t } = useTranslation();
  const { selectedLanguage, handleChangeLanguage } =
    useContext(LanguageContext);

  return (
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
  );
};

export default LanguageDropdown;
