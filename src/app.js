const express = require("express");
const path = require("path");
const app = express();
require("./db/conn");
const bcrypt = require("bcryptjs");

const Register = require("./models/registers");
const { json } = require("express");
const { log } = require("console");

const hbs = require("hbs");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");



// 57:30 this line is add so that data can be added to the database
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // this is added so that data from login form can be easily accesseble

// console.log(path.join(static_path));

app.use(express.static(static_path)); //to host the index.html file from public folder
app.set("view engine", "hbs"); // to run the file of views----index.js
app.set("views", template_path); //it  means to run the file which is located at template_path insteaad of views

hbs.registerPartials(partials_path);


// console.log(process.env.SECRET_KEY);


app.get("/", (req, res) => {
  res.render("index");
});

//after 40:59
app.get("/register", (req, res) => {
  res.render("register");
});

// // after 53:50
// //registration page code...................
app.post("/register", async (req, res) => {
  try {
    //    console.log(req.body.firstname);
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    //   console.log(password);
    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });

      console.log("the success part" + registerEmployee);

      const token = await registerEmployee.generateAuthToken();
      console.log("the token part " + token);

      const registered = await registerEmployee.save();
      console.log("the page part"+ registered);
      
      res.status(201).render("index");
    } else {
      res.send("paassword is not matching");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

// // L-73... to render login form
app.get("/login", (req, res) => {
  res.render("login");
});

// login check...........................

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

                                        //database: userdefined mail
    const useremail = await Register.findOne({ email: email });

    // l-76......
    const isMatch = await bcrypt.compare(password,useremail.password);
  
    const token = await useremail.generateAuthToken();
    console.log("the token part " + token);

   

    if(isMatch){
    // if (useremail.password === password) {
      res.status(201).render("index");
    } else {
      res.send("invalid credentials");
    }
  } catch (e) {
    res.status(400).send("invalid email");
  }
});

// //....................... le-74 ........................

const securePassword = async (password) => {
const passwordHash = await bcrypt.hash(password, 10);
  // console.log(passwordHash);
const passwordmatch = await bcrypt.compare(password, passwordHash);
  // console.log(passwordmatch);
};

// securePassword("thapa@123");

// l-77 ...................................

const jwt = require("jsonwebtoken");

const createToken = async () => {
  const token = await jwt.sign(
    { _id: "24jhb25k235jbkb35235jb23" },
    "mynameishsivamvermafromunnao",
    {
      expiresIn: "2 seconds",
    }
  );
  //  console.log(token);

  const userVer = await jwt.verify(token, "mynameishsivamvermafromunnao");
  //  console.log(userVer);
};

createToken();

app.listen(port, () => {
  console.log(`server is runnig at port ${port}`);
});
