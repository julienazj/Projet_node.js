// nodeunit https://github.com/caolan/nodeunit

module.exports = {
	
	setUp: function(callback){
		//For both tests
		var Contact = require('../../Contact');
		
		//For the writer and parser test
		var parserBP = require('../../parser_bp');
		this.analyzer_parserBP = new parserBP();
		var parserVCard = require('../../parser_vcard');
		this.analyzer_parserVcard = new parserVCard();
		var Writer_BP = require('../../Writer_BP');
		this.analyzer_writerBP = new Writer_BP();
		this.contact = [new Contact("Musique", "Young", "Angus", "ACDC", "Guitariste rythmique", "angus.young@gmail.com", ["0326666665","0606060605"], "Meilleur guitariste du monde")];
		var Writer_vCard = require('../../Writer_vCard');
		this.analyzer_writerVcard = new Writer_vCard();
		
		//For the contact test
		this.c = new Contact("Transport", "DUBOIS", "Michel", "Trans", "chauffeur", "michel.dubois@hotmail.com", ["0654846484"], "peut faire Paris-Marseille plus vite qu'un TGV");
        this.c2 = new Contact("a", "DUBOIS", "Michel",undefined,undefined,undefined,["0654846484"]);
        this.c3 = new Contact("b", "GUMP", "Forest",undefined,undefined,undefined,["0326666663"]);
        this.c4 = new Contact("c", "SMITH", "John",undefined,undefined,undefined,["0326666662"])
        this.c5 = new Contact("d", "	WILLIAMS", "James",undefined,undefined,undefined,["0326666661"]);
		
		callback();
	},
	
	
	// Test module/group 2
	"Progarm parsing of baseprospect": {
		"Parser": function(assert){
			var inpt = ['###Domaine','Groupe',
			'Nom','Scott',
			'Prénom','Bon',
			'Fonction','Chanteur',
			'Email','bon.scott@gmail.com',
			'Téléphone1','0326666664',
			'Téléphone2','0606060604',
			'Remarque','Remplacé par Brian Johnson car décedé en 1980',"$$"];
			assert.ok(this.analyzer_parserBP.contact(inpt), "Parcer Succuss!");
			assert.done();
		},	

        "Domaine": function(assert){
			assert.equal(this.analyzer_parserBP.parsedContact[0].domaine, "Groupe","domaine matched and returned");
			assert.done();
		},
		"Name": function(assert){
			assert.equal(this.analyzer_parserBP.parsedContact[0].nom, "Scott","Name matched and returned");
			assert.done();
		},
		"Family name": function(assert){
			assert.equal(this.analyzer_parserBP.parsedContact[0].prenom, "Bon","Family name matched and returned");
			assert.done();
		},
		"Fonction": function(assert){
			assert.equal(this.analyzer_parserBP.parsedContact[0].fonction, "Chanteur","Fonction matched and returned");
			assert.done();
		},
		"Email": function(assert){
			assert.equal(this.analyzer_parserBP.parsedContact[0].email, "bon.scott@gmail.com","Email matched and returned");
			assert.done();
		},
		"Remarque": function(assert){
			assert.equal(this.analyzer_parserBP.parsedContact[0].remarque, "Remplacé par Brian Johnson car décedé en 1980","Remarque matched and returned");
			assert.done();
		},
		"Telephone": function(assert){
			assert.deepEqual(this.analyzer_parserBP.parsedContact[0].telephone, ['0326666664','0606060604'],"Telephone matched and returned");
			assert.done();
		},		
		
	},
	
	"Progarm parsing of VCard": {
		"Parser": function(assert){
			var inpt = [ 'BEGIN',
			'VCARD',
			'VERSION',
			'4.0',
			'FN',
			'Angus Young',
			'N',
			'Young;Angus',
			'ORG',
			'Musique;AC/DC',
			'TITLE',
			'Guitariste leader',
			'EMAIL;INTERNET',
			'angus.young@gmail.com',
			'TEL;TYPE=WORK',
			'0326334455',
			'TEL;TYPE="work,cell,voice"',
			'+33606060606',
			'NOTE',
			'Meilleur guitariste du monde',
			'END',
			'VCARD',
			'$$' ] ;
			assert.ok(this.analyzer_parserVcard.contact(inpt), "Parser Succuss!");
			assert.done();
		},	

        "Domaine": function(assert){
			assert.equal(this.analyzer_parserVcard.parsedContact[0].domaine, "Musique","domaine matched and returned");
			assert.done();
		},
		"Name": function(assert){
			assert.equal(this.analyzer_parserVcard.parsedContact[0].nom, "Young","Name matched and returned");
			assert.done();
		},
		"Family name": function(assert){
			assert.equal(this.analyzer_parserVcard.parsedContact[0].prenom, "Angus","Family name matched and returned");
			assert.done();
		},
		"Fonction": function(assert){
			assert.equal(this.analyzer_parserVcard.parsedContact[0].fonction, "Guitariste leader","Fonction matched and returned");
			assert.done();
		},
		"Email": function(assert){
			assert.equal(this.analyzer_parserVcard.parsedContact[0].email, "angus.young@gmail.com","Email matched and returned");
			assert.done();
		},
		"Remarque": function(assert){
			assert.equal(this.analyzer_parserVcard.parsedContact[0].remarque, "Meilleur guitariste du monde","Rmarque matched");
			assert.done();
		},
		"Telephone": function(assert){
			assert.deepEqual(this.analyzer_parserVcard.parsedContact[0].telephone, ['0326334455','+33606060606'],"Telephone matched and returned");
			assert.done();
		},		
		
	},
	"Program writer of baseprospect": {

        "Transform data into baseprospect format": function(assert){
			assert.equal(this.analyzer_writerBP.contactsToData(this.contact),'###Domaine:Musique\nNom:Young\nPrénom:Angus\nEntreprise:ACDC\nFonction:Guitariste rythmique\nEmail:angus.young@gmail.com\nTéléphone1:0326666665\nTéléphone2:0606060605\nRemarque:Meilleur guitariste du monde',"Format BP matched and returned");
			assert.done();
		},
		
	},
	"Program writer of VCard": {

		"Transform data into VCard format": function(assert){
		assert.equal(this.analyzer_writerVcard.contactsToData(this.contact),'BEGIN:VCARD\nVERSION:4.0\nFN:Angus Young\nN:Young;Angus\nORG:Musique;ACDC\nTITLE:Guitariste rythmique\nEMAIL:angus.young@gmail.com\nTEL;TYPE=WORK:0326666665\nTEL;TYPE="work,cell,voice":0606060605\nNOTE:Meilleur guitariste du monde\nEND:VCARD\n',"Format vCard matched and returned");
		assert.done();
		},
	},
    
    "Test on Contact": {

        "Create Contact" : function(assert){
        assert.ok(this.c, "Contact created");
        assert.equal(this.c.domaine, "Transport", "Domaine recorded");
        assert.equal(this.c.nom, "DUBOIS", "Lastname recorded");
        assert.equal(this.c.prenom, "Michel", "Firstname recorded");
        assert.equal(this.c.entreprise, "Trans", "Entreprise name recorded");
        assert.equal(this.c.fonction, "chauffeur", "Function recorded");
        assert.equal(this.c.email, "michel.dubois@hotmail.com", "Email recorded");
        assert.equal(this.c.telephone, "0654846484", "Phone number recorded");
        assert.equal(this.c.remarque, "peut faire Paris-Marseille plus vite qu'un TGV", "Remarque recorded");
                        
        assert.done();
        },
                        
        "Function getNumberAttribute": function(assert){  
			assert.equal(this.c.getNumberAttribute(), 8, "Should be equal to 8");
			assert.equal(this.c2.getNumberAttribute(), 4, "Should be equal to 3");
						
			assert.done();
		},

		"Function compareContact": function(assert){
			assert.equal(this.c.compareContact(this.c), true, "Should be true");
			assert.equal(this.c.compareContact(this.c3), false, "Should be false");
		
			assert.done();			
		},
		
		"Function about domains": function(assert){
			var Contact = require("../../Contact.js");
			let listByDomain = [this.c4, this.c3, this.c2];
			
			var result = Contact.sortByDomain(listByDomain);
			assert.equal(result[0], this.c2, "Is not sorted");
			assert.equal(result[2], this.c4, "Is not sorted");

			assert.equal(Contact.getByDomain(listByDomain, "a")[0].nom, this.c2.nom, "Should only return the contact c2");
			
			assert.done();
		},
						
		"Function with getBy": function(assert){
			var Contact = require("../../Contact.js");
			let listContact1 = [this.c, this.c3];
			let listContact2 = [this.c2, this.c4];
                        
			assert.equal(Contact.getByName(listContact1, "DUBOIS").length, 1, "Should only return one contact");

			assert.equal(Contact.getByFirstname(listContact2, "John").length, 1, "Should only return one contact");
			
			assert.done();
        },
		
		"Function removeDuplicates": function(assert){
			var Contact = require("../../Contact.js");
			let listContact1 = [this.c, this.c3];
			let listContact2 = [this.c2, this.c4];
			let listContact3 = [this.c4, this.c5];
			
			assert.equal(Contact.removeDuplicates(listContact1, listContact2).length, 3, "Contact c2 should not be in the list");
			assert.equal(Contact.removeDuplicates(listContact1, listContact3).length, 4, "All contacts should be kept");
			assert.done();
        },
		
		"Function remove": function(assert){
			var Contact = require("../../Contact.js");
			let listContact = [this.c, this.c3];

			assert.equal(Contact.remove(listContact, this.c).length, 1, "Should remove one Contact");
			assert.done();
        }
		
    }
}