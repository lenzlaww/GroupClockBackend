const express = require("express");
const AuthController = require('../controllers/authController')
const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/register', AuthController.registerUser);
router.post('/admin', AuthController.admin);


router.post('/password-reset', AuthController.resetPassword);
router.post("/valification-email", AuthController.registerVerificationEmail);



module.exports = router;