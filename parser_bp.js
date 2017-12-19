var Parser = require('./Parser.js');
var Contact = require('./Contact.js');
// bp = BaseProspect

var ParserBP = function(){
  this.symb = ["Nom", "Prénom", "###Domaine", "Entreprise", "Fonction", "Téléphone1", "Téléphone2", "Email", "Remarque", "$$"];
}

//Inherit of Parser
ParserBP.prototype = new Parser();

  ParserBP.prototype.contact = function(input){
  	if(this.check("###Domaine", input)){
  		this.expect("###Domaine", input);
      var domaine = this.next(input);
      while(this.check("Nom", input)){
         this.next(input);
         var args = this.body(input);
  		   var c = new Contact(domaine, args.nom, args.prenom, args.entreprise, args.fonction, args.email, args.telephones, args.remarque);
  		   this.parsedContact.push(c);
      }
  		if(input.length > 1){
  			this.contact(input);
  		}
  		return true;
  	}else{
  		return false;
  	}
  }


  // <body> = <domaine> <eol> <name> <eol> ....
  ParserBP.prototype.body = function(input){
    var prenom, entreprise, fonction, email, remarque = "";
    var telephones = [];
    var nom = this.next(input);
    do{
      var symb = input[0];
      if(symb == "Prénom"){
        this.next(input)
        prenom = this.next(input);
      }else if(symb == "Entreprise"){
        this.next(input)
        entreprise = this.next(input);
      }else if(symb == "Fonction"){
        this.next(input)
        fonction = this.next(input);
      }else if(symb == "Email"){
        this.next(input)
        email = this.next(input);
      }else if(symb == "Téléphone1"){
        this.next(input)
        telephones.push(this.next(input));
      }else if(symb == "Téléphone2"){
        this.next(input)
        telephones.push(this.next(input));
      }else if(symb == "Remarque"){
        this.next(input)
        remarque = this.next(input);
      }
    }while(symb != "Nom" && symb != "###Domaine" && symb != "$$");
    return { nom : nom, prenom : prenom, entreprise : entreprise, fonction : fonction, email : email, telephones : telephones, remarque : remarque };
  }

  ParserBP.prototype.tokenize = function(data){
    var separator = /(\n|\r\n|:)/;
    data = data.split(separator);
    data = data.filter((val, idx) => !val.match(separator));
    return data;
  }

module.exports = ParserBP;
