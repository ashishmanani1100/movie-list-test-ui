import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Box, useMediaQuery } from "@mui/material";

import LanguageProvider from "../../Context/LanguageProvider";

import { COLOR_BLUE } from "../../Utils/Colors";

import waves from "../../Assets/Images/Waves.png";
import waves2 from "../../Assets/Images/Waves-2.png";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["token"]);
  const { pathname } = useLocation();

  const isMobileScreen = useMediaQuery("(max-width:428px)");

  const handleCheckCoockieExpiration = useCallback(() => {
    const currentTime = new Date().getTime();
    const expirationTime = cookies.exp ? parseInt(cookies.exp) : null;

    if (!cookies.token || (expirationTime && currentTime > expirationTime)) {
      localStorage.removeItem("token");
      navigate(pathname === "/signup" ? "/signup" : "/");
    }
  }, [navigate, cookies, pathname]);

  useEffect(() => {
    handleCheckCoockieExpiration();
  }, [cookies, handleCheckCoockieExpiration]);

  useEffect(() => {
    const listener = (e) => {
      const token = localStorage.getItem("token");
      if (!token) {
        removeCookie("token");
        navigate("/");
      }
    };

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [navigate, removeCookie]);

  return (
    // Main screen with image in layout
    <LanguageProvider>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          backgroundColor: COLOR_BLUE,
          position: "relative",
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${isMobileScreen ? waves2 : waves})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0 100%",
            backgroundSize: "contain",
          },
        }}
      >
        {/* UI on main layout */}
        {children}
      </Box>
    </LanguageProvider>
  );
};

export default Layout;
