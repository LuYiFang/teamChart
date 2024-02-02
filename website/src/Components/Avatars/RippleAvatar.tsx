import { Avatar, Badge, styled } from "@mui/material";
import { FC, forwardRef, ReactNode } from "react";
import { OnlineStatus, RippleAvatarProps } from "../../types/commonTypes";
import _ from "lodash";

const StyledBadge = styled(Badge)<{ status: OnlineStatus | undefined }>(({
  theme,
  status,
}) => {
  let color = "#c7c7c7";
  if (status === OnlineStatus.Online) {
    color = "#44b700";
  }

  return {
    "&": {
      margin: 3,
    },
    "& .MuiBadge-badge": {
      backgroundColor: color,
      color: color,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  };
});

export const RippleStyledAvatar = styled(Avatar)<RippleAvatarProps>(({
  theme,
  active,
  iscurrentuser,
}) => {
  return {
    "&": {
      backgroundColor:
        iscurrentuser == "true"
          ? theme.palette.primary.dark
          : theme.palette.secondary.main,
      ...(active && { boxShadow: "0 0 7px #000" }),
    },
    ...(active && {
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "2px solid currentColor",
        content: '""',
      },
    }),
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.2)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(1.5)",
        opacity: 0,
      },
    },
  };
});

const RippleAvatar = forwardRef<
  HTMLElement,
  { children: ReactNode } & RippleAvatarProps
>(({ children, active, iscurrentuser, status, ...rest }, ref) => {
  return (
    <StyledBadge
      ref={ref}
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      status={status}
      {...rest}
    >
      <RippleStyledAvatar active={active} iscurrentuser={iscurrentuser}>
        {typeof children === "string" ? _.slice(children, 0, 2) : children}
      </RippleStyledAvatar>
    </StyledBadge>
  );
});
export default RippleAvatar;
