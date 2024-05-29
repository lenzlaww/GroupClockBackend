import React from "react";
import { useEffect, useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import axios from "axios";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

const PasswordRecovery = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordV, setShowPasswordV] = useState(false);
    const [token, setToken] = useState("");
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let token = urlParams.get("token").replace(/SPECIAL_ESCAPE_CHAR/g, "/");
        setToken(token);
        console.log(token);
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
          password: data.get("password"),
          passwordV: data.get("passwordV"),
        });

        if(data.get("password") !== data.get("passwordV")){
            alert("Passwords do not match");
        }else{

            axios.post("http://localhost:4000/auth/password-reset", {
                token: token,
                password: data.get("password"),
            }).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    alert("Success! ", response.data.message);
                } else {
                    alert("Error: ", response.data.message);
                }
            }).catch((error) => {
                alert("Error: ", error);
            })
        }
    }

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
      console.log(event.data)
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPasswordV = () => setShowPasswordV((show) => !show);


    return (
      <div>
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
              Reset Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                fullWidth
                margin="normal"
                type={showPassword ? "text" : "password"}
                label="Password"
                id="password"
                name="password"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                type={showPasswordV ? "text" : "password"}
                label="Confirm Password"
                id="passwordV"
                name="passwordV"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordV}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPasswordV ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Container>
      </div>
    );
}

export default PasswordRecovery;