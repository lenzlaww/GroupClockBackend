import { createContext, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "./store-request-api";



export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

export const GlobalStoreActionType = {
  CREATECOMPANY: "CREATECOMPANY",
  GETCOMPANIESPAIRS: "GETCOMPANIESPAIRS",
  CLOSEMODAL: "CLOSEMODAL",
  SETOTP: "SETOTP",
};

const CurrentModal = {
  NONE: "NONE",
  CREATECOMPANY: "CREATECOMPANY",
  ERROR: "ERROR",
};


function GlobalStoreContextProvider(props) {
    const history = useHistory();
    const [store, setStore] = useState({
        companiesPairs:[],
        cunrrentCompany:{},
        currentCompanyId: 0,
        isModalOpen: false,
        OTP:0,


    });

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
          case GlobalStoreActionType.GETCOMPANIESPAIRS: {
            return setStore({
              ...store,
              companiesPairs: payload,
            });
          }

          case GlobalStoreActionType.SETOTP: {
            return setStore({
              ...store,
              OTP: payload,
            });
          }
        }
    }

    store.loginDone = function(){
        console.log('call Logged in');
        history.push("/home");
    }

    store.setOTP = function (otp) {
      console.log("call setOPT");
      storeReducer({
        type: GlobalStoreActionType.SETOTP,
        payload: otp,
      });
    };

    store.loadCompaniesPairs = async function(){
        console.log('call loadCompaniesPairs');
        const response = await api.getCompanies();
        console.log(response);
        if (response.status === 200) {
            let pairs = response.data.data; 
            console.log(pairs);
            storeReducer({
              type: GlobalStoreActionType.GETCOMPANIESPAIRS,
              payload: pairs,
            });
        }else{
            console.log(response.message);
        }
    }

    store.createCompany = async function(company_id, name, location, camera_list, total_screens){
        console.log('call createCompany');
        const response = await api.createCompany(company_id, name, location, camera_list, total_screens);
        console.log(response);
        if (response.status === 200) {
            store.loadCompaniesPairs();
            history.push("/Home");
        }else{
            console.log(response.message);
        }
    }

    store.createUser = async function(company_id, email, password, passwordV){
        console.log('call createUser');
        try{
            const response = await api.register(
            company_id,
            email,
            password,
            passwordV
            ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    return "User created";
                } else {
                    return "Fail! ", response.data.message;
                }
            });
        }catch(e){
            return "Fail! ", e;

        }
    }

    store.resetPassword = async function(company_id, email, password){
        console.log('call resetPassword');
        try{
            const response = await api.resetPassword(company_id, email, password)
            console.log(response);
            if (response.status === 200) {
                return "Password reset";
            }else{
                return "Fail!", response.data.message;
            }

        }catch(e){
            return "Fail! ", e;
        }
    }

    store.sendValificationEmail = async function(email, OTP){
        console.log('call sendValificationEmail');
        console.log(email, OTP);
        try{
            const response = await api.sendValificationEmail(
              email,
              OTP,
            ).then((response) => {
                console.log(response);
                if (response.status === 200) {
                    return "Email sent";
                }else{
                    return "Fail!", response.data.message;
                }
            });
        }catch(e){
            return "Fail! ", e;
        }
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };