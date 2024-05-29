import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GlobalStoreContextProvider } from "./store";

import { Login, Home, CreateCompany, CreateUser, PasswordRecovery, OTPinput } from "./components";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <GlobalStoreContextProvider>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/Home/" component={Home} />
            <Route exact path="/New/" component={CreateCompany} />
            <Route exact path="/NewUser/" component={CreateUser} />
            <Route exact path="/PasswordRecovery/" component={PasswordRecovery} />
            <Route exact path="/OTP/" component={OTPinput} />
          </Switch>
        </GlobalStoreContextProvider>
      </BrowserRouter>
    </>
  );
}
export default App;
