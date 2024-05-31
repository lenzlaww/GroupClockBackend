import React from "react";
import { useEffect, useContext } from "react";
import { GlobalStoreContext } from "../store";
import axios from "axios";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

const CreateUser = () => {
  const { store } = useContext(GlobalStoreContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
    company_id: data.get("company_id"),
    email: data.get("email")
    });

    if(data.get("password") !== data.get("passwordV")){
      alert("Passwords do not match");
    }else{
        try{
            let psw = data.get("email").split("@")[0] + data.get("company_id");
            console.log(psw);

            // const OTP = Math.floor(Math.random() * 9000 + 1000);
            // store.OTP = OTP;
            // store.setOTP(OTP);
            // console.log(store.OTP);
            // localStorage.setItem("OTP", OTP);

            // let message = store.createUser(
            //     data.get("company_id"),
            //     data.get("email"),
            //     psw,
            //     psw
            // );

            axios
              .post("https://groupclockbackend-2.onrender.com/auth/register", {
                company_id: data.get("company_id"),
                email: data.get("email"),
                psw: psw,
                pswV: psw,
              })
              .then((response) => {
                console.log(response);
                if (response.status === 200) {
                  axios
                    .post(
                      "https://groupclockbackend-2.onrender.com/auth/valification-email",
                      {
                        email: data.get("email"),
                        company_id: data.get("company_id"),
                      }
                    )
                    .then((response) => {
                      console.log(response);
                      if (response.status === 200) {
                        alert("Success! ", response.data.message);
                        //   window.location.href = "/OTP";
                      } else {
                        alert("Fail! ", response.data.message);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      alert("Fail! ", error);
                    });
                } else {
                  alert("Fail! ", response.data.message);
                }
              })
              .catch((error) => {
                console.log(error);
                alert("Fail! ", error);
              });

            
            
        }catch(e){
            alert("Fail! ", e);
        }
    }

  };

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
            New User
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
              id="company_id"
              label="Company ID"
              name="company_id"
              autoComplete="company_id"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              autoComplete="email"
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
    </ThemeProvider>
  );
};

export default CreateUser;
