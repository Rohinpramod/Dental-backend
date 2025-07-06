// routes/menuiItemsRouter.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

import  upload  from '../middlewares/multer.js';
import { createStudentsSectionCard, deleteSectionCard, getAllSectionCard, updateSectionCard } from '../controllers/studentSectionCardController.js';
const router = express.Router();

router.post('/create-section', authMiddleware, upload.single('image'), createStudentsSectionCard);
router.get('/get-all-section', getAllSectionCard);
router.put('/updateSection/:ItemId', authMiddleware, upload.single('image'), updateSectionCard);
router.delete('/deleteSection/:ItemId', authMiddleware,deleteSectionCard);

export default router;
