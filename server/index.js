const express = require('express');
const colors = require('colors');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const otpGenerator = require('otp-generator');
const path = require('path');
const fs = require('fs');

const app = express();
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const User = require('./models/UserSchema');
const Admin = require('./models/AdminSchema');

app.use("/images", express.static(path.join(__dirname, 'masterImages')));

mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DBNAME}`).then(success => {
     console.log(`Connection Established with Database`.bgGreen.black);
}).catch(err => {
     console.log(`${err.message}`.bgRed.black);
});

function generateOTP () {

     // Declare a digits variable  
     // which stores all digits 
     let digits = '0123456789';
     let OTP = '';
     for (let i = 0; i < 4; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
     }
     return OTP;
}

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

/* ADMIN API's */
app.post('/admin-signup', upload.single('picture'), async (req, res) => {
     try {
          const { firstname, lastname, email, phone, password } = req.body;
          if (!firstname) {
               return res.status(500).send({ message: "Please Enter the Firstname", success: false });
          }
          if (!lastname) {
               return res.status(500).send({ message: "Please Enter the Lastname", success: false });
          }
          if (!email) {
               return res.status(500).send({ message: "Please Enter the Email", success: false });
          }
          if (!phone) {
               return res.status(500).send({ message: "Please Enter the Phone", success: false });
          }
          if (!password) {
               return res.status(500).send({ message: "Please Enter the Password", success: false });
          }
          if (!firstname || !lastname || !email || !phone) {
               return res.status(500).send({ message: "Please Enter all the fields", success: false });
          }
          const preregistedAdmin = await Admin.findOne({ email: email });
          if (!!preregistedAdmin) {
               return res.status(409).send({
                    message: 'Admin Already Exists',
                    success: false,
                    data: null,
               });
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newAdmin = new Admin({
               firstname,
               lastname,
               email,
               phone,
               password: hashedPassword,
               role: "admin",
               picture: `images/${req?.file?.filename}`,
          });
          await newAdmin.save();
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

          const mailOptions = {
               from: process.env.EMAIL_URL,
               to: email,
               subject: 'Registration Successful',
               text: 'Thank you for Registering!',
          };

          transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                    console.error('Error sending email:', error);
               } else {
                    console.log('Email sent:', info.response);
               }
          });

          return res.status(200).send({
               message: 'Admin Registered Successfully!!!',
               data: newAdmin,
               success: true
          });

     } catch (error) {
          console.error('Error registering user:', error.message);
          return res.status(400).send({
               error: 'Internal server error',
               error: error.message
          });
     }
});

//Admin Login API
app.post('/admin-signin', async (req, res) => {
     try {
          const { email } = req.body;
          const admin = await Admin.findOne({ email: email });

          if (!email) {
               return res.status(400).send({ message: "Please Enter the Email", success: false });
          }

          if (!admin) {
               return res.status(404).send({ message: "Admin not found", success: false });
          }

          const compareHashedPassword = await bcrypt.compare(req.body.password, admin.password);

          if (!compareHashedPassword) {
               return res.status(401).send({ message: "Password does not match", success: false });
          }

          const expireIn = "10h";
          const token = jwt.sign({ admin }, 'token', { expiresIn: expireIn });

          return res.status(200).send({
               message: "Logged In Successfully!!!",
               success: true,
               data: token
          });
     } catch (error) {
          return res.status(500).send({
               message: "Internal Server Error",
               error: error.message,
               success: false
          });
     }
});

// Get Admin Profile from token
app.get('/loggedadmin', async (req, res) => {
     try {
          const token = req.headers.authorization;
          if (!token) {
               return res.status(500).send({
                    message: "Token not found",
                    success: false
               });
          }
          const data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          const admin = await Admin.findOne({ _id: data.admin._id });
          if (!admin) {
               return res.status(404).send({
                    message: "Admin not found",
                    success: false
               });
          }
          return res.status(200).send({
               message: "Successfully Got the User",
               success: true,
               data: admin
          });
     } catch (error) {
          res.status(400).send({
               message: "Internal server error",
               error: error.message,
               success: false
          });
     }
});

// Get Admin Profile by Id
app.get('/getAdmin/:id', async (req, res) => {
     try {
          const { id } = req.params;
          if (!id) {
               return res.status(500).send({
                    success: false,
                    message: "Id not found",
               });
          }
          const viewAdmin = await Admin.findById({ _id: id });
          if (!viewAdmin) {
               return res.status(500).send({
                    success: false,
                    message: "Admin not found",
               });
          }
          return res.status(200).send({
               success: true,
               message: "Success",
               data: viewAdmin
          });
     } catch (error) {
          res.status(400).send({
               message: "Internal server error",
               error: error.message,
               success: false
          });
     }
});

// Update Admin by id
app.put('/updateAdmin/:id', upload.single('picture'), async (req, res) => {
     const { id } = req.params;
     if (!id) {
          return res.status(500).send({
               success: false,
               message: "Id not found",
          });
     }
     const { firstname, lastname, email, phone } = req.body;
     if (!firstname) {
          return res.status(500).send({ message: "Please Enter the Firstname", success: false });
     }
     if (!lastname) {
          return res.status(500).send({ message: "Please Enter the Lastname", success: false });
     }
     if (!email) {
          return res.status(500).send({ message: "Please Enter the Email", success: false });
     }
     if (!phone) {
          return res.status(500).send({ message: "Please Enter the Phone", success: false });
     }
     if (!firstname || !lastname || !email || !phone) {
          return res.status(500).send({ message: "Please Enter all the fields", success: false });
     }
     try {
          const existingUser = await Admin.findById(id);

          const updateAdminFields = {
               firstname: firstname,
               lastname: lastname,
               email: email,
               phone: phone,
          };
          if (req?.file) {
               updateAdminFields.picture = `images/${req?.file?.filename}`;
               if (existingUser.picture) {
                    const imagePath = path.join(__dirname, 'masterImages', existingUser.picture.replace('images/', ''));
                    if (fs.existsSync(imagePath)) {
                         fs.unlinkSync(imagePath);
                    }
               }
          }

          const updateAdmin = await Admin.findOneAndUpdate(
               { _id: id },
               {
                    $set: updateAdminFields,
               },
               { new: true }
          );
          if (!updateAdmin) {
               return res.status(500).send({
                    message: "Update Unsuccessful. Please try again later",
                    error: error.message,
                    success: true
               })
          }
          return res.status(200).send({
               message: "Updated Successfully!!!",
               data: updateAdmin,
               success: true
          });
     } catch (error) {
          return res.status(400).send({
               success: false,
               message: "Internal Server Error",
               error: error.messsage
          });
     }
});

// Get all the registered user details
app.get('/getUsers', async (req, res) => {
     try {
          const getAllUser = await User.find({ role: "user" });
          if (!getAllUser) {
               return res.status(500).send({
                    success: false,
                    message: "Data Not Found",
                    error: error.message
               });
          }
          return res.status(200).send({
               success: true,
               message: "Success",
               data: getAllUser
          });
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
          if (!id) {
               return res.status(500).send({
                    success: false,
                    message: "Id not found",
               });
          }
          const viewUser = await User.findById({ _id: id })
          if (!viewUser) {
               res.status(500).send({
                    success: false,
                    message: "Data Not Found",
               });
          }
          return res.status(200).send({
               success: true,
               message: "Success",
               data: viewUser
          });
     } catch (error) {
          res.status(404).send({
               success: false,
               message: "Internal server error",
               error: error.messsage
          });
     }
});

// Update user by id
app.put('/updateUser/:id', upload.single('picture'), async (req, res) => {
     const { id } = req.params;
     if (!id) {
          return res.status(500).send({
               success: false,
               message: "Id not found",
          });
     }
     const { firstname, lastname, email, phone, status } = req.body;
     if (!firstname) {
          return res.status(500).send({ message: "Please Enter the Firstname", success: false });
     }
     if (!lastname) {
          return res.status(500).send({ message: "Please Enter the Lastname", success: false });
     }
     if (!email) {
          return res.status(500).send({ message: "Please Enter the Email", success: false });
     }
     if (!phone) {
          return res.status(500).send({ message: "Please Enter the Phone", success: false });
     }
     if (!firstname || !lastname || !email || !phone) {
          return res.status(500).send({ message: "Please Enter all the fields", success: false });
     }
     try {
          const existingUser = await User.findById(id);
          let picture = existingUser.picture || '';
          if (req.file) {
               picture = `images/${req.file.filename}`;
               if (existingUser.picture) {
                    const imagePath = path.join(__dirname, 'masterImages', existingUser.picture.replace('images/', ''));
                    if (fs.existsSync(imagePath)) {
                         fs.unlinkSync(imagePath);
                    }
               }
          }

          const updateUserFields = {
               firstname: firstname,
               lastname: lastname,
               email: email,
               phone: phone,
               status: status,
               picture: picture,
          };

          const updateUser = await User.findOneAndUpdate(
               { _id: id },
               {
                    $set: updateUserFields,
               },
               { new: true }
          );
          if (!updateUser) {
               return res.status(500).send({
                    message: "Update Unsuccessful",
                    error: error.message,
                    success: true
               })
          }
          return res.status(200).send({
               message: "Updted Successfully!!!",
               data: updateUser,
               success: true
          });
     } catch (error) {
          return res.status(400).send({
               success: false,
               message: "Internal Server Error",
               error: error.messsage
          });
     }
});

// Delete User from ID
app.delete('/deleteUser/:id', async (req, res) => {
     try {
          const { id } = req.params
          if (!id) {
               return res.status(500).send({
                    success: false,
                    message: "Id not found",
               });
          }
          const user = await User.findById(id);

          if (!user) {
               return res.status(404).send({
                    success: false,
                    message: "User not found",
               });
          }

          const deleteUser = await User.findByIdAndDelete({ _id: id })
          if (!deleteUser) {
               return res.status(404).send({
                    success: false,
                    message: "Unable to Delete User",
               })
          }
          if (user.picture) {
               const filePath = path.join(__dirname, 'masterImages', user.picture.split('/')[1]);
               fs.unlink(filePath, (err) => {
                    if (err) {
                         console.error('Error deleting file:', err);
                    }
               });
          }
          return res.status(200).send({
               success: true,
               message: "User Deleted Successfully",
          })
     } catch (error) {
          res.status(404).send({
               success: false,
               message: "Internal Server Error",
               error: error.message
          })
     }
});

// Compose Email
app.post('/sendemail', async (req, res) => {
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

// Change Admin Password
app.put('/change-adminpassword/:id', async (req, res) => {
     const { id } = req.params;
     if (!id) {
          return res.status(500).send({
               success: false,
               message: "Id not found",
          });
     }
     try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const result = await Admin.findOneAndUpdate(
               { _id: id },
               { $set: { password: hashedPassword, } },
               { new: true }
          )
          if (!!result) {
               return res.status(200).send({
                    success: true,
                    message: "Update Password Successfully",
                    data: result
               });
          } else {
               return res.status(404).send({
                    success: false,
                    message: "Error Changing Password",
               })
          }
     } catch (error) {
          res.status(404).send({
               success: false,
               message: "Internal Server Error",
               error
          })
     }
})

// Forget Password. Sending link to gmail through Nodemailer
app.post('/admin-forgetpassword', async (req, res) => {
     try {
          const email = req.body.email;
          const admin = await Admin.findOne({ email: email });

          if (!admin) {
               return res.status(404).json({ message: 'Email not found!!!' });
          }

          // const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false });
          const otp = generateOTP();
          const otpExpiry = new Date();
          otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

          admin.otp = otp;
          admin.otpExpiry = otpExpiry;
          await admin.save();

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
app.post('/admin-verifyotp', async (req, res) => {
     const { email, otp } = req.body;

     const admin = await Admin.findOne({ email });

     if (!admin) {
          return res.status(404).send({ message: 'User not found' });
     }

     if (admin.otp !== otp || admin.otpExpiry < new Date()) {
          return res.status(400).send({ message: 'Invalid or expired OTP' });
     }

     admin.otp = undefined;
     admin.otpExpiry = undefined;
     await admin.save();

     const expireIn = "1d";
     const token = jwt.sign({ admin },
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
                    data: { token, id: admin._id },
                    status: "Success",
                    success: true,
               });
          }
     });
});

// Reset password
app.post('/admin-resetpassword/:id/:token', async (req, res) => {
     const { id, token } = req.params;
     const { password } = req.body;
     try {
          const tokens = jwt.verify(token, 'token');
          if (tokens) {
               const hashedPassword = await bcrypt.hash(password, 10);
               const updatePassword = await Admin.findByIdAndUpdate({ _id: id },
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


/*  User Panel */
// Register User
app.post('/signup', upload.single('picture'), async (req, res) => {
     try {
          const { firstname, lastname, email, phone, password } = req.body;
          if (!firstname) {
               return res.status(500).send({ message: "Please Enter the Firstname", success: false });
          }
          if (!lastname) {
               return res.status(500).send({ message: "Please Enter the Lastname", success: false });
          }
          if (!email) {
               return res.status(500).send({ message: "Please Enter the Email", success: false });
          }
          if (!phone) {
               return res.status(500).send({ message: "Please Enter the Phone", success: false });
          }
          if (!password) {
               return res.status(500).send({ message: "Please Enter the Password", success: false });
          }
          if (!req.body) {
               return res.status(500).send({ message: "Please Enter all the fields", success: false });
          }
          const preregistedUser = await User.findOne({ email: email });
          if (!!preregistedUser) {
               return res.status(409).send({
                    message: 'User Already Exists',
                    success: false,
                    data: null,
               });
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const verificationToken = crypto.randomBytes(20).toString('hex');
          let picture = '';
          if (req.file) {
               picture = `images/${req.file.filename}`;
          }
          const newAdmin = new User({
               firstname,
               lastname,
               email,
               phone,
               password: hashedPassword,
               role: "user",
               picture: picture,
               status: "active",
               isVerified: false,
               verificationToken: verificationToken,
          });
          await newAdmin.save();

          const verificationLink = `${yourVerificationLinkBaseUrl}/${verificationToken}`

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

          const mailOptions = {
               from: process.env.EMAIL_URL,
               to: email,
               subject: 'Registration Successful.',
               text: `Thank you for Registering! Please verify your email by clicking on the following link: ${verificationLink}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                    console.error('Error sending email:', error);
               } else {
                    console.log('Email sent:', info.response);
               }
          });

          return res.status(200).send({
               message: 'Registered Successfully!!!',
               data: newAdmin,
               success: true
          });

     } catch (error) {
          console.error('Error registering user:', error.message);
          return res.status(400).send({
               error: 'Internal server error',
               error: error.message
          });
     }
});

// User Verification API
app.get('/verify/:verificationToken', async (req, res) => {
     const verificationToken = req.params.verificationToken;

     try {
          const user = await User.findOne({ verificationToken: verificationToken });

          if (!user) {
               return res.status(404).send({ message: 'Invalid verification token', success: false });
          }

          if (user.verified) {
               return res.status(200).send({ message: 'Email already verified', success: true });
          }

          // Mark the user as verified
          user.verified = true;
          user.verificationToken = undefined;
          await user.save();

          return res.status(200).send({ message: 'Email verification successful', success: true });
     } catch (error) {
          return res.status(500).send({ message: 'Internal server error', success: false });
     }
});

//User Login API
app.post('/signin', async (req, res) => {
     try {
          const { email, password } = req.body;
          const user = await User.findOne({ email: email });
          if (!email) {
               return res.status(400).send({ message: "Please Enter the Email", success: false });
          }
          if (!password) {
               return res.status(400).send({ message: "Please Enter the Password", success: false });
          }
          if (!user) {
               return res.status(404).send({
                    message: 'User not found',
                    success: false,
               });
          }
          if (!user.verified) {
               return res.status(401).send({
                    message: "Email not verified. Please verify your email to log in.",
                    success: false,
               });
          }

          const compareHashedPassword = await bcrypt.compare(password, user.password);
          if (!compareHashedPassword) {
               return res.status(401).send({
                    message: "Passwords do not match",
                    success: false
               });
          }
          const expireIn = "10h";
          const token = jwt.sign({ user },
               'token',
               { expiresIn: expireIn });
          return res.status(200).send({
               message: "Logged In Successfully!!!",
               success: true,
               data: token
          })
     } catch (error) {
          return res.status(400).send({
               message: "Internal Server Error",
               error: error.message,
               success: false
          });
     }
});

// Get User Profile from token
app.get('/loggeduser', async (req, res) => {
     try {
          const token = req.headers.authorization;
          if (!token) {
               return res.status(500).send({
                    message: "Token not found",
                    success: false
               });
          }
          const data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          const user = await User.findOne({ _id: data.user._id });
          if (!user) {
               return res.status(404).send({
                    message: "Admin not found",
                    success: false
               });
          }
          return res.status(200).send({
               message: "Successfully Got the User",
               success: true,
               data: user
          });
     } catch (error) {
          res.status(400).send({
               message: "Internal server error",
               error: error.message,
               success: false
          });
     }
});

// Get User Profile by Id
app.get('/loggeduser/:id', async (req, res) => {
     try {
          const { id } = req.params;
          if (!id) {
               return res.status(500).send({
                    success: false,
                    message: "Id not found",
               });
          }
          const viewUser = await User.findById({ _id: id });
          if (!viewUser) {
               return res.status(500).send({
                    success: false,
                    message: "Admin not found",
               });
          }
          return res.status(200).send({
               success: true,
               message: "Success",
               data: viewUser
          });
     } catch (error) {
          res.status(400).send({
               message: "Internal server error",
               error: error.message,
               success: false
          });
     }
});

// Change User Password
app.put('/changepassword/:id', async (req, res) => {
     const { id } = req.params;
     if (!id) {
          return res.status(500).send({
               success: false,
               message: "Id not found",
          });
     }
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
                    data: result
               });
          } else {
               return res.status(404).send({
                    success: false,
                    message: "Error Changing Password",
               })
          }
     } catch (error) {
          res.status(404).send({
               success: false,
               message: "Internal Server Error",
               error
          })
     }
});

// Forget Password. Sending link to gmail through Nodemailer
app.post('/forgetpassword', async (req, res) => {
     try {
          const email = req.body.email;
          const user = await User.findOne({ email: email });

          if (!user) {
               return res.status(404).send({ message: 'Admin not found' });
          }

          // const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false });
          const otp = generateOTP();
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
app.post('/verifyotp', async (req, res) => {
     const { email, otp } = req.body;

     const user = await User.findOne({ email });

     if (!user) {
          return res.status(404).send({ message: 'User not found' });
     }

     if (user.otp !== otp || user.otpExpiry < new Date()) {
          return res.status(400).send({ message: 'Invalid or expired OTP' });
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
app.post('/resetpassword/:id/:token', async (req, res) => {
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

// Add custom field using querry
app.post('/addActivefield', async (req, res) => {
     try {
          const result = await User.updateMany({}, { $set: { status: "active" } });
          console.log('User records updated successfully.');
          return res.status(200).send('User records updated successfully.');
     } catch (err) {
          console.error('Error updating user records:', err);
          return res.status(500).send('Error updating user records');
     }
});