import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { COLOR_BLUE, COLOR_BLUE_LIGHT, COLOR_RED, COLOR_WHITE } from "../../utils/Colors";
import BaseTextField from "../../Common/BaseTextField";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = yup.object({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid Email"
      )
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password should be of minimum 8 characters long")
      .max(128, "Password must be less than 128 characters!")
      .required("Password is required!"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // const requestedPayload = filterEmptyStrings(values);

      try {
        // if (amazonProductData) {
        //   await editAmazonProduct(
        //     {
        //       ...requestedPayload,
        //       amazonProductId: amazonProductData?._id,
        //     },
        //     (resultData) => {
        //       if (!!resultData?.editAmazonProduct) {
        //         refetch();
        //         toggle();
        //         toast.success(t("productUpdated"), {
        //           position: toast.POSITION.BOTTOM_CENTER,
        //         });
        //       }
        //     }
        //   );
        // }
      } catch (error) {}
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Typography variant={"h1"}>Sign in</Typography>
        <BaseTextField
          value={formik.values.email}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        {/* <TextField
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          fullWidth
          label={"Email"}
          placeholder={"Enter Email"}
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{
            "& .MuiInputBase-root": {
              color: COLOR_WHITE,
              borderRadius: "10px",
              "& input": {
                WebkitTapHighlightColor: COLOR_BLUE_LIGHT,
                padding: "16px",
              },
            },
            "& .MuiFormHelperText-root": {
              marginLeft: "0",
              color: COLOR_RED,
              fontSize: "12px",
            },
            "& .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
              color: COLOR_WHITE,
            },
            "& .MuiFormLabel-root.MuiInputLabel-root.Mui-error": {
              color: COLOR_RED,
            },
          }}
        /> */}
        <TextField
          id="password"
          fullWidth
          name="password"
          autoComplete="off"
          label={"Password"}
          placeholder={"Enter Password"}
          variant="outlined"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          type={showPassword ? "text" : "password"}
          // InputProps={{
          //   endAdornment: (
          //     <InputAdornment position="end">
          //       <IconButton
          //         onClick={() => setShowPassword(!showPassword)}
          //         onMouseDown={(event) => {
          //           event.preventDefault();
          //         }}
          //         edge="end"
          //       >
          //         {showPassword ? <Visibility /> : <VisibilityOff />}
          //       </IconButton>
          //     </InputAdornment>
          //   ),
          // }}
        />
      </Box>
    </Box>
  );
};

export default Signin;
