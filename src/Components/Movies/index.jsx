import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";

import { GetMovies } from "../../Graphql/queries";

import useActionContext from "../../Context/useActionContext";

import NoData from "./NoData";
import MovieList from "./MovieList";
import Pagination from "../../Common/Pagination";
import LanguageDropdown from "../../Common/LanguageDropdown";
import { COLOR_WHITE } from "../../Utils/Colors";

const Movies = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleLogout, handleShowError } = useActionContext();
  const [page, setPage] = useState(1);

  const isTabletScreen = useMediaQuery("(max-width:768px)");
  const token = localStorage.getItem("token");

  const [getMovies, { loading, data }] = useLazyQuery(GetMovies, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    onError: handleShowError,
  });

  // Get movies for the first time and when page changes
  useEffect(() => {
    if (token) {
      getMovies({
        variables: { page },
      });
    }
  }, [getMovies, page, token]);

  return (
    <Box
      sx={{
        height: "100%",
        padding: isTabletScreen ? "50px 20px" : "50px",
        paddingBottom: "150px",
        position: "relative",
        zIndex: 1,
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      {loading ? (
        // Display a loading spinner while data is being fetched
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : data?.getMovies?.data?.length ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: isTabletScreen ? "5px" : "10px",
                alignItems: "center",
              }}
            >
              <Typography variant={isTabletScreen ? "h5" : "h3"}>
                {t("myMovies")}
              </Typography>
              <IconButton
                onClick={() => navigate("/movie")}
                sx={{ color: COLOR_WHITE }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <LanguageDropdown />
              <Button
                variant="text"
                endIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  color: COLOR_WHITE,
                  textTransform: "capitalize",
                  fontWeight: 600,
                }}
              >
                {t("logout")}
              </Button>
            </Box>
          </Box>
          <MovieList movies={data.getMovies.data} />
          <Pagination
            totalCount={data?.getMovies?.totalCount}
            page={page}
            setPage={setPage}
          />
        </Box>
      ) : (
        // Display No Data component if there is no movies
        <NoData />
      )}
    </Box>
  );
};

export default Movies;
