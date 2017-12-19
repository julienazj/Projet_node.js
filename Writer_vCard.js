var Writer = require("./Writer.js");
var Contact = require("./Contact.js");

var Writer_vCard = function(file){
	this.file=file;
}
//Inherit of Writer
Writer_vCard.prototype = new Writer(this.file);


//Return text data in vCard format
//contacts : list of objects contact
Writer_vCard.prototype.contactsToData = function(contacts){
	contacts = Contact.sortByDomain(contacts);
	var data = "";
	contacts.forEach(function(contact){
		data+="BEGIN:VCARD\nVERSION:4.0\n"
		data+=this.contactToData(contact);
		data+="END:VCARD\n";
	},this);
	return data.substr(0,data.length-1);
}

//Return text data in vCard format
//contacts : object that we transform into text data
Writer_vCard.prototype.contactToData = function(contact){
	var data="";
	if(contact.nom!=undefined && contact.prenom!=undefined){
		data+="FN:"+contact.prenom+" "+contact.nom+"\n";
		data+="N:"+contact.nom+";"+contact.prenom+"\n";
	}
	if(contact.domaine!=undefined){
		data+="ORG:"+contact.domaine;
		if(contact.entreprise!=undefined){
			data+=";"+contact.entreprise+"\n";
		} else {
			data+="\n";
		}
	}
	if(contact.fonction!=undefined){
		data+="TITLE:"+contact.fonction+"\n";
	}
	if(contact.email!=undefined){
		data+="EMAIL;INTERNET:"+contact.email+"\n";
	}
	if(contact.telephone!=undefined && contact.telephone[0]!=undefined){
		data+='TEL;TYPE=WORK:'+contact.telephone[0]+"\n";
	}
	if(contact.telephone!=undefined && contact.telephone[1]!=undefined){
		data+='TEL;TYPE="work,cell,voice":'+contact.telephone[1]+"\n";
	}
	if(contact.remarque!=undefined){
		data+="NOTE:"+contact.remarque+"\n";
	}
	return data;
}

module.exports = Writer_vCard;