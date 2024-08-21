import { gql } from "@apollo/client";

// GraphQL query to fetch a list of movies
export const GetMovies = gql`
  query getMovies($page: Int!, $recordCount: Int) {
    getMovies(page: $page, recordCount: $recordCount) {
      totalCount
      page
      data {
        _id
        title
        poster
        publishingYear
        createdBy {
          email
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// GraphQL query to fetch details of a single movie by its ID
export const GetMovieById = gql`
  query getMovieById($movieId: String!) {
    getMovieById(movieId: $movieId) {
      _id
      title
      poster
      publishingYear
      createdBy {
        email
      }
      createdAt
      updatedAt
    }
  }
`;

// GraphQL query to get URLs for uploading and accessing an image for a movie
export const EditMovieImage = gql`
  query editMovieImage($movieId: String, $key: String) {
    editMovieImage(movieId: $movieId, key: $key) {
      putObjectUrl
      publicUrl
      key
    }
  }
`;
