import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

import {
  COLOR_DARK_BLUE,
  COLOR_LIGHT_BLUE,
  COLOR_WHITE,
} from "../Utils/Colors";

// Common movie card
const BaseMovieCard = ({ movieId, movieImage, movieTitle, movieYear }) => {
  const navigate = useNavigate();

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
        <CardContent>
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
        </CardContent>
      </Box>
    </Card>
  );
};

export default BaseMovieCard;
