import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

// When page not found
const PageNotFound = () => {
  const { t } = useTranslation();

  return <Typography variant="h5">{t("pageNotFound")}</Typography>;
};

export default PageNotFound;
