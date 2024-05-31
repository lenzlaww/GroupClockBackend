const DataModel = require('../models/dataModel');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "yjffryjnowm#homwubokvy";

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
        res.status(200).json({success: true, data: company});



    }catch(error){
        res.status(400).json({ success: false, message: error.message });
    }
}

resetPassword = async (req, res) => {
  console.log("resetPassword");
  const { password, token } = req.body;

  if (!token || !password) {
    res
      .status(400)
      .json({ error: "password or token are invalid" });
    return;
  }

  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email, company_id } = decoded;
    console.log("email: " + email);
    console.log("company_id: " + company_id);
    const caseInsensitiveEmail = new RegExp("^" + email + "$", "i");

    const company = await DataModel.findOne({company_id: company_id});
    if (!company) {
      res.status(404).json({ success: false, message: "Company not found" });
    }

    const user = company.users.find((user) =>
      user.email.match(caseInsensitiveEmail)
    );

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    user.psw = passwordHash;
    await company.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });


  }catch(error){
    res.status(400).json({ success: false, message: error.message });
  }
}

registerVerificationEmail = async (req, res) => {
  console.log("registerVerificationEmail");

  var transporter = nodemailer.createTransport({
    host: "mail.handpunchguys.com",
    port: 465,
    secure: true, 
    auth: {
      user: "app@handpunchguys.com", 
      pass: "#E4h:V#48W.=rWV", 
    },
  });

  try{
    let email = req.body.email;
    let company_id = req.body.company_id;
    const token = jwt.sign({ email: email, company_id: company_id }, JWT_SECRET, { expiresIn: "1h" });

    console.log("email: " + email);
    console.log("company_id: " + company_id);
   
    let link = `http://localhost:3000/PasswordRecovery?token=${token}`;
    
    let mail_config = await transporter.sendMail({
      from: "app@handpunchguys.com",
      to: email,
      subject: "Registration Verification",
      html: `<!DOCTYPE html>
        <html lang="en" >
        <head>
          <meta charset="UTF-8">
          <title>CodePen - OTP Email Template</title>
  
        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">GroupClock</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing GroupClock. We are pleased to inform you that your manager account has been successfully created. Below are the instructions for logging into your account:</p>
            <b>To log in, your initial password will be your email username followed by your company ID.</b>
            <p>Here is an example:</p>
            <p>Email: abc@gmail.com</p>
            <p>Company ID: 12345678</p>
            <p>Password: abc12345678</p>
            <p>Please log in using these credentials. For the security of your account, we strongly recommend that you change your password as soon as possible.</p>
            <p>To reset your password, please use the following link. Note that this link will expire in one hour:</p>
            <a href="${link}">Reset Password</a>
            <p>If the above link does not work, please copy and paste the following URL into your browser:</p>
            <p>${link}</p>
            <p style="font-size:0.9em;">Regards,<br />GroupClock</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>GroupClock Inc</p>
              <p></p>
              <p></p>
            </div>
          </div>
        </div>
        <!-- partial -->
        </body>
        </html>`,
    });
    console.log(mail_config.messageId);
    res.status(200).json({ success: true, message: "Email sent" });
  }catch(error){
    console.log("error: " + error.message)
    res.status(400).json({ success: false, message: error.message });
  }

}

module.exports = {
  loginUser,
  registerUser,
  resetPassword,
  registerVerificationEmail,
};
    