import { TextField } from "@mui/material";

import { COLOR_BLUE_LIGHT, COLOR_RED, COLOR_WHITE } from "../Utils/Colors";

// Common text field
const BaseTextField = ({ type = "text", styleProp = {}, ...props }) => {
  return (
    <TextField
      type={type}
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiInputBase-root": {
          color: COLOR_WHITE,
          borderRadius: "10px",
          "& fieldset": {
            borderColor: COLOR_WHITE,
          },
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
          borderColor: COLOR_WHITE,
        },
        "& .MuiFormLabel-root.MuiInputLabel-root.Mui-error": {
          color: COLOR_RED,
        },
        "& .MuiFormLabel-root": {
          color: COLOR_WHITE,
        },
        ...styleProp,
      }}
      {...props}
    />
  );
};

export default BaseTextField;
