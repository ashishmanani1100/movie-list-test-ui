import { Box, useMediaQuery } from "@mui/material";

import { COLOR_BLUE } from "../../utils/Colors";

import waves from "../../Assets/Images/Waves.png";
import waves2 from "../../Assets/Images/Waves-2.png";

const Layout = ({ children }) => {
  const isMobileScreen = useMediaQuery("(max-width:428px)");

  return (
    <Box
      sx={{
        height: "100vh",
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
      {children}
    </Box>
  );
};

export default Layout;
