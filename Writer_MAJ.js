var Writer = require('./Writer.js');

var Writer_MAJ = function(){
	this.date= new Date();
	this.month=this.date.getMonth()+1;
	this.day = this.date.getDate()+"/"+this.month+"/"+this.date.getFullYear();
	this.time = this.date.getHours()+":"+this.date.getMinutes()+":"+this.date.getSeconds();
}
//Inherit of Writer
Writer_MAJ.prototype = new Writer("MAJ.txt");

//Writing adding of a contact inside MAJ.txt
Writer_MAJ.prototype.add = function(name,firstname){
	this.append(this.day+" "+this.time+" -> Ajout du contact : "+firstname+" "+name+"\n");
}

//Writing deletion of a contact inside MAJ.txt
Writer_MAJ.prototype.delete = function(name,firstname){
	this.append(this.day+" "+this.time+" -> Suppression du contact : "+firstname+" "+name+"\n");
}

//Writing modification of a contact inside MAJ.txt
Writer_MAJ.prototype.modify = function(name,firstname){
	this.append(this.day+" "+this.time+" -> Modification du contact : "+firstname+" "+name+"\n");
}

module.exports = Writer_MAJ;