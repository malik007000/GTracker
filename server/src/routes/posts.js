const express = require('express');
const multer = require('multer');
const { verifyToken } = require('../middleware/auth');
const postController = require('../controllers/postController');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// All routes require authentication
router.use(verifyToken);

router.get('/', postController.getAllPosts);
router.post('/', upload.single('image'), postController.createPost);
router.get('/:postId', postController.getPost);
router.put('/:postId', postController.updatePost);
router.delete('/:postId', postController.deletePost);
router.post('/:postId/like', postController.likePost);
router.post('/:postId/comment', postController.addComment);

module.exports = router;
