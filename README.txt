### README - vCard/BaseProspect Parser/Writer

Description : Parser et Writer en javascript permettant d'importer des fichiers au format .vcf dans la base de données baseprospect.txt et d'exporter de cette même base vers des fichiers .vcf.

###Installation nécessaire
Nécessite l'installation au préalable de node.js, de caporal.js et de nodeunit.js.

###Formats
Les fichiers sont soit au format .vcf respectant la norme rfc6350, soit au format .txt et respectant la grammaire suivante :

BaseProspect = 1*Domaine
Domaine = "###Domaine" TexteCRLF
1*Contact
Texte= 1*(ALPHA/ WSP)
Contact = Nom CRLF
Prénom CRLF
Entreprise CRLF 
Fonction CRLF 
Email CRLF 
((Télephone1 CRLF) / (Téléphone1 CRLF
Téléphone2 CRLF))
Remarque CRLF
Nom= "Nom :"Texte
Prénom = "Prénom:" Texte
Entreprise = "Entreprise:" Texte
Fonction = "Fonction:" Texte
Email = "Email:" (1*VCHAR)"@"(1*VCHAR)
Téléphone1 = "Télephone1:" 9DIGIT
Téléphone2= "Télephone2:" 9DIGIT
Remarque = "Remarque:" 1*(WSP/VCHAR)

NB : Dans le format vCard, le domaine et l'entreprise d'un contact sont enregistrés de cette manière "ORG:nom_domaine;nom_entreprise".

### Utilisation :

$ node client.js <command> [options]

<command> : 
	
	updatehist
		Description : Afficher l'historique des mises à jour
		
	check <file>
		Description : Vérifier si un fichier est valide
		
		<file> : Fichier .vcf ou fichier .txt respectant la grammaire présenté plus haut.
		
	view
		Description : Génère un fichier Vue_Ensemble.html consultable sur Firefox. Pour mettre à jour cette vue, il faut relancer la commande.
		
	import <file>
		Description : Importe dans la base de données des contacts provenant d'un fichier .vcf.
		
		<file> : Fichier .vcf.
		
	export <file> [-d]
		Description : Exporte des contacts depuis la base de données vers un fichier .vcf.
		
		<file> : Le nom du fichier dans lequel on veut exporter suivi d'un ".vcf".
		
		-d ou --domaines : exporte les contacts en fonction de domaines sélectionnés. Sélection de domaine fais par "nom_domaine;nom_domaine".
		
	search [-pnd]
		Description : Affiche les informations des contacts par une recherche. Les trois options peuvent êtres combinées.
		
		-p ou --prenom : recherche en fonction du prénom. Exemple search -p "prenom"
		-n ou --nom : recherche en fonction du nom. Exemple search -n "nom"
		-d ou --domaines : recherche en fonction du ou des domaines. Exemple search -d "nom_domaine;_nom_domaine"
		
	remove -p "prenom" -n "nom"
		Description : Supprime un contact de la base de données. Les paramètres sont obligatoires. Un contact sera supprimé seulement si un seul résultat est trouvé.
		
		-p ou --prenom
		-n ou --nom 
		
	add -p "prenom" -n "nom" -d "domaine" --telephone1 "numero" [-efmr --telephone2]
		Description : Ajoute un contact à la base de données. Les paramètres p,n,d, et telephone1 sont obligatoires. Renseigné tous les paramètres pour avoir un contact complet.
		
		-p ou --prenom
		-n ou --nom
		-d ou --domaine
		--telephone1
		-e ou --entreprise : Exemple add -p "prenom" -n "nom" -d "domaine" --telephone1 "numero" -e "nom_entreprise"
		-f ou --fonction : Exemple add -p "prenom" -n "nom" -d "domaine" --telephone1 "numero" -f "fonction"
		-m ou --email : Exemple add -p "prenom" -n "nom" -d "domaine" --telephone1 "numero" -m "email@google.com"
		--telephone2 : Exemple add -p "prenom" -n "nom" -d "domaine" --telephone1 "numero" --telephone2 "numero"
		-r ou --remarque : Exemple add -p "prenom" -n "nom" -d "domaine" --telephone1 "numero" -r "remarque"
		
	modify -p "prenom" -n "nom" [options]
		Description : Modifie un contact en base de données. Le nom et prénom sont obligatoires. Le contact ne sera modifié que si un seul résultat est trouvé.
		
		--mp : Modifier le prénom. Exemple modify -p "prenom" -n "nom" --mp "nouveau_prenom"
		--mn : Modifier le nom. Exemple modify -p "prenom" -n "nom" --mn "nouveau_nom"
		--md : Modifier le domaine. Exemple modify -p "prenom" -n "nom" --md "nouveau_domaine"
		--me : Modifier l'entreprise. Exemple modify -p "prenom" -n "nom" --me "nouvelle_entreprise"
		--mf : Modifier la fonction. Exemple modify -p "prenom" -n "nom" --mp "nouvelle_fonction"
		--mm : Modifier l'email. Exemple modify -p "prenom" -n "nom" --mm "nouvel_email"
		--mt1 : Modifier le téléphone du travail. Exemple modify -p "prenom" -n "nom" --mt1 "nouveau_numero"
		--mt2 : Modifier le téléphone portable. Exemple modify -p "prenom" -n "nom" --mt2 "nouveau_numero"
		--mr : Modifier la remarque. Exemple modify -p "prenom" -n "nom" --mp "nouvelle_remarque"
		
	help <command>
		Description : Donne l'aide d'utilisation de la commande.
		
		
	NB: Un contact requiert toujours un minimum d'information. Le domaine, le nom, le prénom et le numéro de téléphone du travail sont toujours obligatoires.
		Que ce soit dans un fichier vCard, dans un fichier BaseProspect ou bien lors de la création d'un contact par commande.
	
###Fichiers supplémentaires
	baseprospect.txt
		Description : Base de données Base Prospect respectant la grammaire.
		
	exemple.vcf,exemple.vcf,exemple.vcf
		Description : Fichier .vcf contenant des contacts.
		
	export.vcf
		Description : Fichier issue d'un export de baseprospect.txt vers export.vcf.

### Liste des contributeurs
Guillaume BOURDELAT (guillaume.bourdelat@utt.fr)
Thomas LORIOT (thomas.loriot@utt.fr)
Zijie AN (zijie.an@utt.fr)
Erwan PIERET (erwan.pieret@utt.fr)


