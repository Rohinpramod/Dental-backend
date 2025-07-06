import mongoose from "mongoose";
import ProductItem from "../models/ProductModel.js";
import cloudinaryInstance from "../config/cloudinary.js";

//create items
export const createItem = async (req, res) => {
  try {
    const { name, price, isAvailable, description, image, quantity,category,brand,section } = req.body;
    
    let imageUrl = "https://example.com/default-image.jpg"; 

   
    if (req.file) {
      const uploadResponse = await cloudinaryInstance.uploader.upload(req.file.path);
      imageUrl = uploadResponse.url; 
    }

  
    const ItemExist = await ProductItem.findOne({name});

    if (ItemExist) {
      return res.status(400).json({ message: "Menu item already exists" });
    }

    const Item = new ProductItem({
      name,
      price,
      isAvailable,
      description,
      image: imageUrl,
      quantity,
      category,
      brand,
      section
    });


    await Item.save();
    
    res.status(201).json(Item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get-all-menu
export const getAllItems = async (req, res)=>{
  try{
    const Item = await ProductItem.find();
    res.status(200).json(Item);
  }catch(error){
    res.status(500).json({message:'Failed to fetch menu items', error});
  }
};

//byName-items
export const getItemsByName = async (req, res) => {
  try {
    const name = req.params.name;
    const Items = await ProductItem.find({
      name: { $regex: name, $options: "i" }, 
    });

    if (ProductItem.length === 0) {
      return res.status(404).json({ message: "No menu items found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//menuItem by ID
export const getItemById = async (req, res) => {
  const {id} = req.params;

  try{
    const Item = await ProductItem.findById(id);

    if(!Item){
      return res.status(404).json({message: 'Menu item not found'});
    }
    res.status(200).json(Item);
  }catch(error){
    res.status(500).json({message:'server error'});
  }
};


//get-all-menu-by-brand
export const getProductItemByBrand = async (req, res) => {
  try {
    const ProductItem = await ProductItem.find({
      Brand: req.params.BrandId,
    }).populate("Item");
    res.json(ProductItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//by-category
export const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Category parameter is required" });
    }

    const items = await ProductItem.find({ category });

    if (items.length === 0) {
      return res.status(404).json({ message: "No items found for this category" });
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//by-section
export const getItemsBySection = async (req, res) => {
  try {
    const { section } = req.params;

    if (!section) {
      return res.status(400).json({ message: "Section parameter is required" });
    }

    const items = await ProductItem.find({ section });

    if (items.length === 0) {
      return res.status(404).json({ message: "No items found for this section" });
    }

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateItem = async (req, res) => {
  try {
    const { ItemId} = req.params;
    const { name, price, category,quantity, isAvailable ,description } = req.body;

    let updateFields = { name, price,quantity, category, isAvailable, description};

    if (req.file) {
      const uploadResponse = await cloudinaryInstance.uploader.upload(
        req.file.path
      );
      updateFields.imageUrl = uploadResponse.url;
    }

    const Item = await 
    ProductItem.findOneAndUpdate(
      { _id: ItemId},
      updateFields,
      { new: true, runValidators: true }
    );

    if (!Item) {
      return res
        .status(404)
        .json({ message: "Menu item not found ." });
    }

    res.json(Item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteItem = async (req, res) => {
  try {
    const { ItemId } = req.params;

    if (!ItemId) {
      return res.status(400).json({ message: "Item item ID is required" });
    }
    
    const deletedItem = await ProductItem.findByIdAndDelete(ItemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item item not found" });
    }

    res.status(200).json({ message: " Item deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
