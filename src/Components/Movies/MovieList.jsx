import { Box } from "@mui/material";

import BaseMovieCard from "../../Common/BaseMovieCard";

// Component to display a list of movie cards
const MovieList = ({ movies }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      {movies.map((movie, i) => {
        const { _id, poster, title, publishingYear } = movie;
        return (
          <Box sx={{ width: "282px", height: "504px" }}>
            <BaseMovieCard
              movieId={_id}
              movieImage={poster}
              movieTitle={title}
              movieYear={publishingYear}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default MovieList;
