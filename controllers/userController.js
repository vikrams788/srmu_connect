// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { upload } = require('../middleware/multerMiddleware');

exports.renderSignupForm = (req, res) => {
  res.render('signup');
};

exports.renderLoginForm = (req, res) => {
  res.render('login');
};

exports.renderHome = async (req, res) => {
  res.render('home');
};

exports.renderEditProfile = async (req, res) => {
  res.render('editProfile');
};

exports.renderProfile = async (req, res) => {
  try {
    // Get the user's ID from the session or wherever you store it
    const userId = req.user._id; // Adjust this based on how you store user IDs

    // Fetch the user's profile data from the database
    const userProfile = await Profile.findOne({ user: userId });

    if (!userProfile) {
      return res.status(404).send('User profile not found');
    }

    res.render('profile', { userProfile }); // Pass the profile data to the template
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

exports.renderCreatePost = async (req, res) => {
  res.render('createPost');
};

exports.signupUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { errorMessage: 'User already exists' });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.render('signup', { errorMessage: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    res.render('signup', { errorMessage: 'An error occurred', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { errorMessage: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render('login', { errorMessage: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, { expiresIn: '5d' });

    res.cookie('token', token);
    res.redirect('/home'); // Replace with the appropriate dashboard route
  } catch (error) {
    res.render('login', { errorMessage: 'An error occurred', error: error.message });
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProfileData = req.body; // Profile data from the form

    // Check if the user already has a profile
    let userProfile = await Profile.findOne({ user: userId });
    const userProfileFile = req.file;

    if (!userProfile) {
      // Create a new profile document if it doesn't exist
      userProfile = new Profile({
        user: userId,
        ...userProfileData,
        profilePicture: userProfileFile ? userProfileFile.path : undefined // Handle profile picture upload
      });
    } else {
      // Completely replace existing profile data with new data
      userProfile = Object.assign(userProfile, userProfileData);

      // Update profile picture if a new file is uploaded
      if (userProfileFile) {
        upload(req, res, (err) => {
          if(err){
            console.log(err);
          } else{
            userProfile.profilePicture = userProfileFile.path;
          }
        });
      }
    }

    // Save the updated profile
    await userProfile.save();

    // Update the User model's username with the full name
    const user = await User.findById(userId);
    if (user) {
      user.username = userProfileData.fullName || ''; // Set username to full name (handle empty case)
      await user.save();
    }

    res.redirect('/profile'); // Redirect to the user's profile page
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
