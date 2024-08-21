import { Button } from "@mui/material";

import { COLOR_GREEN, COLOR_WHITE } from "../Utils/Colors";

// Common button
const BaseButton = ({
  variant = "filled",
  children,
  styleProps,
  ...buttonProps
}) => {
  const dynamicStyle =
    variant === "outlined"
      ? { border: `1px solid ${COLOR_WHITE}` }
      : { background: COLOR_GREEN, border: `1px solid ${COLOR_GREEN}` };

  return (
    <Button
      sx={{
        ...dynamicStyle,
        color: COLOR_WHITE,
        "&:hover": {
          ...dynamicStyle,
        },
        ...styleProps,
        "&.Mui-disabled": {
          opacity: 0.5,
          color: COLOR_WHITE,
        },
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default BaseButton;
