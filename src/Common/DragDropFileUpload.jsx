import { useCallback, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { EditMovieImage } from "../Graphql/queries";

import useActionContext from "../Context/useActionContext";

import { COLOR_WHITE } from "../Utils/Colors";

function DragDropFileUpload({ id, name, setImage, formik }) {
  const { t } = useTranslation();
  const { handleShowError } = useActionContext();
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isShowProgressBar, setIsShowProgressBar] = useState(false);

  const isLaptopScreen = useMediaQuery("(min-width:1440px)");
  const token = localStorage.getItem("token");

  const [editMovieImage, { loading: imageLoading }] = useLazyQuery(
    EditMovieImage,
    {
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      onError: handleShowError,
    }
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const uploadFileImage = async (url, file) => {
    try {
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setIsShowProgressBar(true);
          setUploadProgress(percentCompleted);
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileRead = useCallback(
    (file) => {
      setLoading(true);
      const reader = new FileReader();

      reader.onloadend = () => {
        setLoading(false);
        formik.setFieldValue("image", reader.result);
      };

      reader.readAsDataURL(file);
    },
    [formik]
  );

  const getKey = (name) => {
    if (name.length > 200) {
      const [filename, ext] = name.split(".");
      return `${filename.slice(0, 35 - (ext.length + 1))}.${ext}`;
    }
    return name;
  };

  const handleImageUpload = async (file) => {
    try {
      const key = getKey(
        `${
          name?.replaceAll(" ", "_") +
          file.name.split(".")[0].replaceAll(" ", "_")
        }.${file.name.split(".").pop()}`
      );
      let payload = {};

      if (id) {
        payload.movieId = id;
      }

      if (!formik?.values?.image) {
        payload.key = key;
      }

      const result = await editMovieImage({ variables: { ...payload } });

      if (result?.data?.editMovieImage) {
        const data = result?.data?.editMovieImage;
        if (!!data?.key) {
          setImage(data.key);
        }
        if (data && !imageLoading) {
          await uploadFileImage(data?.putObjectUrl, file);
        }
        handleFileRead(file);
      }
    } catch (error) {
      console.error("Error uploading public content image:", error);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files) {
      handleImageUpload(files[0]);
    }
  };

  const handleChange = (event) => {
    const files = event.target.files;
    if (files) {
      handleImageUpload(files[0]);
    }
  };

  return (
    <Box>
      {/* Display drop box container without image */}
      {!formik?.values?.image && (
        <label htmlFor={`raised-file`}>
          <Paper
            variant="outlined"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${dragOver ? "#000" : "#aaa"}`,
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
              background: "transparent",
              boxSizing: "border-box",
              ...(isLaptopScreen
                ? { width: "473px", height: "504px" }
                : { width: "380px", height: "372px" }),
            }}
          >
            <input
              accept={"image/*"}
              style={{ display: "none" }}
              id={`raised-file`}
              type="file"
              onChange={handleChange}
            />

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={"100%"}
            >
              <IconButton
                aria-label="upload picture"
                component="span"
                sx={{ color: COLOR_WHITE }}
              >
                <DownloadIcon style={{ fontSize: 20 }} />
              </IconButton>
              <Typography color={COLOR_WHITE}>
                {t("dropAnImageHere")}
              </Typography>
            </Box>

            {loading && (
              <CircularProgress
                size={24}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Paper>
        </label>
      )}

      {/* Show Image if exists for Perview */}
      {formik?.values?.image && (
        <>
          <label htmlFor={`raised-button-file`}>
            <Box
              sx={{
                width: "200px",
                height: "200px",
                cursor: "pointer",
                position: "relative",
                ...(isLaptopScreen
                  ? { width: "473px", height: "504px" }
                  : { width: "380px", height: "372px" }),
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "5px",
                }}
                component="img"
                src={formik.values.image}
                alt="Image Preview"
              />
            </Box>
          </label>
          <input
            accept={"image/*"}
            style={{ display: "none" }}
            id={`raised-button-file`}
            type="file"
            onChange={handleChange}
          />
        </>
      )}

      {/* Image upload progress bar*/}
      {isShowProgressBar && (
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              style={{
                height: 5,
                display: uploadProgress === 100 ? "none" : "block",
              }}
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography
              color="textPrimary"
              sx={{ display: uploadProgress === 100 ? "none" : "block" }}
            >{`${uploadProgress}%`}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default DragDropFileUpload;
