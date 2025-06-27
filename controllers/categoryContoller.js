import cloudinaryInstance from "../config/cloudinary.js";
import Category from "../models/category.js";

//create-category
export const createCategory = async (req, res) => {
  try {
    const { name, image} = req.body;
    
    let imageUrl = "https://example.com/default-image.jpg"; 

   
    if (req.file) {
      const uploadResponse = await cloudinaryInstance.uploader.upload(req.file.path);
      imageUrl = uploadResponse.url; 
    }

  
    const CategoryExist = await Category.findOne({name});

    if (CategoryExist) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const Item = new Category({
      name,
      image: imageUrl,
    });

    await Item.save();

    res.status(201).json(Item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get-category
export const getAllCategory = async (req, res)=>{
  try{
    const category = await Category.find();
    res.status(200).json(category);
  }catch(error){
    res.status(500).json({message:'Failed to fetch Category', error});
  }
};

//update-category
export const updateCategory = async (req, res) => {
  try {
    const { ItemId} = req.params;
    const { name,} = req.body;

    let updateFields = { name};

    if (req.file) {
      const uploadResponse = await cloudinaryInstance.uploader.upload(
        req.file.path
      );
      updateFields.imageUrl = uploadResponse.url;
    }

    const category = await 
    Category.findOneAndUpdate(
      { _id: ItemId},
      updateFields,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res
        .status(404)
        .json({ message: " Category not found" });
    }

    res.json(Item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//delete category
export const deleteCategory = async (req, res) => {
  try {
    const { ItemId } = req.params;

    if (!ItemId) {
      return res.status(400).json({ message: "Category item ID is required" });
    }
    
    const deletedCategory = await Category.findByIdAndDelete(ItemId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category  not found" });
    }

    res.status(200).json({ message: " Category deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};