import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  Box,
  CircularProgress,
  FormHelperText,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { CreateMovie, EditMovie } from "../../Graphql/mutations";
import { GetMovieById, GetMovies } from "../../Graphql/queries";

import BaseTextField from "../../Common/BaseTextField";
import BaseButton from "../../Common/BaseButton";
import DragDropFileUpload from "../../Common/DragDropFileUpload";
import LanguageDropdown from "../../Common/LanguageDropdown";
import { COLOR_RED } from "../../Utils/Colors";

const InputFields = ({ formik }) => {
  const { t } = useTranslation();

  const isMobileScreen = useMediaQuery("(max-width:428px)");

  // Restrict input to numbers only for the publishing year field
  // e => 69
  // + => 107, 187
  // - => 109, 189
  // . => 110, 190
  const onlyNumberKeys = (e) => {
    const invalidKeys = [69, 107, 109, 110, 187, 189, 190];

    if (invalidKeys.includes(e.nativeEvent.which)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <BaseTextField
        id="title"
        name="title"
        label={t("title")}
        placeholder={t("enterTitle")}
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />
      <BaseTextField
        id="publishingYear"
        name="publishingYear"
        type="number"
        label={t("publishingYear")}
        placeholder={t("enterPublishingYear")}
        value={formik.values.publishingYear}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.publishingYear && Boolean(formik.errors.publishingYear)
        }
        helperText={
          formik.touched.publishingYear && formik.errors.publishingYear
        }
        InputProps={{
          inputProps: { min: 0, onKeyDown: onlyNumberKeys },
        }}
        styleProp={{
          width: isMobileScreen ? "100%" : "60%",
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none",
              margin: 0,
            },
        }}
      />
    </>
  );
};

const Movie = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [image, setImage] = useState("");

  // Media querys for responsive design
  const isTabletScreen = useMediaQuery("(max-width:768px)");
  const isMobileScreen = useMediaQuery("(max-width:428px)");

  const token = localStorage.getItem("token");

  const context = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  // Mutation hook for creating and editing movies
  const [createMovie, { loading }] = useMutation(CreateMovie, {
    context,
    refetchQueries: [{ query: GetMovies, variables: { page: 1 }, context }],
  });

  const [editMovie, { loading: editLoading }] = useMutation(EditMovie, {
    context,
    refetchQueries: [{ query: GetMovies, variables: { page: 1 }, context }],
  });

  // Lazy Query hook for get movie details by its it
  const [getMovieById] = useLazyQuery(GetMovieById, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    fetchPolicy: "no-cache",
  });

  const validationSchema = yup.object({
    title: yup
      .string()
      .max(200, t("titleLengthError"))
      .required(t("titleRequired")),
    publishingYear: yup
      .number()
      .required(t("publishingYearRequired"))
      .min(1900, t("minYearError"))
      .max(
        new Date().getFullYear(),
        t("maxYearError", { year: new Date().getFullYear() })
      ),
    image: yup.string().required(t("posterRequired")),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      publishingYear: "",
      image: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const requestedPayload = { ...values };

        if (requestedPayload?.image) {
          delete requestedPayload.image;
        }

        if (image) {
          requestedPayload["poster"] = image;
        }

        let result;

        if (searchParams.has("id")) {
          requestedPayload["movieId"] = searchParams.get("id");
          result = await editMovie({
            variables: { ...requestedPayload },
          });
        } else {
          result = await createMovie({
            variables: { ...requestedPayload },
          });
        }

        console.log("result", result);

        if (result?.data?.createMovie || result?.data?.editMovie) {
          toast.success(
            result?.data?.createMovie ? t("movieCreated") : t("movieEdited")
          );
          navigate("/movie-list");
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  // Retrieve movie data and populate form fields if editing
  const handleGetMovieData = useCallback(async () => {
    const result = await getMovieById({
      variables: { movieId: searchParams.get("id") },
    });

    if (result?.data?.getMovieById) {
      const data = result.data.getMovieById;

      formik.setValues((prevValues) => ({
        ...prevValues,
        title: data?.title,
        publishingYear: data?.publishingYear,
        image: data?.poster,
      }));
    }
  }, [searchParams, getMovieById]);

  // Fetch movie data when an ID is present in the search params(url)
  useEffect(() => {
    if (searchParams.has("id")) {
      handleGetMovieData();
    }
  }, [searchParams, handleGetMovieData]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
        height: "100%",
        padding: isTabletScreen ? "20px" : "50px",
        position: "relative",
        zIndex: 1,
        overflowY: "auto",
        boxSizing: "border-box",
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
        <Typography variant={isTabletScreen ? "h5" : "h3"}>
          {searchParams.has("id") ? t("edit") : t("createNewMovie")}
        </Typography>
        <LanguageDropdown />
      </Box>
      <Grid container spacing={4}>
        {isMobileScreen && (
          <Grid item xs={12}>
            <Stack gap={2}>
              <InputFields formik={formik} />
            </Stack>
          </Grid>
        )}
        <Grid item xs={12} md={6} lg={5}>
          <DragDropFileUpload
            id={searchParams.get("id")}
            name={formik.values.title}
            formik={formik}
            setImage={setImage}
          />
          {formik.errors.image && (
            <FormHelperText sx={{ color: COLOR_RED }}>
              {formik.errors.image}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack gap={2}>
            {!isMobileScreen && <InputFields formik={formik} />}

            <Stack gap={2} direction={"row"}>
              <BaseButton
                variant="outlined"
                onClick={() => navigate("/movie-list")}
                styleProps={{ width: "100%" }}
              >
                {t("cancel")}
              </BaseButton>

              <BaseButton
                endIcon={
                  loading || editLoading ? <CircularProgress size={18} /> : null
                }
                onClick={formik.handleSubmit}
                styleProps={{ width: "100%" }}
              >
                {t("submit")}
              </BaseButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Movie;
