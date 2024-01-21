import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SignupBox from "../Components/Boxes/SignupBox";

const SignUp = () => {
  return (
    <SignupBox>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <VpnKeyIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>

      <Box component="form" sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="User Name"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
        />
        <Button type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
          Sign Up
        </Button>
      </Box>
    </SignupBox>
  );
};
export default SignUp;
