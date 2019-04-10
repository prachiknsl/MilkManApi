const express=require("express");
const date=require('node-datetime');
const router=express.Router();
const Customer=require("../models/customer");
var nodemailer = require('nodemailer');
const db='mongodb://localhost/milkman';
const ISODate = require("isodate");

router.get("/findOne/:customerid",(req,res,next)=>
{
	const id=req.params.customerid;
	Customer.findById(id).exec().then(doc =>
		{
			console.log(doc)
			res.status(200).json(doc)
		})
	.catch(err => {
		console.log(err)
		res.status(400).json({
			Error : err
		})})
})

router.get("/",(req,res,next)=>
{
	Customer.find().exec().then(doc =>
		{
			console.log(doc)
			res.status(200).json(doc)
		})
	.catch(err => {
		console.log(err)
		res.status(400).json({
			Error : err
		})})
})

router.patch("/addquantity/:customerid",(req,res,next)=>{
 	const id= req.params.customerid;
 	const transporter = nodemailer.createTransport({
  	service: 'gmail',
  	auth:
  	{
    	user: 'milkmanapi@gmail.com',
    	pass: 'milkman@123'
  	}
	}); 
    const query = Customer.findOne({_id:id}, function (err, customer) {
  		if (err) return handleError(err);
 		console.log('Name : %s Email : %s', customer.name, customer.email);
		const mailOptions={
		from:'milkmanapi@gmail.com',
		to:  customer.email,
		subject:'Milk Delivery',
		text: 'Dear '+customer.name +',\nDelivered : '+ req.body.quantity +' litre milk at your doorstep.\n \n \nHAVE A NICE DAY!!!'
		}

		transporter.sendMail(mailOptions, function(error, info){
  		if (error) {
    		console.log(error);
  			} 
  		else {
    		console.log('Email sent: ' + info.response);
  			}
		});
	});

	const milkQuantity1={date: new Date('2019-03-08T21:46:11.629Z'), quantity:req.body.quantity}
		Customer.update({_id:id},{$push : {milkQuantity:milkQuantity1}}).exec().then(doc =>
		{
			console.log(doc)
			res.status(200).json(doc)
		})
		.catch(err => {
		console.log(err)
		res.status(400).json({
			Error : err
			})
		})
})

router.get("/aggregate",(req,res,next)=> {
	const fromDate=req.body.fromDate;
	const toDate=req.body.toDate;
	Customer.aggregate([
		{ $unwind:"$milkQuantity"},
	 	{ $match:{"milkQuantity.date" : {$gte: new Date(fromDate), $lte: new Date(toDate)}}},
   		{ $group: {
 			_id: '$name',
        	totalQuantity : { $sum: "$milkQuantity.quantity" }}
        }]).exec().then(doc =>
		{
			console.log(doc)
			res.status(200).json(doc)
		})
		.catch(err => {
		console.log(err)
		res.status(400).json({
			Error : err
			})
		})

});


router.delete("/delete/:customerid",(req,res)=>{
	const id=req.params.customerid;
	Customer.remove({_id:id}).exec().then(doc =>
		{
			console.log(doc)
			res.status(200).json(doc)
		})
		.catch(err => {
		console.log(err)
		res.status(400).json({
			Error : err
		})})
})


module.exports=router;