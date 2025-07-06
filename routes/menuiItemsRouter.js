// routes/menuiItemsRouter.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import {
  createItem,
  getItemsByName,
  getItemById,
  getAllItems,
  updateItem,
  deleteItem,
  getProductsByBrand,
  getProductsByCategory,
  getProductsByStudentsSection
} from '../controllers/productController.js';
import  upload  from '../middlewares/multer.js';

const router = express.Router();

router.post('/create-item', authMiddleware, upload.single('image'), createItem);
router.get('/menu/:name', getItemsByName);
router.get('/menu-item/:id', getItemById);
router.get('/get-all-menu', getAllItems);
router.put('/updateMenu/:ItemId', authMiddleware, upload.single('image'), updateItem);
router.delete('/deleteMenu/:ItemId', authMiddleware, deleteItem);

router.get("/brand/:brand", getProductsByBrand);
router.get("/category/:category", getProductsByCategory);
router.get("/students-section/:section", getProductsByStudentsSection);





export default router;
