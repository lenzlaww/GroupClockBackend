import axios from "axios";
axios.defaults.withCredentials = true;
const api = axios.create({
//   baseURL: "https://groupclockbackend-1.onrender.com/api",
    baseURL: "http://localhost:4000/api",
});

const apiAuth = axios.create({
    baseURL: "http://localhost:4000/auth",
});


export const createCompany =
  (company_id, name, location, camera_list, total_screens) => {
    return api.post("/company", {
      company_id: company_id,
      name: name,
      location: location,
      camera_list: camera_list,
      total_screens: total_screens,
      users: [],
    });
}

export const createUser = (company_id, email, password) => {
    return api.post("/user", {
      company_id: company_id,
      email: email,
      psw: password,
    });
}

export const register = (company_id, email, password, passwordVerify) => {
    return apiAuth.post("/register", {
      company_id: company_id,
      email: email,
      psw: password,
      pswV: passwordVerify,
    });
}

export const getCompanies =() => api.get("/companies");

export const sendValificationEmail = (email, otp) => {

  if (!email || !otp) {
    return { status: 400, message: "You have to provide email" };
  }

  console.log("email: " + email);
  console.log("otp: " + otp);

  return apiAuth.post("/valification-email", {
    email: email,
    OTP: otp,
  });
    
};

export const resetPassword = (company_id, email, password) => {
    return apiAuth.post("/password-reset", {
      company_id: company_id,
      email: email,
      password: password,
    });
}


const apis = {
  getCompanies,
  createCompany,
  createUser,
  register,
  resetPassword,
  sendValificationEmail,
};

export default apis;