const DataModel = require('../models/dataModel');
const { MongoClient } = require("mongodb");

const getCompaniesPairs = async(req, res) =>{
    let pairs = [];
    try{
        const companies = await DataModel.find();
        companies.forEach(company => {
            pairs.push({company_id: company.company_id, name: company.name});
        });
        res.status(200).json({success: true, data: pairs});
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createCompany = async (req, res) => {
    const {company_id, name, location, camera_list, total_screens, users} = req.body;
    
    try {
        const newData = await DataModel.create({
          company_id,
          name,
          location,
          camera_list,
          total_screens,
          users,
        });
        res.status(200).json({success: true, data: newData});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getCompany = async (req, res) => {

    try{
        const { company_id } = req.body;
        const company = await DataModel.find({ company_id: company_id });

        if (company.length <= 0){
            res.status(404).json({ message: "Company not found" });
        }
        return res.status(200).json({success: true, data: company});
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateCompany = async (req, res) => {
  const body = req.body;

  try {
    const updatedCompany = await DataModel.findOneAndUpdate(
      { company_id: body.company_id }, // Filter
      body, // Update
      { new: true } // Options
    );

    if (!updatedCompany) {
      return res
        .status(404)
        .json({ success: false, message: "No matching document found" });
    }

    return res.status(200).json({ success: true, data: updatedCompany });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


const deleteCompany = async(req, res) => {
    const { company_id } = req.body;
    try {
        const company = await DataModel.deleteOne({
          company_id: company_id,
        });
        res.status(200).json({success: true, data: company});
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createUser = async(req, res) => {
    const {company_id, email, psw} = req.body;

    try {
        const company = await DataModel.findOne({company_id: company_id});
        if (!company) {
            res.status(404).json({ success: false, message: "Company not found" });
        }
        console.log(company);
        const user = {email: email, psw: psw, employee: []};
        if(!user){
            res.status(404).json({ success: false, message: "User not found" });
        }
        console.log(user);
        company.users.push(user);
        await company.save();
        res.status(200).json({success: true, data: company});
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const getUsers = async(req, res) => {
    const {company_id} = req.body;
    const company = await DataModel.findOne({company_id: company_id});
    if (!company) {
        res.status(404).json({ success: false, message: "Company not found" });
    }
    const users = company.users;
    res.status(200).json({success: true, data: users});
}

const updateUser = async(req, res) => {
    const {company_id, email, psw} = req.body;
 
    try {
        const company = await DataModel.findOne({company_id: company_id});  
        if (!company) {
            res.status(404).json({ success: false, message: "Company not found" });
        }
        const user = company.users.find(user => user.email === email);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        const index = company.users.indexOf(user);
        company.users[index].email = email;
        company.users[index].psw = psw; 
        await company.save();
        res.status(200).json({success: true, data: company});
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const deleteUser = async(req, res) => {
    const {company_id, email} = req.body;
    try {
        const company = await DataModel.findOne({company_id: company_id});
        if (!company) {
            res.status(404).json({ success: false, message: "Company not found" });
        }
        const user = company.users.find(user => user.email === email);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        const index = company.users.indexOf(user);
        company.users.splice(index, 1);
        await company.save();
        res.status(200).json({success: true, data: company});
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const createEmployee = async(req, res) => {
    console.log("createEmployee");
    const dataSize = JSON.stringify(req.body).length;
    console.log("Size of received data: " + dataSize + " bytes");
    const {
      company_id,
      email,
      name,
      id,
      location,
      pictures,
      signature,
      screen_num,
      color,
      column_num,
      camera_area,
    } = req.body;
    const body = {name, id, location, pictures, signature, screen_num, color, column_num, camera_area};
    try {
        const company = await DataModel.findOne({company_id: company_id});
        if (!company) {
            res.status(404).json({ success: false, message: "Company not found" });
        }
        const user = company.users.find(user => user.email === email);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        user.employees.push(body);
        await company.save();
        console.log("Employee created successfully");
        res.status(200).json({success: true, data: company});
    }
    catch (error) {
        console.log("Employee created faliure");
        console.log(error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}


const getEmployee = async(req, res) => {
    const {company_id, email, id} = req.body;
    const company = await DataModel.findOne({company_id: company_id});
    if (!company) {
        res.status(404).json({ success: false, message: "Company not found" });
    }
    const user = company.users.find(user => user.email === email);
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
    }
    const employee = user.employees.find(employee => employee.id === id);
    res.status(200).json({success: true, data: employee});
}

// const getEmployees = async(req, res) => {
//     console.log("getEmployees")
//     const {company_id, email} = req.body;
//     if (!company_id || !email) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Please enter all required fields" });
//     }
//     try{
//         const company = await DataModel.findOne({company_id: company_id});
//         if (!company) {
//             return res
//               .status(404)
//               .json({ success: false, message: "Company not found" });
//         }
//         const user = company.users.find(user => user.email === email);
//         if (!user) {
//             return res
//               .status(404)
//               .json({ success: false, message: "User not found" });
//         }
//         const employees = user.employees;
//         return res.status(200).json({ success: true, data: employees });
//     }
//     catch (error) {
//         return res.status(400).json({ success: false, message: error.message });
//     }
// }

const getEmployees = async (req, res) => {
  console.log("getEmployees");

  // Assuming you're passing company_id and email as query parameters
  const { company_id, email } = req.query;

  if (!company_id || !email) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please provide both company_id and email",
      });
  }

  try {
    // // Connect to MongoDB
    // const client = await MongoClient.connect(url, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    // console.log("Connected successfully to MongoDB");

    // const db = client.db(dbName);
    // const collection = db.collection(collectionName);

    // Find company by company_id
    const company = await DataModel.findOne({ company_id: company_id });

    if (!company) {
    //   client.close();
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Find user by email within the company
    const user = company.users.find((user) => user.email === email);

    if (!user) {
    //   client.close();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch employees data for the user
    const employees = user.employees;
    // client.close();

    return res.status(200).json({ success: true, data: employees });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


const updateEmployee = async(req, res) => {
    const {
      company_id,
      email,
      name,
      id,
      location,
      pictures,
      signature,
      screen_num,
      color,
      column_num,
      camera_area,
    } = req.body;
    const body = {
      name,
      id,
      location,
      pictures,
      signature,
      screen_num,
      color,
      column_num,
      camera_area,
    };
    try {
        const company = await DataModel.findOne({company_id: company_id});
        if (!company) {
            res.status(404).json({ success: false, message: "Company not found" });
        }
        const user = company.users.find(user => user.email === email);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        let employee = user.employees.find(employee => employee.id === id);
        if (!employee) {
            res.status(404).json({ success: false, message: "Employee not found" });
        }
        const index = user.employees.indexOf(employee);
        user.employees[index] = body;
        await company.save();
        res.status(200).json({success: true, data: company});
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const deleteEmployee = async(req, res) => {
    const {company_id, email, id} = req.body;
    try {
        const company = await DataModel.findOne({company_id: company_id});
        if (!company) {
            res.status(404).json({ success: false, message: "Company not found" });
        }
        const user = company.users.find(user => user.email === email);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        let employee = user.employees.find(employee => employee.id === id);
        if (!employee) {
            res.status(404).json({ success: false, message: "Employee not found" });
        }
        const index = user.employees.indexOf(employee);
        user.employees.splice(index, 1);
        await company.save();
        res.status(200).json({success: true, data: company});
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


module.exports = {
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
  getCompaniesPairs
};