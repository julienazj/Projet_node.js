var fs = require('fs');
var colors = require('colors');
var parserVCard = require('./parser_vcard.js');
var parserBP = require('./parser_bp');
var Contact = require('./Contact.js');
var Writer_BP = require('./Writer_BP.js');
var Writer_vCard = require('./Writer_vCard.js');
var Writer_MAJ = require('./Writer_MAJ.js');
var ViewGenerator = require('./ViewGenerator.js');

var Caporal = require('caporal');

Caporal
	.version('0.1')

  //Check Parser
  .command('updatehist', 'Historique de mise à jour')
  //.argument('<file>', 'The file to check with parser')
  .action(function(args,options,logger){

        fs.readFile("MAJ.txt", 'utf8', function (err,data) {
                if (err) {
                        return logger.warn(err);
                }
				console.log(data);
        });

    })

	
	//Check Parser
  .command('check', 'Vérifie si le fichier <file> est valide.')
  .argument('<file>', 'Le nom du fichier.')
  .action(function(args, options, logger){

	fs.readFile(args.file, 'utf8', function (err,data) {
	                if (err) {
	                        return logger.warn(err);
	                }
	                if (args.file.search(".vcf") >= 0) {
	                    var analyzer = new parserVCard();
	                } else if (args.file.search(".txt") >= 0) {
	                    var analyzer = new parserBP();
	                } else {
	                    return logger.warn(err);
	                }


	                analyzer.parse(data);
					console.log("Fichier correct.");
	                //logger.debug(analyzer.parsedContact);
	        });

	    })

		
		//Generate HTML
		.command('view', 'Génère une vue d\'ensemble')
		.action(function(args, options, logger){
			generateVue_Ensemble();
			console.log("Vue correctement générée, disponible dans Vue_Ensemble.html.");
	    })

		
            //import a file vCard to database without doublons
	    .command('import','Importe un fichier .vcf vers la base de données.')
	    .argument('<file>','Le nom du fichier .vcf que vous voulez importer.')
	    .action(function(args, options,logger){
		    fs.readFile(args.file, 'utf8', function (err,data){
			    if (err){
				    return logger.warn(err);
			    }
		    if (args.file.search(".vcf") >= 0){
			    var analyzerVCard = new parserVCard();
		    }
		    else {
			    return logger.warn("Le fichier importer n'est pas au format .vcf.");
		    }
		    analyzerVCard.parse(data);
		    
		    
		    var analyzerBP = new parserBP();
		    listbase = fs.readFileSync("baseprospect.txt",'utf8');
		    analyzerBP.parse(listbase);
			
		    var newList = Contact.removeDuplicates(analyzerBP.parsedContact,analyzerVCard.parsedContact,true);
			
			writer = new Writer_BP();
		    writer.save(newList);
		    console.log("Import réussi.")
			
		    });
	    })
	
	    //export a vCard from the database
	    .command('export','Exporte un fichier .vcf depuis la base de données')
	    .argument('<file>','Le nom du fichier dans lequel vous souhaitez sauvegarder.')
	    .option('-d,--domaines','liste des domaines séparé par ;')
	    .action(function(args,options,logger){
		    fs.readFile("baseprospect.txt",'utf8', function (err,data){
			    if (err){
				    return logger.warn(err);
			    }
			    var analyzer = new parserBP();
			    analyzer.parse(data);
				
			    if (options.domaines!=undefined && options.domaines!==true){
				    analyzer.parsedContact = Contact.getByDomain(analyzer.parsedContact,options.domaines);
			    }
				
				var writer = new Writer_vCard(args.file)
				writer.save(analyzer.parsedContact);
				console.log("Export réussi.")
		    });
	
	    })    



	//Search for a contact and show it
	.command('search','Liste des contacts')
	.option('-p, --prenom','en fonction du prénom',/([A-Za-z]|-| )*/)
	.option('-n, --nom','en fonction du nom',/([A-Za-z]|-| )*/)
	.option('-d, --domaines','en fonction du ou des domaines "domaine;domaine;domaine..."',/([A-Za-z]|-| |;)*/)
	.action(function(args,options,logger){
		fs.readFile("baseprospect.txt", 'utf8', function (err,data) {
                if (err) {
                        return logger.warn(err);
                }
				var analyzer = new parserBP();
				analyzer.parse(data);
				var list = analyzer.parsedContact;
				if(options.prenom!=undefined && options.prenom!==true){
					list = Contact.getByFirstname(list,options.prenom);
				}
				if(options.nom!=undefined && options.nom!==true){
					list = Contact.getByName(list,options.nom);
				}
				if(options.domaines!=undefined && options.domaines!==true){
					list = Contact.getByDomain(list,options.domaines);
				}
				console.log(list);
        });
	})

	//Remove a contact from baseprospect database
	.command('remove','Supprime un contact')
	.option('-p, --prenom','en fonction du prénom',/([A-Za-z]|-| )*/,"",true)
	.option('-n, --nom','en fonction du nom',/([A-Za-z]|-| )*/,"",true)
	.action(function(args,options,logger){
		fs.readFile("baseprospect.txt", 'utf8', function (err,data) {
                if (err) {
                        return logger.warn(err);
                }
				var analyzer = new parserBP();
				analyzer.parse(data);
				var list = analyzer.parsedContact;
				if(options.prenom!=undefined && options.prenom!=""){
					list = Contact.getByFirstname(list,options.prenom);
				}
				if(options.nom!=undefined && options.nom!=""){
					list = Contact.getByName(list,options.nom);
				}
				if(list.length>1){
					return logger.warn("Il y à plusieurs contacts avec ce nom et prénom.");
				} else if(list.length==1){
					analyzer.parsedContact = Contact.remove(analyzer.parsedContact,list[0],true);
					
					var writer = new Writer_BP();
					writer.save(analyzer.parsedContact);
					console.log("Contact supprimé.");
				} else {
					console.log("Aucun contact supprimé.");
				}
		});
	})
	
	//add a contact in baseproject database
	.command('add', 'Ajoute un contact')
	.option('-p, --prenom','prénom',/([A-Za-z]|-| )*/,undefined,true)
	.option('-n, --nom','nom',/([A-Za-z]|-| )*/,undefined,true)
	.option('-d, --domaine','domaine',/([A-Za-z]|-| )*/,undefined,true)
	.option('-e, --entreprise','entreprise')
	.option('-f, --fonction','fonction')
	.option('-m, --email','email')
	.option('--telephone1','telephone du travail',/([0-9]|\+| |-|\.)*/,undefined,true)
	.option('--telephone2','telephone portable')
	.option('-r, --remarque','remarque')
	.action(function(args,options,logger){
		
		fs.readFile("baseprospect.txt", 'utf8', function (err,data){
			if (err){
				return logger.warn(err);
			}
			var analyzer = new parserBP();
			analyzer.parse(data);
			
			if(options.prenom!=undefined && options.nom!=undefined && options.domaine!=undefined && options.telephone1!=undefined){
				var contactToAdd = new Contact(options.domaine,options.prenom,options.nom,options.entreprise,options.fonction,options.email,[options.telephone1,options.telephone2],options.remarque);
				analyzer.parsedContact.push(contactToAdd);
				var writerBP = new Writer_BP();
				writerBP.save(analyzer.parsedContact);
				var writerMAJ = new Writer_MAJ();
				writerMAJ.add(options.nom,options.prenom);
				console.log("Contact ajouté.");
			}
		});
	})
	
	//modify a contact in baseproject database
	.command('modify', 'Modifie un contact')
	.option('-p, --prenom','prénom',/([A-Za-z]|-| )*/,undefined,true)
	.option('-n, --nom','nom',/([A-Za-z]|-| )*/,undefined,true)
	.option('--mp','modifie le prénom')
	.option('--mn','modifie le nom')
	.option('--md','modifie le domaine')
	.option('--me','modifie l\'entreprise')
	.option('--mf','modifie la fonction')
	.option('--mm','modifie l\'email')
	.option('--mt1','modifie le telephone du travail')
	.option('--mt2','modifie le telephone portable')
	.option('--mr','modifie la remarque')
	.action(function(args,options,logger){
		fs.readFile("baseprospect.txt", 'utf8', function (err,data) {
                if (err) {
                        return logger.warn(err);
                }
				var analyzer = new parserBP();
				analyzer.parse(data);
				var list = analyzer.parsedContact;
				
				if(options.prenom!=undefined && options.prenom!=""){
					list = Contact.getByFirstname(list,options.prenom);
				}
				if(options.nom!=undefined && options.nom!=""){
					list = Contact.getByName(list,options.nom);
				}
				
				//If the list of contact found is more than 1 we do not modify but if the list is equal to 1 we modify it
				if(list.length>1){
					return logger.warn("Il y à plusieurs contacts avec ce nom et prénom.");
				} else if(list.length==1){
					analyzer.parsedContact = Contact.remove(analyzer.parsedContact,list[0]);
					
					if(options.mp!=undefined && options.mp!=""){list[0].prenom=options.mp;}
					if(options.mn!=undefined && options.mn!=""){list[0].nom=options.mn;}
					if(options.md!=undefined && options.md!=""){list[0].domaine=options.md;}
					if(options.me!=undefined && options.me!=""){list[0].entreprise=options.me;}
					if(options.mf!=undefined && options.mf!=""){list[0].fonction=options.mf;}
					if(options.mm!=undefined && options.mm!=""){list[0].email=options.mm;}
					if(options.mt1!=undefined && options.mt1!=""){list[0].telephone[0]=options.mt1;}
					if(options.mt2!=undefined && options.mt2!=""){list[0].telephone[1]=options.mt2;}
					if(options.mr!=undefined && options.mr!=""){list[0].remarque=options.mr;}
					
					analyzer.parsedContact.push(list[0]);
					
					var writer = new Writer_BP();
					writer.save(analyzer.parsedContact);
					writer =  new Writer_MAJ();
					writer.modify(list[0].nom, list[0].prenom);
					console.log("Contact modifié.");
				}
		});
	})


Caporal.parse(process.argv);
