const DataModel = require('../models/dataModel');
const bcrypt = require('bcrypt');

loginUser = async(req, res) => {
    const { email, psw, company_id } = req.body;
    if (!email || !psw || !company_id) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }
    const existingCompany = await DataModel.findOne({ company_id: company_id });
    console.log("existingCompany: " + existingCompany);
    if (!existingCompany) {
      return res.status(401).json({
        errorMessage: "Wrong company ID"
      });
    }
    const existingUser = existingCompany.users.find(user => user.email === email);
    console.log("existingUser: " + existingUser);
    if (!existingUser) {
      return res.status(401).json({
        errorMessage: "Wrong email or password provided"
      });
    }

    console.log("provided password: " + psw);
    const passwordCorrect = await bcrypt.compare(psw, existingUser.psw);
    if (!passwordCorrect) {
      console.log("Incorrect password");
      return res.status(401).json({
        errorMessage: "Wrong email or password provided.",
      });
    }

    // var data = {company: existingCompany, user: existingUser};
    var data = {
        company_id: existingCompany.company_id,
        name: existingCompany.name,
        location: existingCompany.location,
        camera_list: existingCompany.camera_list,
        total_screens: existingCompany.total_screens,
        email: existingUser.email
    }


    res.status(200).json({ success: true, data: data });  

}

registerUser = async(req, res) => {
    try{
        const {company_id, email, psw, pswV} = req.body;
        if (!email || !psw || !pswV || !company_id) {
            return res
              .status(400)
              .json({ errorMessage: "Please enter all required fields." });
        }
        const company = await DataModel.findOne({company_id: company_id});
        if (!company) {
            res.status(404).json({ success: false, message: "Company not found" });
        }
        console.log("company: " + company);
        const existingUser = company.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(psw, salt);
        const newUser = {email: email, psw: passwordHash};
        console.log("newUser: " + newUser);
        company.users.push(newUser);
        await company.save();
        res.status(201).json({success: true, data: company});



    }catch(error){
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    loginUser, 
    registerUser};
    