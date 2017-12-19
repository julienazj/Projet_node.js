var Writer = require("./Writer.js");
var Contact = require("./Contact.js");


var Writer_BP = function(){
}
//Inherit of Writer
Writer_BP.prototype = new Writer("baseprospect.txt");


//Return text data in BaseProspect format
//contacts : list of objects contact
Writer_BP.prototype.contactsToData = function(contacts){
	contacts = Contact.sortByDomain(contacts);
	var data = "";
	var selectedDomain = "";
	contacts.forEach(function(contact){
		if(selectedDomain!=contact.domaine){
			data+="###Domaine:"+contact.domaine+"\n";
			selectedDomain = contact.domaine;
		}
		data+=this.contactToData(contact);
	},this);
	return data.substr(0,data.length-1);
}

//Return text data in BaseProspect format
//contacts : object that we transform into text data
Writer_BP.prototype.contactToData = function(contact){
	var data="";
	if(contact.nom!=undefined){
		data+="Nom:"+contact.nom+"\n";
	}
	if(contact.prenom!=undefined){
		data+="Prénom:"+contact.prenom+"\n";
	}
	if(contact.entreprise!=undefined){
		data+="Entreprise:"+contact.entreprise+"\n";
	}
	if(contact.fonction!=undefined){
		data+="Fonction:"+contact.fonction+"\n";
	}
	if(contact.email!=undefined){
		data+="Email:"+contact.email+"\n";
	}
	if(contact.telephone!=undefined && contact.telephone[0]!=undefined){
		data+="Téléphone1:"+contact.telephone[0]+"\n";
	}
	if(contact.telephone!=undefined && contact.telephone[1]!=undefined){
		data+="Téléphone2:"+contact.telephone[1]+"\n";
	}
	if(contact.remarque!=undefined){
		data+="Remarque:"+contact.remarque+"\n";
	}
	return data;
}

module.exports = Writer_BP;