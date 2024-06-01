import React from "react";
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

const CreateCompany = () => {
    const { store } = useContext(GlobalStoreContext);

    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      if (isNaN(parseInt(data.get("total_screens")))) {
        alert("Total screens must be a number");
      }else{
        console.log({
          company_id: data.get("company_id"),
          name: data.get("name"),
          location: data.get("location"),
          total_screens: parseInt(data.get("total_screens")),
          camera_list: data.get("camera_list").split(","),
        });

        store.createCompany(
          data.get("company_id"),
          data.get("name"),
          data.get("location"),
          data.get("camera_list").split(",").map(item => item.trim()),
          parseInt(data.get("total_screens"))
        );
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
              New Company
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
                name="name"
                label="Name"
                type="name"
                id="name"
                autoComplete="current-name"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="location"
                label="Location"
                type="location"
                id="location"
                autoComplete="location"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="total_screens"
                label="Number of screens"
                type="total_screens"
                id="total_screens"
                autoComplete="total_screens"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="camera_list"
                label="List of cameras, separated by commas(example: Door1, Door2)"
                type="camera_list"
                id="camera_list"
                autoComplete="camera_list"
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
}

export default CreateCompany;
