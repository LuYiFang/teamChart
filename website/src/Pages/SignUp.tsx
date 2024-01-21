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
import { FormEvent, useState } from "react";
import { useAuth } from "../hook/useAuth";
import { api } from "../apiConifg";
import { FetchApi } from "../Utility/fetchApi";
import { Alert } from "../Utility/alert";

const SignUp = () => {
  const { login } = useAuth();
  const [formError, setFormError] = useState({
    username: "",
    password: "",
  });

  const isValidForm = (username: string, password: string) => {
    const newFormError = {
      username: "",
      password: "",
    };

    username = username.trim();
    password = password.trim();

    if (username === "") {
      newFormError.username = "Username is required";
    } else if (username.length < 3 || username.length >= 16) {
      newFormError.username = "Username must be between 3 and 16 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newFormError.username = "Username can only contain letters and numbers";
    }

    if (password === "") {
      newFormError.password = "Password is required";
    } else if (password.length < 6 || password.length >= 16) {
      newFormError.password = "Password must be between 6 and 16 characters";
    }
    console.log("newFormError", newFormError);

    setFormError(newFormError);

    return newFormError.username === "" && newFormError.password === "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("username") as string;
    const password = data.get("password") as string;

    if (!isValidForm(username, password)) {
      return;
    }

    handleSignup(username, password);
  };

  const handleSignup = async (username: string, password: string) => {
    const res = await FetchApi.post(api.signup, {
      username: username,
      password: password,
    });

    if (res?.token) {
      login(res?.token);
      return;
    }

    Alert.error(res.message);
  };

  return (
    <SignupBox>
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <VpnKeyIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="username"
          label="User Name"
          autoFocus
          error={formError.username !== ""}
          helperText={formError.username}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          error={formError.password !== ""}
          helperText={formError.password}
        />
        <Button type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
          Sign Up
        </Button>
      </Box>
    </SignupBox>
  );
};
export default SignUp;
