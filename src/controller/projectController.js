const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database/connection");
// const user = db.model("user");
// const profile = db.model( "profile");

const { user, profile } = db.models;
const config = require("../config/config.json");

var admin = require("firebase-admin");

var serviceAccount = require("../../credential/serviceAccountKey.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// Register with Google
exports.registerWithGoogle = async (req, res) => {
  try {
    const { googleToken, password, role } = req.body;

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(googleToken);
    const { email, name } = decodedToken;

    // Check if the user already exists
    let existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create a new user
    const userentity = {
      username : name,
      email : email,
      password,
      role
    }
    const newUser = await user.create(userentity);
    
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ status: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Login with Google
exports.loginWithGoogle = async (req, res) => {
  try {
    const { googleToken } = req.body;

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(googleToken);
    const { email } = decodedToken;

    let user = await user.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register first.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ status: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.signOut = (req, res) => {
  try {
    res.clearCookie('token');

    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
      });
    }

    res.status(200).json({ status: true, message: 'Signed out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    let existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const rol = !role ? "user" : role;

    const newUser = await user.create({
      username,
      email,
      password: hashedPassword,
      rol,
    });

    res
      .status(201)
      .json({
        status: true,
        message: "User registered successfully",
        data: newUser,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const user = await user.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ status: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Get User Profile Details
exports.getprofileById = async (req, res) => {
  try{
    const profiledetails = await profile.findOne({where:{user_id : req.user.id}});
    // Sending back a response with the user details and the token
    if(!profiledetails){
      throw  new Error("Profile not found!  Forbidden");
    }
    res.status(200).send({status: true, data : profiledetails});

  }catch(err){
    console.log(err)
    res.json({ message: err.message });
  }
};

// Edit User Profile
exports.editProfile = async (req, res) => {
  try {
    const { name, bio, phone, photo, visibility } = req.body;

    let userProfile = await profile.findOne({ where: { user_id: req.user.id } });

    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (bio) updatedFields.bio = bio;
    if (phone) updatedFields.phone = phone;
    if (photo) updatedFields.photo = photo;
    if (visibility) updatedFields.visibility = visibility;

    await profile.update(updatedFields, { where: { user_id: req.user.id } });

    userProfile = await profile.findOne({ where: { user_id: req.user.id } });

    res.status(200).json({ status: true, message: 'Profile updated successfully', data: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


exports.uploadProfilePhoto = async (req, res) => {
  try {
    const { photo } = req.body;

    let userProfile = await profile.findOne({ where: { user_id: req.user.id } });

    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const [affectedRowsCount, updatedProfiles] = await profile.update(
      { photo },
      { where: { user_id: req.user.id }, returning: true }
    );

    if (affectedRowsCount === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const updatedProfile = updatedProfiles[0];

    res.status(200).json({ status: true, message: 'Profile photo updated successfully', data: updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Set Profile Visibility

exports.setProfileVisibility = async (req, res) => {
  try {
    const { visibility } = req.body;

    const [affectedRowsCount, updatedProfiles] = await profile.update(
      { visibility },
      { where: { user_id: req.user.id }, returning: true }
    );

    if (affectedRowsCount === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const updatedProfile = updatedProfiles[0];

    res.status(200).json({ status: true, message: 'Profile visibility updated successfully', data: updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Get User Profiles (Admin)
exports.getAdminProfiles = async (req, res) => {
  try {
    const userProfiles = await profile.findAll();

    res.status(200).json({ status: true, data: userProfiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Get Public User Profiles (Normal User)
exports.getPublicProfiles = async (req, res) => {
  try {
    // Retrieve public user profiles from the database
    const publicProfiles = await profile.findAll({ where: { visibility: 'public' } });

    res.status(200).json({ status: true, data: publicProfiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// exports.signupwithGoogle = async (req, res) => {
//     const user = {
//         email : req.body.email,
//         password : req.body.password
//     }
//     const userR = await admin.auth().createUser({
//         email : user.email ,
//         password : user.password ,
//         emailVerified: false,
//         disabled: false
//     }) ;

//     res.json(userR);
// }

