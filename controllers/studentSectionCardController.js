import cloudinaryInstance from "../config/cloudinary.js";
import StudentSectionCard from "../models/StudentsSectionCard.js";

//create-studentSectionCard
export const createStudentsSectionCard = async (req, res) => {
  try {
    const { name, image} = req.body;
    
    let imageUrl = "https://example.com/default-image.jpg"; 

   
    if (req.file) {
      const uploadResponse = await cloudinaryInstance.uploader.upload(req.file.path);
      imageUrl = uploadResponse.url; 
    }

  
    const studentSectionCardExist = await StudentSectionCard.findOne({name});

    if (studentSectionCardExist) {
      return res.status(400).json({ message: "studentSectionCard already exists" });
    }

    const Item = new StudentSectionCard({
      name,
      image: imageUrl,
    });

    await Item.save();

    res.status(201).json(Item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get-studentSectionCard
export const getAllSectionCard = async (req, res)=>{
  try{
    const studentSectionCard = await StudentSectionCard.find();
    res.status(200).json(studentSectionCard);
  }catch(error){
    res.status(500).json({message:'Failed to fetch studentSectionCard', error});
  }
};

//update-studentSectionCard
export const updateSectionCard = async (req, res) => {
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

    const studentSectionCard = await 
    StudentSectionCard.findOneAndUpdate(
      { _id: ItemId},
      updateFields,
      { new: true, runValidators: true }
    );

    if (!studentSectionCard) {
      return res
        .status(404)
        .json({ message: " studentSectionCard not found" });
    }

    res.json(Item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//delete studentSectionCard
export const deleteSectionCard = async (req, res) => {
  try {
    const { ItemId } = req.params;

    if (!ItemId) {
      return res.status(400).json({ message: "studentSectionCard item ID is required" });
    }
    
    const deletedstudentSectionCard = await StudentSectionCard.findByIdAndDelete(ItemId);
    if (!deletedstudentSectionCard) {
      return res.status(404).json({ message: "studentSectionCard  not found" });
    }

    res.status(200).json({ message: " studentSectionCard deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};