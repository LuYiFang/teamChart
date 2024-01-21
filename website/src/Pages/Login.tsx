import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SignupBox from "../Components/Boxes/SignupBox";
import { Link as LinkRoute } from "react-router-dom";
import { signup } from "../Utility/routePath";
import { FormEvent } from "react";
import { FetchApi } from "../Utility/fetchApi";
import { api } from "../apiConifg";
import { useAuth } from "../hook/useAuth";
import { Alert } from "../Utility/alert";

const Login = () => {
  const { login } = useAuth();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("username") as string;
    const password = data.get("password") as string;

    handleLogin(username, password);
  };

  const handleLogin = async (username: string, password: string) => {
    const res = await FetchApi.post(api.login, {
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
    <>
      <SignupBox>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <VpnKeyIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="username"
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
          <FormControlLabel
            control={
              <Checkbox name="remember" value="remember" color="primary" />
            }
            label="Remember me"
          />
          <Button type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
        <Grid container>
          <Grid item>
            <Link to={signup} component={LinkRoute} variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </SignupBox>
    </>
  );
};
export default Login;
