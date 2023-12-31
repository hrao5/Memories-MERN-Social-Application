import express from 'express';

import { getPost, getPosts, getPostsBySearch, createPost, commentPost, updatePost, deletePost, likePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost); // add /likePost to differentiate from updatePost
router.post('/:id/commentPost', auth, commentPost); // add /likePost to differentiate from updatePost

export default router;