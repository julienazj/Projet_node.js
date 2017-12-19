var Parser = require('./Parser.js');
var Contact = require('./Contact.js');

var ParserVCard = function(){
  this.symb = ["BEGIN","N", "ORG", "TITLE", "EMAIL;INTERNET", "TEL;TYPE=WORK", "TEL;TYPE=\"work,cell,voice\"", "NOTE", "END", "$$"];
}

//Inherit of Parser
ParserVCard.prototype = new Parser();

  // <contact> = "BEGIN" <eol> <body> "END"
  ParserVCard.prototype.contact = function(input){
  	if(this.check("BEGIN", input)){
  		this.expect("BEGIN", input);
  		var args = this.body(input);
  		var c = new Contact(args.domaine, args.nom, args.prenom, args.entreprise, args.fonction, args.email, args.telephones, args.remarque);
  		this.parsedContact.push(c);
  		if(input.length > 1){
  			this.next(input);
  			this.contact(input);
  		}
  		return true;
  	}else{
  		return false;
  	}
  }

  //searching next usefull field
  ParserVCard.prototype.search = function(input){
    while(!this.symb.includes(input[0])){
      this.next(input);
    }
    return 0;
  }

  // <body> = <domaine> <eol> <name> <eol> ....
  ParserVCard.prototype.body = function(input){
    var nomprenom, domaineentreprise, fonction, email, remarque = "";
    var telephones = [];
    do{
      this.search(input);
      var symb = input[0];
      this.next(input);
      //console.log(symb);
      if(symb == "N"){
        nomprenom = this.nomprenom(input);
      }else if(symb == "ORG"){
      	domaineentreprise = this.domaineentreprise(input);
      }else if(symb == "TITLE"){
      	fonction = this.next(input);
      }else if(symb == "EMAIL;INTERNET"){
      	email = this.next(input);
      }else if(symb == "TEL;TYPE=WORK"){
      	telephones.push(this.next(input));
      }else if(symb == "TEL;TYPE=\"work,cell,voice\""){
      	telephones.push(this.next(input));
      }else if(symb == "NOTE"){
      	remarque = this.next(input);
      }
    }while(symb != "END");
  	return { nom : nomprenom.nom, prenom : nomprenom.prenom, domaine : domaineentreprise.domaine, entreprise : domaineentreprise.entreprise, fonction : fonction, email : email, telephones : telephones, remarque : remarque };
  }

  ParserVCard.prototype.tokenize = function(data){
    var separator = /(\n|\r\n|:)/;
    data = data.split(separator);
    data = data.filter((val, idx) => !val.match(separator));
    return data;
  }

  ParserVCard.prototype.nomprenom = function(input){
    var nomprenom = this.next(input);
    var separator = /;/;
    nomprenom = nomprenom.split(separator);
    nomprenom = nomprenom.filter((val, idx) => !val.match(separator));
    var nom = nomprenom[0];
    var prenom = nomprenom[1];
    return { nom : nom, prenom : prenom };
  }
  ParserVCard.prototype.domaineentreprise = function(input){
    var de = this.next(input);
    var separator = /;/;
    de = de.split(separator);
    de = de.filter((val, idx) => !val.match(separator));
    var domaine = de[0];
    var entreprise = de[1];
    return { domaine : domaine, entreprise : entreprise };
  }

module.exports = ParserVCard;
