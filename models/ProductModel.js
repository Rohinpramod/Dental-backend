import mongoose from'mongoose';

const ProductItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, default:"https://cdn-icons-png.flaticon.com/512/2439/2439116.png" },
    quantity: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    category:{type: String, required:true},
    brand:{type: String, required:true},

});

const ProductItem = mongoose.model('ProductItem', ProductItemSchema);
export default   ProductItem