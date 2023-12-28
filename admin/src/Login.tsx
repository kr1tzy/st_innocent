import { useState } from "react";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import { useLogin, useNotify } from "react-admin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const notify = useNotify();
  const submit = (e: any) => {
    e.preventDefault();
    login({ username, password }).catch((err) => {
      try {
        notify(err.body.detail, { type: "error" });
      } catch (error) {
        notify(`${error}`, { type: "error" });
      }
    });
  };
  return (
    <Container
      maxWidth={false}
      sx={{
        position: "absolute",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        background: `linear-gradient(to bottom left, #2a446a 21%, #e98520 100%)`,
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img style={{ width: "80%", marginBottom: "0" }} src={`logo.svg`} />
          <Typography component="h1" variant="h5">
            St. Innocent's Admin
          </Typography>
          <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}
