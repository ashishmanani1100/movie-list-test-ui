import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Typography, useMediaQuery } from "@mui/material";

import BaseButton from "../../Common/BaseButton";

// Component to display a message when there is no data to show
const NoData = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isTabletScreen = useMediaQuery("(max-width:768px)");

  return (
    <Box
      sx={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography variant={isTabletScreen ? "h4" : "h2"}>
        {t("movieListEmpty")}
      </Typography>
      <Box>
        <BaseButton onClick={() => navigate("/movie")}>
          {t("addNewMovie")}
        </BaseButton>
      </Box>
    </Box>
  );
};

export default NoData;
