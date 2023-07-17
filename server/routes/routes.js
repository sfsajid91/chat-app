const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/authMiddleware');
const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const profileRoutes = require('./profileRoutes');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World!',
    });
});

router.use('/auth', authRoutes);
router.use('/chat', isLoggedIn, chatRoutes);
router.use('/profile', isLoggedIn, profileRoutes);

module.exports = router;
