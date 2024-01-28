import { Box } from "@mui/material";
import React from "react";
import { FC, ReactNode } from "react";

const TabPanel: FC<{
  children: ReactNode;
  value: number;
  index: number;
  [other: string]: any;
}> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ width: "100%", flexGrow: 1 }}
      {...other}
    >
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

export default TabPanel;
