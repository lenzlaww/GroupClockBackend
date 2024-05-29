import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { GlobalStoreContext } from "../store";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

const OTPinput = () => {
  const { store } = useContext(GlobalStoreContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const storedOtp = localStorage.getItem("OTP");

    const data = new FormData(event.currentTarget);
    let code = data.get("code");
    console.log(code);
    if (code == storedOtp) {
      localStorage.removeItem("OTP");
      alert("Success");
      // store.OTP = null;
      // store.setOTP(null);
      window.location.href = "/PasswordRecovery";
    } else {
      alert("Invalid Code");
    }
  }



    return (
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Email Verification
            </Typography>
            <Typography component="h1" variant="h5">
              We have send you an email with a verification code. Please enter the code below.
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Code"
                name="code"
                autoComplete="code"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Verify Account
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
}
export default OTPinput;