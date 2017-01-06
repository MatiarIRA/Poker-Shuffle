/*
Fichier:	tp2.js
Auteurs:	Louis-Edouard LAFONTANT
			Mohammad Hossein ERFANIAN AZMOUDEH

Ce programme web permet de simuler le jeu "poker shuffle".
Nombre de joueur: 1
Nombre de cartes: 52
But du jeu: Piger 25 cartes une à la fois et les placer dans une grille 5x5
            pour former des mains de poker sur les 5 rangées et 5 colonnes,
            en maximisant le pointage total.
*/

var doc = document;     // variable représentant le document.

// Fonction permettant de réorganiser le contenu d'un tableau
// de manière aléatoire.
var TableauAlea = function (arr) {
    var resultat = arr.slice();
    var temp = 0;
    var position = 0;
    for (var i = resultat.length - 1; i >= 0; i--) {
        position = Math.floor(Math.random() * i) + 1;
        temp = resultat[i];
        resultat[i] = resultat[position];
        resultat[position] = temp;
    }
    return resultat;
};

// Fonction permettant de remplir un tableau de n entier de 0 à n-1.
var Iota = function(n){
    var tab = Array(n); //initialise un tableau de taille n
    
    //rempli le tableau: tab[0] = 0; tab[1] = 1 ... tab[n-1] = n-1
    for (var i = 0; i < n; i++)
        tab[i] = i;
    
    return tab;
}

// Fonction principal faisant l'initialisation du jeu et l'appel des
// fonctions.
var init = function () {
    var docBody = doc.getElementById("b");  // variable représentant <body>.
    docBody.innerHTML = "";                 // initialisation de <body>.

    var color = {                           // couleur utilisé dans le jeu.
        selected: "lime",
        unselected: "transparent"
        },
        selectedCard = {                    // carte sélectionnée lors du jeu.
            ID: -1,
            Valeur: "",
            init: function () { this.ID = -1; this.Valeur = ""; }
        },
        nbrCarte = 52,                      // nombre de cartes dans le jeu.
        nbrPige = 25,                       // nombre de piges possible.
        cards = Array(nbrCarte),            // representation des cartes.
        pile = TableauAlea(Iota(nbrCarte)), // pile de 52 cartes.
        hands = Array(nbrPige + 1),         // suivi de l'état du jeu.
        pige = 0,                           // position de la prochaine pige.
        valeur = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        couleur = ['C', 'D', 'H', 'S'];

    // Initialisation du pile
    for (i = 0, couleurLen = couleur.length; i < couleurLen; i++) {
        for (var j = 0, valeurLen = valeur.length; j < valeurLen; j++) {
            cards[i + 4 * j] = valeur[j] + couleur[i];
        }
    }
    cards.push('empty', 'back');

    // Initialisation du jeu
    for (var i = 0; i < nbrPige; i++) {
        hands[i] = 52;
    }
    hands[25] = 53;

    function CarteURL(cardCode) {
        return "cards/" + cardCode + ".svg";
    }
    function CalculerPoint() {
        var index = 0;
        var total = 0;
        while (index < 5) {
            var tab = hands.slice(index * 5, index * 5 + 5);
            tab.sort(function (a, b) { return (a - b); });
            doc.getElementById("R" + index).innerHTML = CalculerMain();
            for (var i = 0; i < 5; i++) {
                tab[i] = hands[index + i * 5];
            }
            tab.sort(function (a, b) { return (a - b); });
            doc.getElementById("C" + index).innerHTML = CalculerMain();
            index++;
        }
        doc.getElementById("T").innerHTML = total;
        function CalculerMain() {
            var pair = 0,
                paire2 = 0,
                brelan = 0,
                test = 0,
                quinte = 1,
                flush = 1,
                resultat = 0;
            if (tab[0] != 52 && tab[1] != 52) {
                for (var i = 0, j = 1; j < 5; i++, j++) {
                    if (tab[i] == 52 || tab[j] == 52) {
                        quinte = 0;
                        flush = 0;
                        continue;
                    }
                    if (tab[i] >> 2 == tab[j] >> 2) {
                        if (brelan && !test) {
                            resultat = 50;
                        } else if (paire2 || (brelan && test)) {
                            resultat = 25;
                        } else if (pair && test) {
                            resultat = 5;
                            paire2 = 1;
                        } else if (pair) {
                            resultat = 10;
                            brelan = 1;
                        } else {
                            resultat = 2;
                            pair = 1;
                        }
                    } else {
                        if (pair || brelan) { test = 1; }
                    }
                    if (quinte && ((tab[i] >> 2) + 1 != tab[j] >> 2)) {
                        if (i < 1 && tab[i] >> 2 == 0 && tab[j] >> 2 == 9) { continue; }
                        else { quinte = 0; }
                    }
                    if (flush && (tab[i] % 4 != tab[j] % 4)) { flush = 0; }
                }
                if (j == 5 && resultat < 25) {
                    if (quinte) { resultat = 15; }
                    if (flush) { resultat = 20; }
                }
                if (quinte && flush) {
                    if (tab[0] == 10) { resultat = 100; }
                    else { resultat = 75; }
                }
                total += resultat;
            }
            return resultat ? resultat : "";
        }
    }
    function Clic(carteID) {
        // Carte sélectionnnée.
        var carte = doc.getElementById(carteID);
        // Fonction affichant la carte sélectionnée comme sélectionner (lime)
        function ChangerSelection() {
            carte.style.backgroundColor = color.selected;
            selectedCard.Valeur = hands[carteID];
            selectedCard.ID = carteID;
        }
        // Vérification qu'une carte est sélectionnée avant le clic.
        if (selectedCard.ID != -1) {
            // Carte sélectionnée avant le clic.
            var carte2 = doc.getElementById(selectedCard.ID);
            // Désélectionner la carte sélectionné avant le clic
            carte2.style.backgroundColor = color.unselected;

            // Vérification que la carte sélectionnée provient de la pile.
            if (carteID == 25) {
                // Vérification que la carte sélectionnée est le dos de carte
                if (hands[carteID] == 53) {
                    // Faire une pige dans la pile
                    carte.firstChild.src = CarteURL(cards[pile[pige]]);
                    hands[carteID] = pile[pige];
                }
                ChangerSelection();
            } else {
                // Vérification que la carte sélectionnée avant le clic
                // provient de la pile.
                if (selectedCard.ID == 25) {
                    // Vérification que la carte sélectionnée est vide
                    if (hands[carteID] == 52) {
                        // Mettre la carte de la pile dans la carte sélectionné
                        carte.firstChild.src = CarteURL(cards[selectedCard.Valeur]);
                        hands[carteID] = selectedCard.Valeur;
                        // Mettre la pile comme dos de carte
                        carte2.firstChild.src = CarteURL(cards[53]);
                        hands[selectedCard.ID] = 53;
                        selectedCard.init();
                        pige += 1;  // incrémentation de la pige
                    } else { ChangerSelection(); }

                } else {
                    // Vérification que la carte sélectionnée avant le clic est
                    // différente de celle sélectionnée.
                    if (selectedCard.ID != carteID) {
                        carte.firstChild.src = CarteURL(cards[selectedCard.Valeur]);
                        carte2.firstChild.src = CarteURL(cards[hands[carteID]]);
                        hands[selectedCard.ID] = hands[carteID];
                        hands[carteID] = selectedCard.Valeur;
                    }
                    selectedCard.init();
                }

                CalculerPoint(); 

                // Vérification du nombre de piges faites pour mettre fin à la partie.
                if (pige == nbrPige) {
                    doc.getElementById("25").firstChild.src = CarteURL(cards[52]);
                    alert("Voitre pointage finale est " + doc.getElementById("T").innerHTML);
                    init();
                }
            }
        } else {
            // Vérification que la carte sélectionné est le dos de carte.
            if (hands[carteID] == 53) {
                carte.firstChild.src = CarteURL(cards[pile[pige]]);
                hands[carteID] = pile[pige];
            }
            // Vérification que la carte sélectionné provient de la pile
            // ou n'est pas la silhouette de carte.
            if (carteID == 25 || hands[carteID] != 52) { ChangerSelection(); }
        }
    }

    var fragment = doc.createDocumentFragment();

    // Création de la table ayant la pile et le bouton d'initialisation du jeu
    var deckTable = doc.createElement("table");
    fragment.appendChild(deckTable);
    var tableRow = doc.createElement("tr");
    for (var i = 0; i < 4; i++) {
        var tableCell = doc.createElement("td");
        if (i == 0) {
            var btnNewGame = doc.createElement("button");
            btnNewGame.innerHTML = "Nouvelle partie";
            btnNewGame.onclick = function () { init() };
            tableCell.appendChild(btnNewGame);
        } else if (i == 2) {
            var backCard = doc.createElement("img");
            backCard.src = CarteURL(cards[53]);
            tableCell.id = 25;
            tableCell.appendChild(backCard);
            tableCell.onclick = function () { Clic(+this.id); }
        }
        tableRow.appendChild(tableCell);
    }
    deckTable.appendChild(tableRow);

    // Création d'une table contenant la grille 5x5 représentant les cartes
    // et la colonne et la ligne réservé au pointage
    var cardTable = doc.createElement("table");
    fragment.appendChild(cardTable);
    for (var i = 0; i < 6; i++) {
        tableRow = doc.createElement("tr");
        for (var j = 0; j < 6; j++) {
            tableCell = doc.createElement("td");
            if (i < 5 && j < 5) {
                tableCell.id = 5 * i + j;
                tableCell.style.backgroundColor = color.unselected;
                var emptyCard = doc.createElement("img");
                emptyCard.src = CarteURL(cards[52]);
                tableCell.appendChild(emptyCard);
                tableCell.onclick = function () { Clic(+this.id); }
            } else {
                if (i < 5) { tableCell.id = "R" + i; }
                else if (j < 5) { tableCell.id = "C" + j; }
                else {
                    tableCell.id = "T"
                    tableCell.innerHTML = 0;
                }
            }
            tableRow.appendChild(tableCell);
        }
        cardTable.appendChild(tableRow);
    }
    docBody.appendChild(fragment);
};