const express = require("express");

const {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getCompaniesPairs,
} = require("../controllers/controller.js");

const router = express.Router();

router.post('/Company', createCompany);
router.get('/Company', getCompany);
router.put('/Company', updateCompany);
router.delete('/Company', deleteCompany);
router.get('/Companies', getCompaniesPairs);
router.post('/User', createUser);
router.get('/User', getUsers);
router.put('/User', updateUser);
router.delete('/User', deleteUser);
router.post('/Employee', createEmployee);
router.get('/Employee', getEmployee);
router.put('/Employee', updateEmployee);
router.delete('/Employee', deleteEmployee);
router.get('/Employees', getEmployees);

module.exports = router;