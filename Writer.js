//Require file system to write into files
var fs = require("fs");

//file is the name of the file we write in
var Writer = function(file){
	this.file = file;
}

//Append data at the end of the file
Writer.prototype.append = function(data){
	fs.appendFile(this.file,data,function(err){
		if(err) throw err;
	});
}

//Write data at the end of the file
Writer.prototype.write = function(data){
	fs.writeFile(this.file,data,"utf8",function(err){
		if(err) throw err;
	});
}

//Return text data in BaseProspect or vCard format
//contacts : list of objects contact
Writer.prototype.contactsToData = function(contacts){}

//Save a list of contact to a file vCard or BaseProspect
Writer.prototype.save = function(contacts){
	var data = this.contactsToData(contacts);
	this.write(data);
}

module.exports = Writer;