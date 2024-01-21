import { Box, Container } from "@mui/material";
import { FC, PropsWithChildren } from "react";

const SignupBox: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Container>
  );
};
export default SignupBox;
