function bonjour() {
    document.getElementById('page-analysis').innerHTML = "Bonjour ! Bonne visite :)";
}


function OuvrirAide(){
    var x = document.getElementById("modemploi");
    if (x.style.display === "inline-block") {
        x.style.display = "none";
    }
    else{
        x.style.display = "inline-block";
    }
}

String.prototype.replaceAll = function( token, newToken, ignoreCase ) {
    var _token;
    var str = this + "";
    var i = -1;
    if ( typeof token === "string" ) {
        if ( ignoreCase ) {
            _token = token.toLowerCase();
            while( (
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                ) ) !== -1
            ) {
                str = str.substring( 0, i ) +
                    newToken +
                    str.substring( i + token.length );
            }
        } else {
            return this.split( token ).join( newToken );
        }
    }
return str;
};



window.onload = function() {
        var fileInput = document.getElementById('fileInput');
        var fileDisplayArea = document.getElementById('fileDisplayArea');

        fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0];
            var textType = /text.*/;

            if (file.type.match(textType)) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    fileDisplayArea.innerText = reader.result;
                }

                reader.readAsText(file);    
            } else {
                fileDisplayArea.innerText = "File not supported!"
            }
        });
}

/*---------------------------------------------------------------------------*/
// Segmentation :
// On crée une variable qui permettra de valider la segmentation et de débloquer d'autres fonctions d'analyse
var SEGMENTATIONOK=0;
function splittext(){
    // On récupère les délimiteurs
  queryDelim=document.getElementById('delimID').value;
  // Si le champ des délimiteurs est vide, on affiche un message d'alerte et on interrompt le programme
  if (queryDelim == ''){
    var vide='<small><span style="text-align:center; border: 1pt dotted #939393 ; padding: 1pt; margin-left: 0px; margin-right: 0px; background:red">Entrez les délimiteurs pour segmenter les mots...</span></small>';
    document.getElementById('placeholder').innerHTML = '';
    document.getElementById('placeholder').innerHTML += vide;
    return;
  }
  /* On prepare la regexp finale pour segmenter le texte en "mots" */
  queryDelim += "\n\s\t\"";
  queryDelim2 = queryDelim.replace(/(.)/gi, "\\$1");
  DictionnaireSource = new Object();
  // On initialise nos variables
  NBMOTTOTALSource=0;   
  NBMOTSource=0;
  // On affiche un message pour signaler le début de la segmentation
  var vide='<small><span style="text-align:center; border: 1pt dotted #939393 ; padding: 1pt; margin-left: 0px; margin-right: 0px; background:#FDBBD2">Segmentation en cours</span></small>';
  document.getElementById('placeholder').innerHTML = vide;
  // On récupère le texte
  var allLines = document.getElementById('fileDisplayArea'); 
  // On segegmente les lignes selon les sauts de ligne
  var arrayOfLines = allLines.innerText.split("\n");
  for (var nblines=0;nblines<arrayOfLines.length;nblines++) {
    var contentxt=arrayOfLines[nblines];
    // Nettoyage et segmentation
    // On supprime les balises résiduelles
    contentxt = contentxt.replace(/<\/?[^>]+>/gi, "");
    contentxt=contentxt.replaceAll("<"," ");
    contentxt=contentxt.replaceAll(">"," ");
    /* 2. on supprime les délimiteurs en debut de chaine */
    var reg0=new RegExp("^["+queryDelim2+"]", "g"); 
    contentxt.replace(reg0,"");
    /* 3. on supprime les délimiteurs en fin de chaine */
    var reg1=new RegExp("["+queryDelim2+"]$", "g");
    contentxt.replace(reg1,"");
    /* 4. on segmente avec les délimiteurs habituels */
    var reg=new RegExp("["+queryDelim2+"]", "g");
    var LISTEDEMOTS=contentxt.split(reg);
    for (var nbmot=0;nbmot<LISTEDEMOTS.length;nbmot++) {
        if ((LISTEDEMOTS[nbmot] != " ") && (LISTEDEMOTS[nbmot] != "")) {
            NBMOTTOTALSource=NBMOTTOTALSource+1;
            if (DictionnaireSource[LISTEDEMOTS[nbmot]] === undefined) {
                DictionnaireSource[LISTEDEMOTS[nbmot]] = 1;
                NBMOTSource+=1;
            }
            else {
                DictionnaireSource[LISTEDEMOTS[nbmot]] = DictionnaireSource[LISTEDEMOTS[nbmot]]  + 1;
            }
        }
    }
  }
  // On affiche un message pour indiquer la fin de la segmentation
  var vide='<small><span style="text-align:center; border: 1pt dotted #939393 ; padding: 1pt; margin-left: 0px; margin-right: 0px; background:#FDBBD2">Segmentation terminée (SOURCE : '+NBMOTTOTALSource+' occurrences / '+NBMOTSource+ ' formes) </span></small>';
  document.getElementById('placeholder').innerHTML = vide;
  // On utilise cette variable pour valider la segmentation et permettre l'utilisation d'autres fonctions
  SEGMENTATIONOK=SEGMENTATIONOK+1
}

/*---------------------------------------------------------------------------*/
/* Dictionnaire*/

function affichedico(){
    // On affiche un message d'alerte si la segmentation n'a pas été effectuée et on interrompt le programme
    if (SEGMENTATIONOK==0){
        alert("Segmentez le texte avant d'utiliser cette fonction !");
        return;
    }
    // On crée  deux variables, une qui contiendra le résultat final et une autre qui nous permettra de créer le tableau HTML avec le dictionnaire
    var resultFinal="";
    var table='';
    // On fait la mise en forme du tableau final
    table += '<table align="center" class="myTable">';
    table += '<tr><th colspan="5"><b>Dictionnaire</b></th></tr><tr>';
    table +='    <th width="30%">Mot</th>';
    table +='    <th width="10%">Fréquence</th>';
    table +='    <th width="10%">Longueur</th>';
    table +='    <th width="30%">Majuscules</th>';
    table +='    <th width="20%">1ère lettre</th>';
    table += '</tr>';
    // On récupère la liste des mots segmentés
    var LISTEMOTS=Object.keys(DictionnaireSource).sort(function(a,b){
        var x = DictionnaireSource[a];/*toLowerCase();*/
        var y = DictionnaireSource[b];/*.toLowerCase();*/
        /*return x < y ? -1 : x > y ? 1 : 0;*/
        return x < y ? 1 : x > y ? -1 : 0;
        });;

        //Affichage et remplissage des lignes du tableau
    for (var i=0; i<LISTEMOTS.length;i++) {
        //table +='<tr><td>'AFFICHAGE DE LA LISTE'</td><td>'FREQUENCE'</td><td>'LONGUEUR'</td><td>'EN MAJUSCULE'</td><td>'CHARACTERE A L'INDICE 0'</td></tr>';      
        table +='<tr><td>'+LISTEMOTS[i]+'</td><td>'+DictionnaireSource[LISTEMOTS[i]]+'</td><td>'+LISTEMOTS[i].length+'</td><td>'+LISTEMOTS[i].toLocaleUpperCase()+'</td><td>'+LISTEMOTS[i].charAt(0)+'</td></tr>';      
    }
    // On termine le tableau
    table +='</table>';
    resultFinal+=table;

  /* ------------------------- */
  document.getElementById('placeholder').innerHTML = '';
  vide='<small><span style="text-align:center; border: 1pt dotted #939393 ; padding: 1pt; margin-left: 0px; margin-right: 0px; background:#FDBBD2"> Segmentation terminée (SOURCE : '+NBMOTTOTALSource+' occurrences / '+NBMOTSource+ ' formes) </span></small>';
  // On affiche le tableau final
  document.getElementById('page-analysis').innerHTML = resultFinal;
}
/*---------------------------------------------------------------------------*/
/* Concordance */

function concordance_v2() {
    
    // On nettoie la zone de résultat
    document.getElementById('page-analysis').innerHTML ="";
    
    // on va chercher les 2 paramètres du calcul
    var lepole=document.getElementById('poleID').value;
    var longueur=document.getElementById('lgID').value;
    
    // Si l'utilisateur ne supprime pas le message par défaut, le programme renvoie une alerte :
    
    if (lepole=="Entrez le pôle de la concordance..."){
        alert("Entrez un pôle valide !");
        return;
    }
    
    // Si l'utilisateur ne met aucun pôle, le programme renvoie une alerte :

    if (lepole==""){
        alert("Entrez un pôle valide !");
        return;
    }

    // On va chercher tout le texte situé dans la zone filedisplayArea
    var allLines = document.getElementById('fileDisplayArea').innerText; 
    
    // On construitl'expression régulière pour segmenter en mots
    var queryDelim=document.getElementById('delimID').value;
    queryDelim += "\n\s\t\"";
    var queryDelim2 = queryDelim.replace(/(.)/gi, "\\$1");
    var reg=new RegExp("(["+queryDelim2+"]+)", "g");

    // On segmente le texte en mots : résultat : une liste de tous les mots du texte
    allLines=allLines.replace(reg,"\377$1\377");
    var LISTEDEMOTS=allLines.split("\377");
    // On prépare le tableau qui affichera le résultat final
    var table="<table>";
    table += '<tr><th colspan="4"><b>Concordance de \"'+lepole+'\"</b></th></tr><tr>';
    table +='    <th width="40%">Contexte gauche</th>';
    table +='    <th width="10%">Pôle</th>';
    table +='    <th width="40%">Contexte droit</th>';
    table +='    <th width="10%">Fréquence</th>';
    table +='</tr>';
    var compteur=0

    // On parcourt la liste des mots à la recherche du pôle
    for (var nbmot=0;nbmot<LISTEDEMOTS.length;nbmot++) {    
        var unmot=LISTEDEMOTS[nbmot];
        // est-ce que le mot en cours est le pôle ?
        var reg=new RegExp("\\b"+lepole+"\\b"); // On cherche un mot (avec les frontières de mot), le pôle
        // On passe les mots en revue pour retrouver le pôle
        if (unmot.search(reg) > -1) {
            // On crée un compteur pour compter les occurrences du pôle
            compteur+=1
            // si c'est le pôle, on reconstruit ses contextes gauche et droit (de longueur indiquée par l'utilisateur)
            var longueur2=2*Number(longueur);
            var CD = LISTEDEMOTS.slice(nbmot+1, nbmot+1+longueur2);
            var tmp=nbmot-longueur2;
            var tmp2=tmp+longueur2;
            if (tmp < 0) {tmp=0;tmp2=nbmot};
            //console.log(LISTEDEMOTS);
            //console.log("tmp:"+tmp+"|tmp2:"+tmp2);
            var CG = LISTEDEMOTS.slice(tmp, tmp2);
            // On recrée les contextes droit et gauche
            var contextedroit=CD.join('');
            var contextegauche = CG.join('');
            // On met en forme l'affichage du pôle en rouge
            var resutmp = unmot.replace(lepole, "<font color='red'>"+lepole+"</font>");
            // On ajoute une ligne pour chaque ocurrence du pôle avec son contrxte droit et gauche
            table += "<tr><td>"+contextegauche+"</td><td>"+resutmp+"</td><td>"+contextedroit+"</td><td>"+compteur+"</td></tr>";
        }
    }
    // Une fois que toutes les ocurrence du pôle ont été trouvées, on termine le tableau et on l'affiche
    table += '</table>';
    document.getElementById('page-analysis').innerHTML+=table;
}

/*---------------------------------------------------------------------------*/
/* Affichage en majuscule */

function majuscule(){
    // On vide la zone d'affichage d'analyse
    document.getElementById('page-analysis').innerHTML ="";
    // On récupère le texte à transformer
    var allLines = document.getElementById('fileDisplayArea').innerText; 
    //On segmente en ligne selon les retour à la ligne
    allLines=allLines.split("\n");
    var resultat="";
    //On met chaque ligne segmentée en majuscule puis on conserve la mise en forme d'origine en créant des retour à la ligne avec <br> à la fin de chaque ligne
    for (var nb=0;nb<allLines.length;nb++) {
        var ligne=allLines[nb];
        var result = ligne.toUpperCase();
        resultat += result+"<br/>";
    }
    //On affiche le résultat
    document.getElementById('page-analysis').innerHTML+=resultat;
 }

/*---------------------------------------------------------------------------*/
/* Affichage en minuscule */

function minuscule(){
    // On vide la zone d'affichage d'analyse
    document.getElementById('page-analysis').innerHTML ="";
    // On récupère le texte à transformer
    var allLines = document.getElementById('fileDisplayArea').innerText; 
    //On segmente en ligne selon les retour à la ligne
    allLines=allLines.split("\n");
    var resultat="";
    //On met chaque ligne segmentée en minuscule puis on conserve la mise en forme d'origine en créant des retours à la ligne avec <br> à la fin de chaque ligne
    for (var nb=0;nb<allLines.length;nb++) {
        var ligne=allLines[nb];
        var result = ligne.toLowerCase();
        resultat += result+"<br/>";
    }
    //On affiche le résultat
    document.getElementById('page-analysis').innerHTML+=resultat;
 }

/*---------------------------------------------------------------------------*/
/* Mots les plus longs */

function motlesluslongs(){
    // On vide la zone d'affichage d'analyse
    document.getElementById('page-analysis').innerHTML ="";
    if (SEGMENTATIONOK==0){
        alert("Segmentez le texte avant d'utiliser cette fonction !");
        return;
    }
    // On attribue à une variable la valeur de la longueue
    var longueur=document.getElementById("lgID").value;
    // Si le champ longueur est vide, on affiche un message d'alerte et on interrompt le programme.
    if (longueur==""){
    alert("Entrez une longueur valide ! La longueur correspond au nombre de mots classés dans le tableau final.");
    return;
    }
    /* Création de la liste des mots du texte et de la liste finale*/
    var listemots = Object.keys(DictionnaireSource);
    var motlong = [];
    for (var i = 0 ; i<longueur; i++){
    motlong[i]="";
    }
   // On parcourt la liste des mots et chaque mot plus long que le précédent prend une place dans la liste
    for(var i = 0; i < listemots.length; i++) {
        if (listemots[i].length>motlong[motlong.length-1].length){
            motlong[motlong.length-1]=listemots[i];
            // Organisation de la liste finale par ordre décroissant 
            motlong.sort(function(a,b){return b.length-a.length});
        }
        }
        //On construit le tableau d'affichage du résultat final
        var table = '<table><tr><th colspan="3"><b> Les '+longueur+' mots les plus longs du texte</b></th></tr><tr><th width="10%">N°</th><th width="80%">Mot</th><th width="10%">Nombre de caractères</th></tr>';
        // On remplit le tableau final
        for (var j = 0; j<motlong.length;j++){
            table+="<tr><td>"+(j+1)+"</td><td>"+motlong[j]+"</td><td>"+motlong[j].length+"</td></tr>";
        }
        // On termine le tableau
        table+="</table>";
        // Puis on l'affiche
        document.getElementById('page-analysis').innerHTML = table;
}

/*---------------------------------------------------------------------------*/
/* Nombre de phrases */
function phrases() {
    // On récupère  le texte
    var texte = document.getElementById("fileDisplayArea").innerText;
    // On délimite les phrases grâce à la ponctuation de fin
    var phrases = /[.!?]/;
    // On segmente en phrases
    var nbdePhrases = texte.split(phrases);
    // On compte le nombre de phrases
    var resultat = nbdePhrases.length-1;
    // On affiche le nombre de phrase dans la zone d'analyse
    document.getElementById('page-analysis').innerHTML='<span>Ce texte comporte '+resultat+' phrases.</span>';
}