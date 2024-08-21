import { gql } from "@apollo/client";

// GraphQL mutation for user sign-in
export const SignIn = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      user {
        email
      }
      tokens {
        accessToken {
          token
          expires
        }
      }
    }
  }
`;

// GraphQL mutation for user sign-up
export const SignUp = gql`
  mutation signUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      user {
        email
      }
      tokens {
        accessToken {
          token
          expires
        }
      }
    }
  }
`;

// GraphQL mutation for creating a new movie
export const CreateMovie = gql`
  mutation createMovie(
    $title: String!
    $poster: String!
    $publishingYear: Int!
  ) {
    createMovie(
      title: $title
      poster: $poster
      publishingYear: $publishingYear
    ) {
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

// GraphQL mutation for editing an existing movie
export const EditMovie = gql`
  mutation editMovie(
    $movieId: String!
    $title: String!
    $poster: String
    $publishingYear: Int!
  ) {
    editMovie(
      movieId: $movieId
      title: $title
      poster: $poster
      publishingYear: $publishingYear
    ) {
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
