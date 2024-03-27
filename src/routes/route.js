const express = require('express');
const router = express.Router();


const controller = require('../controller/projectController');
const {authenticateToken, authorizeRoles} = require("../middleware/auth");

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post("/register/google", controller.registerWithGoogle)
router.post("/login/google", controller.loginWithGoogle)
router.post("/signout", controller.signOut)


router.get('/profile/id',authenticateToken,authorizeRoles(["user"]), controller.getprofileById)
router.post("/edit/profile", authenticateToken, authorizeRoles(["user"]), controller.editProfile)
router.post("/upload/profile/photo", authenticateToken, authorizeRoles(["user"]), controller.uploadProfilePhoto)
router.post("/set/profile-visibility", authenticateToken, authorizeRoles(["user"]), controller.setProfileVisibility)
router.get("/admin/profile", authenticateToken, authorizeRoles(["admin"])  ,controller.getAdminProfiles)
router.get("/public/profile", authenticateToken, controller.getPublicProfiles)

module.exports = router;