import React from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";

const DropDown = ({
  label,
  value,
  onChange,
  dropDownItems,
  containerStyles,
  id,
}) => {
  const menuProps = {
    slotProps: {
      paper: {
        className: "scrollModern",
        style: {
          maxHeight: 200, // Set max height for the dropdown menu
          overflowY: "auto", // Add scrolling if content exceeds the height
        },
      },
    },
  };
  return (
    <FormControl style={{ marginLeft: "20px" }}>
      <InputLabel id={id || "demo-simple-select-label"}>{label}</InputLabel>
      <Select
        labelId={id || "demo-select-small-label"}
        id={id || "demo-select-small"}
        MenuProps={menuProps}
        value={value}
        label={label}
        onChange={onChange}
        style={{ width: "110px" }}
      >
        {dropDownItems.map((item, i) => {
          return (
            <MenuItem id={i} value={item}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default DropDown;
