const express = require('express');
const colors = require('colors');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const app = express();
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
const User = require('./models/UserSchema');
app.use("/images", express.static(path.join(__dirname, 'masterImages')));
// const fs = require('fs');


mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DBNAME}`).then(success => {
     console.log(`Connection Established with Database`.bgGreen.black);
}).catch(err => {
     console.log(`${err.message}`.bgRed.black);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
     console.log(`Connection Established with ${PORT}`.bgYellow.black);
});

// Locally Store the images
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, 'masterImages/');
     },
     filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fileExtension = path.extname(file.originalname);
          cb(null, uniqueSuffix + fileExtension);
     }
});
const upload = multer({ storage: storage });














// Register ADMIN API
app.post('/admin-sign-up', upload.single('picture'), async (req, res) => {
     try {
          const { firstname, lastname, email, phone, password } = req.body;
          const preregistedUser = await User.findOne({ email: email });
          if (!!preregistedUser) {
               return res.status(201).send({
                    message: 'User Already Exists',
                    success: false,
                    data: null,
               });
          } else {
               const hashedPassword = await bcrypt.hash(password, 10);
               const newUser = new User({
                    firstname,
                    lastname,
                    email,
                    phone,
                    password: hashedPassword,
                    role: "admin",
                    picture: `images/${req?.file?.filename}`,
               });
               await newUser.save();
               return res.status(200).send({
                    message: 'Admin Registered Successfully😉',
                    data: newUser,
                    success: true
               });
          }
     } catch (error) {
          console.error('Error registering user:', error.message);
          return res.status(500).send({
               error: 'Internal server error',
               error: error.message
          });
     }
});

// Register API
app.post('/sign-up', upload.single('picture'), async (req, res) => {
     try {
          const { firstname, lastname, email, phone, password } = req.body;
          const preregistedUser = await User.findOne({ email: email });
          if (!!preregistedUser) {
               return res.status(201).send({
                    message: 'User already exists',
                    success: false,
                    data: null,
               });
          } else {
               const hashedPassword = await bcrypt.hash(password, 10);
               const newUser = new User({
                    firstname,
                    lastname,
                    email,
                    phone,
                    password: hashedPassword,
                    role: "user",
                    picture: `images/${req?.file?.filename}`,
               });
               await newUser.save();
               return res.status(200).send({
                    message: 'User Registered Successfully😉',
                    data: newUser,
                    success: true
               });
          }
     } catch (error) {
          console.error('Error registering user:', error.message);
          return res.status(500).send({
               error: 'Internal server error',
               error: error.message
          });
     }
});

// Login API
app.post('/sign-in', async (req, res) => {
     try {
          const user = await User.findOne({ email: req.body.email });
          if (!user) {
               return res.status(400).send({
                    message: 'User not found',
                    success: false,
               });
          } else {
               const hashedPassword = await bcrypt.compare(req.body.password, user.password);
               const expireIn = "10h";
               const token = jwt.sign({ user },
                    'token',
                    { expiresIn: expireIn });
               if (!!hashedPassword) {
                    return res.status(200).send({
                         message: "Logged In Successfully",
                         success: true,
                         data: token
                    });
               } else {
                    return res.status(401).send({
                         message: "Passwords do not match",
                         success: false
                    });
               }
          }
     } catch (error) {
          return res.status(400).send({
               message: "Something went wrong",
               error: error.message,
               success: false
          });
     }
});

// Get Profile from token
app.get('/loggeduser', async (req, res) => {
     try {
          const token = req.headers.authorization;
          const data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          const user = await User.findOne({ _id: data.user._id });
          if (!!user) {
               return res.status(200).send({
                    message: "Successfully Got the User",
                    success: true,
                    data: user
               });
          } else {
               return res.status(404).send({
                    message: "User not found",
                    success: false
               });
          }
     } catch (error) {
          res.status(404).send({
               message: "Something went wrong",
               error: error.message,
               success: false
          });
     }
});

// Get all the registered user details
app.get('/getUser', async (req, res) => {
     try {
          const getAllUser = await User.find({ role: "user" });
          if (getAllUser) {
               return res.status(200).send({
                    success: true,
                    message: "Success",
                    data: getAllUser
               });
          } else {
               return res.status(400).send({
                    success: false,
                    message: "Data Not Found",
                    error: error.message
               });
          }
     } catch (error) {
          res.status(404).send({
               success: false,
               message: "Some Error Occured",
               error: error.message
          });
     }
});

// Get the registered user details by Id
app.get('/getUser/:id', async (req, res) => {
     try {
          const { id } = req.params
          const viewUser = await User.findById({ _id: id })
          if (viewUser) {
               return res.status(200).send({
                    success: true,
                    message: "Success",
                    data: viewUser
               });
          } else {
               res.status(400).send({
                    success: false,
                    message: "Error Fetching Data",
               });
          }
     } catch (error) {
          res.status(404).send({
               success: false,
               message: "Something went wrong",
               error: error.messsage
          });
     }
});

// Update user
app.put('/updateUser/:id', upload.single('picture'), async (req, res) => {
     const { id } = req.params;
     const { firstname, lastname, email, phone } = req.body;
     try {
          const updateUserFields = {
               firstname: firstname,
               lastname: lastname,
               email: email,
               phone: phone,
          };
          if (req.file) {
               updateUserFields.picture = `images/${req.file.filename}`;
          }
          const updateUser = await User.findOneAndUpdate(
               { _id: id },
               {
                    $set: updateUserFields,
               },
               { new: true }
          );
          if (!!updateUser) {
               return res.status(200).send({
                    message: "Updted Successfully",
                    data: updateUser,
                    success: true
               });
          } else {
               return res.status(404).send({
                    message: "Please Try Again Later",
                    error: error.message
               })
          }
     } catch (error) {
          return res.status(400).send({
               success: false,
               message: "Something went wrong",
               error: error.messsage
          });
     }
});

// Delete User from ID
app.delete('/deleteuser/:id', async (req, res) => {
     try {
          const { id } = req.params
          const deleteEmp = await User.findByIdAndDelete({ _id: id })
          if (!!deleteEmp) {
               return res.status(200).send({
                    success: true,
                    message: "User Deleted Successfully",
               })
          } else {
               return res.status(404).send({
                    success: false,
                    message: "Error Deleting Employee"
               })
          }
     } catch (error) {
          console.log(error)
          res.status(404).send({
               success: false,
               message: "Something went wrong",
               error: error.message
          })
     }
});

// Compose Email
app.post('/send-email', async (req, res) => {
     try {
          const { to, subject, body, from } = req.body;

          const transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 465,
               secure: true,
               service: 'gmail',
               auth: {
                    user: process.env.EMAIL_URL,
                    pass: process.env.EMAIL_PASSWORD,
               }
          });

          // Email data
          const mailOptions = {
               from: from,
               to: to,
               subject: subject,
               text: body,
          };

          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                    console.error(error.message);
                    return res.status(500).send({
                         success: false,
                         message: 'Error sending email',
                         error: error.message,
                    });
               } else {
                    // console.log('Email sent: ' + info.response);
                    return res.status(200).send({
                         success: true,
                         message: 'Email sent successfully',
                         technicalMessage: 'Email sent: ' + info.response
                    });
               }
          });
     } catch (error) {
          console.error('Error composing and sending email:', error.message);
          return res.status(500).send({
               success: false,
               message: 'Internal server error',
               error: error.message,
          });
     }
});

// Change Password
app.put('/change-password/:id', async (req, res) => {
     const { id } = req.params;
     try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const result = await User.findOneAndUpdate(
               { _id: id },
               { $set: { password: hashedPassword, } },
               { new: true }
          )
          if (!!result) {
               return res.status(200).send({
                    success: true,
                    message: "Update Password Successfully",
               });
          } else {
               return
          }
     } catch (error) {
          res.status(404).send({
               success: false,
               message: "Something went wrong",
               error
          })
     }
})

// Forget Password. Sending link to gmail through Nodemailer
app.post('/forget-password', async (req, res) => {
     try {
          const email = req.body.email;
          const user = await User.findOne({ email: email });

          if (!user) {
               return res.status(404).json({ message: 'User not found' });
          }

          const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false });
          const otpExpiry = new Date();
          otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

          user.otp = otp;
          user.otpExpiry = otpExpiry;
          await user.save();

          var transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 465,
               secure: true,
               service: 'gmail',
               auth: {
                    user: process.env.EMAIL_URL,
                    pass: process.env.EMAIL_PASSWORD,
               }
          });

          var mailOptions = {
               from: process.env.EMAIL_URL,
               to: email,
               subject: 'Forgot Password OTP',
               text: `Your OTP is: ${otp}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                    console.log(error.message);
                    res.status(500).json({ message: 'Failed to send OTP' });

               } else {
                    // console.log('Email sent: ' + info.response);
                    return res.status(200).send({
                         message: 'OTP sent successfully',
                         data: 'Email sent: ' + info.response,
                         status: "Success",
                         success: true
                    });
               }
          });
     } catch (error) {
          return res.status(400).send({
               success: false,
               message: "Something went wrong",
               error: error.messsage
          });
     }
});

// Verify OTP
app.post('/verify-otp', async (req, res) => {
     const { email, otp } = req.body;

     const user = await User.findOne({ email });

     if (!user) {
          return res.status(404).json({ message: 'User not found' });
     }

     if (user.otp !== otp || user.otpExpiry < new Date()) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
     }

     user.otp = undefined;
     user.otpExpiry = undefined;
     await user.save();

     const expireIn = "1d";
     const token = jwt.sign({ user },
          'token',
          { expiresIn: expireIn });

     var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          service: 'gmail',
          auth: {
               user: process.env.EMAIL_URL,
               pass: process.env.EMAIL_PASSWORD,
          }
     });

     var mailOptions = {
          from: process.env.EMAIL_URL,
          to: email,
          subject: 'OTP Verified Successfully.',
     };

     transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
               console.log(error.message);
               res.status(500).json({ message: 'OTP Not Verified' });

          } else {
               return res.status(200).send({
                    message: 'OTP Verified Successfully',
                    data: { token, id: user._id },
                    status: "Success",
                    success: true,
               });
          }
     });
});

// Reset password
app.post('/reset-password/:id/:token', async (req, res) => {
     const { id, token } = req.params;
     const { password } = req.body;
     try {
          const tokens = jwt.verify(token, 'token');
          if (tokens) {
               const hashedPassword = await bcrypt.hash(password, 10);
               const updatePassword = await User.findByIdAndUpdate({ _id: id },
                    { $set: { password: hashedPassword } },
                    { new: true })
               if (updatePassword) {
                    return res.status(200).send({ message: "Password Reset Successfully", success: true, data: updatePassword })
               } else {
                    return res.status(404).send({
                         message: "Password not updated",
                         success: false
                    })
               }
          }
     } catch (error) {
          return res.status(400).send({
               success: false,
               message: "Something went wrong",
               error: error.messsage
          });
     }
});
