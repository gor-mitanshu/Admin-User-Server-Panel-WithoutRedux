const User = require('../../server/models/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

function generateOTP () {
     let digits = '0123456789';
     let OTP = '';
     for (let i = 0; i < 4; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
     }
     return OTP;
}
// User Registration
exports.signup = async (req, res) => {
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
          const newAdmin = new User({
               firstname,
               lastname,
               email,
               // countrycode,
               phone,
               password: hashedPassword,
               role: "user",
               picture: `images/${req?.file?.filename}`,
               status: "active"
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
};

// User Login
exports.signin = async (req, res) => {
     try {
          const { email, password } = req.body;
          if (!email || !password) {
               return res.status(400).json({ message: 'Please enter both email and password', success: false });
          }

          const user = await User.findOne({ email });

          if (!user) {
               return res.status(404).json({ message: 'User not found', success: false });
          }

          const compareHashedPassword = await bcrypt.compare(password, user.password);

          if (!compareHashedPassword) {
               return res.status(401).json({
                    message: 'Passwords do not match',
                    success: false,
               });
          }

          const expiresIn = '10h';
          const token = jwt.sign({ user }, 'token', { expiresIn });

          return res.status(200).json({
               message: 'Logged In Successfully!!!',
               success: true,
               data: token,
          });
     } catch (error) {
          return res.status(400).json({
               message: 'Internal Server Error',
               error: error.message,
               success: false,
          });
     }
};

exports.getUsers = async (req, res) => {
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
};

// Get Logged User from token
exports.getLoggedUser = async (req, res) => {
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
};

// Get User by Id
exports.getUserById = async (req, res) => {
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
};

//Update User By Id
exports.updateUserById = async (req, res) => {
     console.log(req.body)
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
          const updateUserFields = {
               firstname: firstname,
               lastname: lastname,
               email: email,
               phone: phone,
               status: status
          };

          if (req?.file) {
               updateUserFields.picture = `images/${req?.file?.filename}`;
               if (existingUser.picture) {
                    console.log(existingUser.picture)
                    const imagePath = path.join(__dirname, 'masterImages', existingUser.picture.replace('images/', ''));
                    console.log(imagePath)
                    if (fs.existsSync(imagePath)) {
                         fs.unlinkSync(imagePath);
                    }
               }
          }
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
          console.log(error)
          return res.status(400).send({
               success: false,
               message: "Internal Server Error",
               error: error.messsage
          });
     }
};

// Delete User By Id
exports.deleteUserById = async () => {
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
};

// Change User's Password by Id
exports.changePassword = async (req, res) => {
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
};

// Forget User Password and send OTP for verification
exports.forgetPassword = async (req, res) => {
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
};

// OTP Verification
exports.verifyOTP = async (req, res) => {
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
};

// Reset User Password
exports.resetPassword = async (req, res) => {
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
};

exports.addActiveField = async (req, res) => {
     try {
          const result = await User.updateMany({}, { $set: { status: "active" } });
          console.log('User records updated successfully.');
          return res.status(200).send('User records updated successfully.');
     } catch (err) {
          console.error('Error updating user records:', err);
          return res.status(500).send('Error updating user records');
     }
};

module.exports = exports;
