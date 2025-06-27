// routes/menuiItemsRouter.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

import  upload  from '../middlewares/multer.js';
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../controllers/categoryContoller.js';

const router = express.Router();

router.post('/create-category', authMiddleware, upload.single('image'), createCategory);
router.get('/get-all-category', getAllCategory);
router.put('/updateCategory/:ItemId', authMiddleware, upload.single('image'), updateCategory);
router.delete('/deleteCategory/:ItemId', authMiddleware, deleteCategory);

export default router;
