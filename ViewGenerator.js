var HTML = require("./Writer_HTML.js");
var Contact = require("./Contact.js");
var Parser = require("./parser_bp.js");
var fs = require("fs");

//Generate the view
generateVue_Ensemble = function(){
	var page = new HTML("Vue d'ensemble");

	//Add Google Charts, Jquery and css for Jquery
	page.appendJSUrl("https://www.gstatic.com/charts/loader.js");
	page.appendJSUrl("https://code.jquery.com/jquery-3.2.1.min.js");
	page.appendCSSUrl("http://demos.jquerymobile.com/1.4.4/css/themes/default/jquery.mobile-1.4.4.min.css");

	//Add css for the page
	page.appendCss("html,body{height:100%;margin:0;overflow-y:hidden;} .contacts{display:inline-block;margin-left:5px;width:25%;height:100%;overflow-y:scroll;} h2{text-align:center;}");
	page.appendCss(".ui-btn{border:none;display:inline-block;margin:0;float:right;}");
	page.appendCss(".contact{padding:10px;background-color:lightcyan;border:1px solid lightblue;margin-bottom: 5px;width:95%;} .infos{padding:10px;background-color:azure;word-wrap:break-word;} h3{margin:1px;display:inline-block;}");
	page.appendCss(".domaine{padding:10px;background-color:lightcoral;border:1px solid indianred;margin-bottom: 5px;width:95%;}");
	page.appendCss(".chart{border-left:1px solid black;width:44%;display:inline-block;height:100%;float:right;}");
	page.appendCss("#piechart{width:100%;display:inline-block;height:100%;}");
	page.appendCss(".historique{border-left:1px solid black;width:30%;display:inline-block;height:100%;float:right;padding-left:5px;} .hist{background-color:lightcyan;border:1px solid lightblue}");

	//Read the database
	fs.readFile("baseprospect.txt", 'utf8', function (err,data) {
                if (err) {
                        return logger.warn(err);
                }
				//Analyze contacts
				var analyzer = new Parser();
				analyzer.parse(data);

				//Generate HTML
				var html="<div class=\"contacts\"><h2>Contacts :</h2>";
				var domaineActuel="";
				var domains = []; // domains
				var cpd = []; // contacts per domains
				var n = -1;
				//Foreach contacts, generate div and buttons to show them
				analyzer.parsedContact.forEach(function(contact){
					if(domaineActuel!=contact.domaine){
						n++;
						domaineActuel=contact.domaine;
						domains.push(domaineActuel);
						cpd.push(1);
						html+="<div class=\"domaine\"><h3>"+domaineActuel+" :</h3></div>";
					}else{
						cpd[n]++;
					}
					html+="<div class=\"contact\"><div><h3>"+contact.prenom+" "+contact.nom+"</h3><a href=\"#\" class=\"more ui-btn ui-icon-plus ui-btn-icon-notext\"></a></div><div class=\"infos\">";
					if(contact.entreprise!=undefined){html+="<p><b>Entreprise : </b>"+contact.entreprise+"</p>"}
					if(contact.fonction!=undefined){html+="<p><b>Fonction : </b>"+contact.fonction+"</p>"}
					if(contact.email!=undefined){html+="<p><b>Email : </b>"+contact.email+"</p>"}
					if(contact.telephone!=undefined && contact.telephone[0]!=undefined){html+="<p><b>Téléphone entreprise : </b>"+contact.telephone[0]+"</p>"}
					if(contact.telephone!=undefined && contact.telephone[1]!=undefined){html+="<p><b>Téléphone portable : </b>"+contact.telephone[1]+"</p>"}
					if(contact.remarque!=undefined){html+="<p><b>Remarque : </b>"+contact.remarque+"</p>"}
					html+="</div></div>";
				});

				html+="</div>";

				//JQuery client-side for animations
				page.appendContent(html);
				var jquery="$( document ).ready(function() { "
				jquery +=  "	$('.infos').hide(); ";
				jquery +=  "	$('.more').click(function(){";
				jquery +=  "		if($(this).parent().parent().children('.infos').css('display')=='none'){";
				jquery +=  "			$(this).parent().parent().children('.infos').show();";
				jquery +=  "			$(this).removeClass('ui-icon-plus');";
				jquery +=  "			$(this).addClass('ui-icon-minus');";
				jquery +=  "		} else {";
				jquery +=  "			$(this).parent().parent().children('.infos').hide();";
				jquery +=  "			$(this).removeClass('ui-icon-minus');";
				jquery +=  "			$(this).addClass('ui-icon-plus');";
				jquery +=  "	}}); ";
				jquery +=  "});";
				page.appendJS(jquery);

				//Show Historic of updates
				var historique = "<p class=\"hist\">"+fs.readFileSync("MAJ.txt",'utf8').replace(/\n/g,"</p><p class=\"hist\>")+"</p>";
				page.appendContent("<div class=\"historique\"><h2>Historique :</h2>"+historique+"</div>");

				//Calculate percentages for pie chart
				var percentagesPerDomains = [];
				var totalContacts = analyzer.parsedContact.length;
				var percent = 0.0;
				n=0;
				domains.forEach(function(d){
					percent = cpd[n]/totalContacts;
					percentagesPerDomains.push(percent);
					n++;
				});

				n=0;
				//Load pie chart
				var loader = "google.charts.load('current', {'packages':['corechart']});\n";
				loader += "google.charts.setOnLoadCallback(drawChart);\n";
				loader += "function drawChart() {";
				loader +=	"var data = google.visualization.arrayToDataTable([['Domains','Contacts per Domains']";
				domains.forEach(function(d){
					loader += ",\n['"+d+"',"+percentagesPerDomains[n]+"]";
					n++;
				});
				loader += "]);\n";
				loader +=	"var options = {title: 'Pourcentages des contacts par domaines', is3D: true};\n";
				loader +=	"var chart = new google.visualization.PieChart(document.getElementById('piechart'));\n";
				loader += "chart.draw(data, options);}\n";
				page.appendJS(loader);

				//Show pie chart
				page.appendContent("<div class=\"chart\"><h2>Graphique :</h2><div id=\"piechart\"></div></div>");

				page.save();

	});
}
