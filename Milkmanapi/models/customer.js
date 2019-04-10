const mongoose=require("mongoose");
mongoose.set('useFindAndModify', false);
const date=require('node-datetime');
const customerSchema= new mongoose.Schema(
{
	name: String,
	email: String,
	milkQuantity: [{date: Date, quantity: Number }]
});
module.exports=mongoose.model("Customer",customerSchema);
