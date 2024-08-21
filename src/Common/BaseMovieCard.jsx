import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { DeleteMovie } from "../Graphql/mutations";
import { GetMovies } from "../Graphql/queries";

import {
  COLOR_DARK_BLUE,
  COLOR_LIGHT_BLUE,
  COLOR_WHITE,
} from "../Utils/Colors";

// Common movie card
const BaseMovieCard = ({ movieId, movieImage, movieTitle, movieYear }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const context = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const [deleteMovie] = useMutation(DeleteMovie, {
    context,
    refetchQueries: [{ query: GetMovies, variables: { page: 1 }, context }],
  });

  const handleDelete = async () => {
    const result = await deleteMovie({
      variables: { movieId },
    });

    if (result?.data?.deleteMovie) {
      toast.success(t("movieDeleted"));
      navigate("/movie-list");
    } else if (result?.errors?.length) {
      toast.error(result.errors[0]?.message);
    }
  };

  return (
    <Card
      sx={{
        background: COLOR_DARK_BLUE,
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        cursor: "pointer",
        "&:hover": {
          background: COLOR_LIGHT_BLUE,
        },
      }}
      onClick={() => navigate(`/movie?id=${movieId}`)}
    >
      <Box sx={{ padding: "8px" }}>
        <CardMedia
          component="img"
          height="400"
          image={movieImage}
          alt={movieTitle}
          sx={{
            borderRadius: "12px",
            objectFit: "fill",
            width: "266px",
          }}
        />
        <CardContent
          sx={{ display: "flex", justifyContent: "space-between", gap: "5px" }}
        >
          <Box>
            <Typography
              variant="h4"
              fontSize="20px"
              fontWeight={600}
              color={COLOR_WHITE}
            >
              {movieTitle}
            </Typography>
            <Typography fontSize="14px" color={COLOR_WHITE}>
              {movieYear}
            </Typography>
          </Box>
          <IconButton sx={{ color: COLOR_WHITE }} onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Box>
    </Card>
  );
};

export default BaseMovieCard;
