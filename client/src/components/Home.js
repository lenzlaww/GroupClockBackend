import React from "react";
import { useEffect, useContext } from "react";
import { GlobalStoreContext } from "../store";
import Button from "@mui/material/Button";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CreateCompany from "./CreateCompany";
import { useHistory } from "react-router-dom";



const Home = () => {
  const { store } = useContext(GlobalStoreContext);
  const history = useHistory();

  useEffect(() => {
    store.loadCompaniesPairs();
    // console.log(store.companiesPairs);
  }, []);

  const handleClick = () => {
    console.log("Company list");
    window.location.href = "/New";
  };

  const handleClick2 = () => {
    console.log("User list");
    window.location.href = "/NewUser";
  }

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company ID</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {store.companiesPairs.map((company, index) => (
              <TableRow key={index}>
                <TableCell>{company.company_id}</TableCell>
                <TableCell>{company.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="outlined" onClick={handleClick}>
        Create new company
      </Button>
      <Button variant="outlined" onClick={handleClick2}>
        Create new user
      </Button>
    </div>
  );
}

export default Home;


