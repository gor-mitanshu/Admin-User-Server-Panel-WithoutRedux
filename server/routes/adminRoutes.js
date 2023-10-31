const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminControllers');
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

// Register Admin
adminRouter.post('/signup', upload.single('picture'), adminController.signup);

// Admin Login 
adminRouter.post('/signin', adminController.signin);

// Get Admin Profile from token
adminRouter.get('/loggedadmin', adminController.getLoggedAdmin);

// Get Admin Profile by Id
adminRouter.get('/getAdmin/:id', adminController.getAdminById);

// Update Admin by Id 
adminRouter.put('/updateAdmin/:id', upload.single('picture'), adminController.updateAdminById);

// Compose Email
adminRouter.post('/sendemail', adminController.sendEmail);

// Change Admin Password
adminRouter.put('/changepassword/:id', adminController.changePassword);

// Forget Password. Sending link to Gmail through Nodemailer
adminRouter.post('/forgetpassword', adminController.forgetPassword);

// Verify OTP
adminRouter.post('/verifyotp', adminController.verifyOTP);

// Reset password
adminRouter.post('/resetpassword/:id/:token', adminController.resetPassword);

// Get All Admins
adminRouter.get('/getAdmins', adminController.getAdmins);

module.exports = adminRouter;
