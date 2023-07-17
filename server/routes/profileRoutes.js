const router = require('express').Router();
const {
    updateName,
    updatePassword,
} = require('../controllers/profileController');

router.patch('/name', updateName);
router.patch('/password', updatePassword);

module.exports = router;
