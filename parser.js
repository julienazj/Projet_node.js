var Contact = require('./Contact.js');

// NEVER CALL FUNCTION IN THIS FILE TO ACCESS DATAS OR PARSE !!!
// ALWAYS USE PARSER_BP OR PARSER_VCARD !!!

// Using the "prototype" library to work with heritance

// Parser -> contains all functions required for the application
// Function parse has to be redefined for each format -> For VCard and BaseProspect (BP) in the dedicated files

var Parser = function(){
	this.parsedContact = [];
	this.errorCount = 0;
}


// Parser procedure

// Has to be redefined by each format
//Parser.prototype.tokenize : function(data){}

// parse : analyze data by calling the first non terminal rule of the grammar
Parser.prototype.parse = function(data){
	data+="\n$$";
	var tData = this.tokenize(data); // tdata = "Tokenized" data
	this.listContact(tData);
}


// Parser operand

Parser.prototype.errMsg = function(msg, input){
	this.errorCount++;
	console.log("Parsing Error ! on "+input+" -- msg : "+msg);
}

// Read and return a symbol from input
Parser.prototype.next = function(input){
	var curS = input.shift();
	return curS
}

// accept : verify if the arg s is part of the language symbols.
Parser.prototype.accept = function(s){
	var idx = this.symb.indexOf(s);
	// index 0 exists
	if(idx === -1){
		this.errMsg("symbol "+s+" unknown", [" "]);
		return false;
	}

	return idx;
}

// check : check whether the arg elt is on the head of the list
Parser.prototype.check = function(s, input){
	if(this.accept(input[0]) == this.accept(s)){
		return true;
	}
	return false;
}

// check : To find usefull fields for our application
Parser.prototype.chk = function(s, input){
	if(input[0] == s){
		return true;
	}
	return false;
}

// expect : expect the next symbol to be s.
Parser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		return true;
	}else{
		this.errMsg("symbol "+s+" doesn't match", input);
	}
	return false;
}


// Parser rules

// <liste_contact> = *(<contact>) "$$"
Parser.prototype.listContact = function(input){
	this.contact(input);
	this.expect("$$", input);
	//console.log(this.parsedContact);
}


module.exports = Parser;
