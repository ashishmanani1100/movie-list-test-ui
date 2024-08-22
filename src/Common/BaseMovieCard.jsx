import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";

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
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");

  const context = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const [deleteMovie, { loading }] = useMutation(DeleteMovie, {
    context,
    refetchQueries: [{ query: GetMovies, variables: { page: 1 }, context }],
  });

  const handleDelete = async () => {
    try {
      const result = await deleteMovie({
        variables: { movieId },
      });

      if (result?.data?.deleteMovie) {
        toast.success(t("movieDeleted"));
        handleClose();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
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
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "5px",
            }}
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
            <IconButton sx={{ color: COLOR_WHITE }} onClick={handleOpen}>
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Box>
      </Card>

      <Dialog
        open={isOpen}
        PaperProps={{
          sx: {
            width: "100%",
          },
        }}
      >
        <DialogTitle display="flex" alignItems="center">
          {<WarningIcon color="warning" fontSize="large" />}
          <Typography color={"warning"} sx={{ ml: 2 }} variant="inherit">
            {t("warning")}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography
            key="customized-message"
            color="textPrimary"
            variant="body1"
            sx={{ wordWrap: "break-word" }}
          >
            {t("deleteMovie", { name: movieTitle })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "12px" }}>
          <Button
            data-testid="cancelButton"
            color="error"
            onClick={handleClose}
            variant="contained"
            disabled={loading}
          >
            {t("no")}
          </Button>
          <Button
            data-testid="confirmButton"
            color="success"
            onClick={handleDelete}
            variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={18} /> : null}
          >
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BaseMovieCard;
