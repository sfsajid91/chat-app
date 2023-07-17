const router = require('express').Router();
const {
    getAllConversations,
    getAllMessages,
    sendMessage,
    searchUser,
    seenMessage,
} = require('../controllers/chatController');
const { sendMessageValidator } = require('../validators/messageValidator');

router.get('/', getAllConversations);
// search user by name by query string
router.get('/search', searchUser);
router.patch('/seen/:messageId', seenMessage);
router.get('/:conversationId', getAllMessages);
router.post('/', sendMessageValidator, sendMessage);

module.exports = router;
