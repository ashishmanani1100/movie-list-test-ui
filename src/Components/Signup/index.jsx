import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { SignUp } from "../../Graphql/mutations";

import BaseTextField from "../../Common/BaseTextField";
import BaseButton from "../../Common/BaseButton";
import { COLOR_WHITE } from "../../Utils/Colors";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signUp, { loading }] = useMutation(SignUp);
  const [showPassword, setShowPassword] = useState(false);

  const isTabletScreen = useMediaQuery("(max-width:768px)");

  const validationSchema = yup.object({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("enterValidEmail")
      )
      .required(t("emailRequired")),
    password: yup
      .string()
      .min(8, t("passwordMinLength"))
      .max(128, t("passwordMaxLength"))
      .required(t("passwordRequired")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await signUp({
          variables: { ...values },
        });
        if (result?.data?.signUp) {
          toast.success(t("signupSuccessful"));
          navigate("/");
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Typography variant={isTabletScreen ? "h4" : "h2"}>
          {t("signup")}
        </Typography>

        <BaseTextField
          id="email"
          name="email"
          type="email"
          label={t("email")}
          placeholder={t("enterEmail")}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <BaseTextField
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          label={t("password")}
          placeholder={t("enterPassword")}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  sx={{ color: COLOR_WHITE }}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <BaseButton
          endIcon={loading ? <CircularProgress size={18} /> : null}
          onClick={formik.handleSubmit}
          styleProps={{ width: "100%" }}
        >
          {t("signup")}
        </BaseButton>

        <Box sx={{ display: "flex", gap: "8px" }}>
          <Typography>{t("alreadyHaveAnAccount")}</Typography>
          <Link href={"/"} sx={{ color: COLOR_WHITE }}>
            {t("login")}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
