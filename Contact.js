var Writer_MAJ = require("./Writer_MAJ.js");

//Constructor of Contact, domaine, nom, prenom and telephones[0] should not be undefined
var Contact = function(domaine, nom, prenom, entreprise, fonction, email, telephones, remarque){
        this.domaine = domaine;
        this.nom = nom;
        this.prenom = prenom;
        this.entreprise = entreprise;
        this.fonction = fonction;
        this.email = email;
        this.telephone = telephones;
        this.remarque = remarque;
}

//Return the number of defined attribute
Contact.prototype.getNumberAttribute = function() {
        let attributCounter = 0;
        if (this.domaine != undefined){
                attributCounter++;
        }
        if (this.nom != undefined){
                attributCounter++;
        }
        if (this.prenom != undefined){
                attributCounter++;
        }
        if (this.entreprise != undefined){
                attributCounter++;
        }
        if (this.fonction != undefined){
                attributCounter++;
        }
        if (this.email != undefined){
                attributCounter++;
        }
        if (this.telephone!=undefined && this.telephone[0] != undefined){
                attributCounter++;
        }
		if (this.telephone!=undefined && this.telephone[1] != undefined){
                attributCounter++;
        }
        if (this.remarque != undefined){
                attributCounter++;
        }
        return attributCounter;
}

//Compare two contacts. Depends on name and firstname, phone, and email. Return true if same
Contact.prototype.compareContact = function(contact2) {
        if ( (this.nom === contact2.nom && this.prenom === contact2.prenom) || (this.telephone[0] === contact2.telephone[0]) || (this.email!=undefined && contact2.email!=undefined && this.email === contact2.email)){
                return true;
        } else {
                return false;
        }
}

//Return the list sorted by alphabetical order of domains
Contact.sortByDomain = function(listContact){
	listContact.sort(function(c1,c2){
		return c1.domaine.localeCompare(c2.domaine);
	});
	return listContact;
}

//Return the contacts list which are inside the list of domains
Contact.getByDomain = function(list,domainNames){
	var newList = [];
	domainNames=domainNames.split(";");
	list.forEach(function(contact){
		if(domainNames.includes(contact.domaine)){
			newList.push(contact);
		}
	});
	return newList;
}

//Return the contact list who bear this name
Contact.getByName = function(list,name){
	var newList = [];
	list.forEach(function(contact){
		if(name == contact.nom){
			newList.push(contact);
		}
	});
	return newList;
}

//Return the contact list who bear this firstname
Contact.getByFirstname = function(list,firstname){
	var newList = [];
	list.forEach(function(contact){
		if(firstname == contact.prenom){
			newList.push(contact);
		}
	});
	return newList;
}

//Return a combined list without duplicates contacts ( keep contact which is the most complete )
//listToCombineWith is the list on the database
//list is the list with new contacts
//notifyMAJ is a boolean. If true, the modification and adding will be write inside MAJ.txt
Contact.removeDuplicates = function(listToCombineWith,list,notifyMAJ){
	if(notifyMAJ){
		var writer = new Writer_MAJ();
	}
	list.forEach(function(contact){
		var index = listToCombineWith.findIndex((element)=>element.compareContact(contact));
		var contactFound = listToCombineWith[index];
		if(contactFound!=undefined){
			if(contactFound.getNumberAttribute()<contact.getNumberAttribute()){
				listToCombineWith.splice(index,1);
				listToCombineWith.push(contact);
				if(notifyMAJ){
					writer.modify(contact.nom,contact.prenom);
				}
			}
		} else {
			listToCombineWith.push(contact);
			if(notifyMAJ){
				writer.add(contact.nom,contact.prenom);
			}
		}
	});
	return listToCombineWith;
}

Contact.remove = function(list,contact,notifyMAJ){
	var index = list.findIndex((element)=>element.compareContact(contact));
	list.splice(index,1);
	if(notifyMAJ){
		var writer = new Writer_MAJ();
		writer.delete(contact.nom,contact.prenom);
	}
	return list;
}

module.exports = Contact;
