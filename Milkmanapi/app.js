const express=require("express");
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const morgan=require("morgan");

const customerRouter=require("./routes/customer");


var db='mongodb://localhost/milkman';

mongoose.connect(db,{ useNewUrlParser : true });
//bodyparser
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());

app.use("/customer",customerRouter)
var port=8080;
app.listen(port,function()
{
	console.log(`app listening port `+port);
});