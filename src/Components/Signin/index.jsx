import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { SignIn } from "../../Graphql/mutations";

import BaseTextField from "../../Common/BaseTextField";
import BaseButton from "../../Common/BaseButton";
import { COLOR_BLUE_LIGHT, COLOR_WHITE } from "../../Utils/Colors";

import uncheckedCheckbox from "../../Assets/Images/unchecked-checkbox.png";

const Signin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);
  const [signIn, { loading }] = useMutation(SignIn);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isTabletScreen = useMediaQuery("(max-width:768px)");

  // Check if the cookie is valid or not, and navigate if the user is already logged in
  const handleCheckCoockieExpiration = useCallback(() => {
    const currentTime = new Date().getTime();
    const expirationTime = cookies.exp ? parseInt(cookies.exp) : null;

    if (cookies.token || (expirationTime && currentTime < expirationTime)) {
      navigate("/movie-list");
    }
  }, [navigate, cookies]);

  useEffect(() => {
    handleCheckCoockieExpiration();
  }, [cookies, handleCheckCoockieExpiration]);

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
        const result = await signIn({
          variables: { ...values },
        });
        if (result?.data?.signIn) {
          const token = result.data.signIn?.tokens?.accessToken?.token;
          setCookie("token", token, { maxAge: 24 * 60 * 60 });
          localStorage.setItem("token", token);
          navigate("/movie-list");
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const handleSetRememberMe = () => {
    setRememberMe(true);
  };

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
          {t("signIn")}
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

        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {rememberMe ? (
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{
                padding: "0",
                paddingRight: "5px",
                "& .MuiSvgIcon-root": {
                  fill: COLOR_BLUE_LIGHT,
                },
              }}
            />
          ) : (
            <img
              src={uncheckedCheckbox}
              alt="Checkbox"
              style={{ paddingRight: "10px", cursor: "pointer" }}
              onClick={handleSetRememberMe}
            />
          )}
          <Typography>{t("rememberMe")}</Typography>
        </Box>

        <BaseButton
          endIcon={loading ? <CircularProgress size={18} /> : null}
          onClick={formik.handleSubmit}
          styleProps={{ width: "100%" }}
        >
          {t("login")}
        </BaseButton>

        <Box sx={{ display: "flex", gap: "8px" }}>
          <Typography>{t("dontHaveAnAccount")}</Typography>
          <Link href={"/signup"} sx={{ color: COLOR_WHITE }}>
            {t("signup")}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Signin;
