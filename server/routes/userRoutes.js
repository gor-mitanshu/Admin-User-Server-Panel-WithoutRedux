const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userControllers');
const multer = require('multer');
const path = require('path');

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

// Register User
userRouter.post('/signup', upload.single('picture'), userController.signup);

// User Login API
userRouter.post('/signin', userController.signin);

// Get All Users
userRouter.get('/getUsers', userController.getUsers);

// Get User Profile from token
userRouter.get('/loggeduser', userController.getLoggedUser);

// Get User Profile by Id
userRouter.get('/getUser/:id', userController.getUserById);

// Update User by Id
userRouter.put('/updateUser/:id', upload.single('picture'), userController.updateUserById);

// Delete User by Id
userRouter.get('/deleteUser/:id', userController.deleteUserById);

// Change User Password
userRouter.put('/changepassword/:id', userController.changePassword);

// Forget Password. Sending link to Gmail through Nodemailer
userRouter.post('/forgetpassword', userController.forgetPassword);

// Verify OTP
userRouter.post('/verifyotp', userController.verifyOTP);

// Reset password
userRouter.post('/resetpassword/:id/:token', userController.resetPassword);


// Add custom field using query
userRouter.post('/addActivefield', userController.addActiveField);

module.exports = userRouter;
