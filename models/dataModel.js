const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    id:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    pictures:[
        {type: String,}
    ],
    signature:{
        type: String,
    },
    screen_num:{
        type: Number,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    column_num:{
        type: Number,
        required: true
    },
    camera_area:{
        type: String,
        required: true
    },
    }
);

const UsersSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    psw:{
        type: String,
        required: true
    },
    employees:[
        {type: employeeSchema,}
    ]
    }
);


const dataSchema = new Schema({
    company_id:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    camera_list:[
        {type: String,
        required: true}
    ],
    total_screens:{
        type: Number,
        required: true
    },
    users:[
        {type: UsersSchema,}
    ]
    }
);

module.exports = mongoose.model("DataModel", dataSchema);
