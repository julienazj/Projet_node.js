var Writer = require('./Writer.js');

var Writer_HTML = function(title){
	this.title="<title>"+title+"</title>";
	this.head="";
	this.body="";
}
//Inherit of Writer
Writer_HTML.prototype = new Writer("Vue_Ensemble.html");

//Return the generated HTML for the page
Writer_HTML.prototype.buildHTML = function(){
	return "<!DOCTYPE html><html><header>"+this.title+"<meta charset=\"UTF-8\">"+this.head+"</header><body>"+this.body+"</body></html>";
}

//Add content to the body of the page
Writer_HTML.prototype.appendContent = function(text){
	this.body+=text;
}

//Add CSS to the page
Writer_HTML.prototype.appendCss = function(text){
	this.head+="<style>"+text+"</style>";
}

//Add CSS to the page
Writer_HTML.prototype.appendCSSUrl = function(url){
	this.head+="<link rel=\"stylesheet\" href=\""+url+"\">";
}

//Add JS to the file with an URL
Writer_HTML.prototype.appendJSUrl = function(url){
	this.head+="<script src=\""+url+"\"></script>";
}

//Add JS to the body of the file
Writer_HTML.prototype.appendJS = function(text){
	this.body+="<script>"+text+"</script>";
}

//Save the file
Writer_HTML.prototype.save = function (){
	this.write(this.buildHTML());
}

module.exports = Writer_HTML;