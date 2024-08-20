import { TextField } from "@mui/material";
import { COLOR_BLUE_LIGHT, COLOR_RED, COLOR_WHITE } from "../utils/Colors";

const BaseTextField = ({
  value,
  handleChange,
  handleBlur,
  error,
  helperText,
}) => {
  return (
    <TextField
      id="email"
      name="email"
      type="email"
      fullWidth
      label={"Email"}
      placeholder={"Enter Email"}
      variant="outlined"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      helperText={helperText}
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
    />
  );
};

export default BaseTextField;
