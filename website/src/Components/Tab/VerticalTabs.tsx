import { Tab, Tabs } from "@mui/material";
import { VerticalTabsComponentProps } from "../../types/commonTypes";
import _ from "lodash";

const VerticlTabs: React.FC<VerticalTabsComponentProps> = ({
  tabIndex,
  onChange,
  children,
}) => {
  return (
    <Tabs
      variant="fullWidth"
      value={tabIndex}
      onChange={(e, v) => {
        if (!onChange) return;
        onChange(v);
      }}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
      sx={{
        borderRight: 1,
        borderColor: "divider",
        "& .MuiTabs-indicator": {
          display: "flex",
          justifyContent: "center",
          backgroundColor: (theme) => theme.palette.text.primary,
        },
      }}
    >
      {children}
    </Tabs>
  );
};

export default VerticlTabs;
