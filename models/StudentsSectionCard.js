import mongoose from 'mongoose';

const StudentsSectionCardSchema = new mongoose.Schema({
    name:{type: String,required:true},
    image:{type: String, required:true}
})

const StudentSectionCard = mongoose.model('StudentsSectionCard',StudentsSectionCardSchema);
export default StudentSectionCard