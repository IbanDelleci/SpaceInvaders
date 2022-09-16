let container = document.querySelector('.grille');
let affichage = document.querySelector('h3');
let resultat = 0;
let toutesLesDivs;
let allInvaders = [];
let tireurPosition = 229;
let direction = 1;
let width = 20;

// Création de la grille globale sous forme d'un tableau (Divs), positionnement des aliens et du tireur.
function creationGrilleEtAliens() {

    let indexAttr = 0;

    for (i=0; i<240; i++) {

        if(indexAttr === 0) {
            let bloc = document.createElement('div');
            bloc.setAttribute('data-left', 'true');
            container.append(bloc);
            indexAttr++;
        } else if (indexAttr === 19) {
            let bloc = document.createElement('div');
            bloc.setAttribute('data-right', 'true');
            container.append(bloc);
            indexAttr = 0;
        } else {
            let bloc = document.createElement('div');
            container.append(bloc);
            indexAttr++;
        }
    }

    for (i=1; i<53; i++) {
        if(i===13){
            i=21;
            allInvaders.push(i);
        } else if (i===33) {
            i=41;
            allInvaders.push(i);
        } else {
            allInvaders.push(i);
        }
    }


    toutesLesDivs = document.querySelectorAll('.grille div');
    allInvaders.forEach(invader => {
        toutesLesDivs[invader].classList.add('alien');
    });

    toutesLesDivs[tireurPosition].classList.add('tireur');

}

creationGrilleEtAliens();

function deplacerLeTireur(e) {
    toutesLesDivs[tireurPosition].classList.remove('tireur');
    if(e.key === "ArrowLeft"){
        if(tireurPosition>220){
            tireurPosition-=1;
        }
    }
    else if(e.key === "ArrowRight"){
        if(tireurPosition<239){
            tireurPosition+=1;
        }
    }
    toutesLesDivs[tireurPosition].classList.add('tireur');
}

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    deplacerLeTireur(e);
});

let descendreRight = true;
let descendreLeft = true;

function bougerLesAliens(){

// Gestion du mouvement
// Coté droit 
    for (let i=0; i<allInvaders.length; i++){
        if (toutesLesDivs[allInvaders[i]].getAttribute('data-right') == 'true') {
            if(descendreRight){
                direction = 20;
                setTimeout(() => {
                    descendreRight = false;
                }, 50)
            }
        } else if (descendreRight==false) {
            direction=-1;
            setTimeout(() => {
                descendreRight = true;
            }, 50)
        
    
// Coté gauche       
        } else if (toutesLesDivs[allInvaders[i]].getAttribute('data-left') == 'true') {
            if(descendreLeft){
                direction = 20;
                setTimeout(() => {
                    descendreLeft = false;
                }, 50)
            }
        } else if (!descendreLeft) {
            direction=1;
            setTimeout(() => {
                descendreLeft = true;
            }, 50)
        }

    }

// Déplacement des aliens

        for (let i=0; i<allInvaders.length; i++){
            toutesLesDivs[allInvaders[i]].classList.remove('alien');
        }

        for (let i=0; i<allInvaders.length; i++){
            allInvaders[i]+=direction;
        }

        for (let i=0; i<allInvaders.length; i++){
            toutesLesDivs[allInvaders[i]].classList.add('alien');
        }

// Fin du jeu

        if(toutesLesDivs[tireurPosition].classList.contains('alien')){
            affichage.innerText="Game Over";
            affichage.style.color = "orange";
            affichage.style.fontSize = "25px";
            toutesLesDivs[tireurPosition].classList.add('boom');
            clearInterval(invaderInterval);
            document.removeEventListener("keydown", tirer);
        } 

        for (let i=0; i<allInvaders.length; i++) {
            if(allInvaders[i]> toutesLesDivs.length -  width){
                affichage.textContent = "Game Over";
                affichage.style.color = "orange";
                affichage.style.fontSize = "25px";
                clearInterval(invaderInterval);
                document.removeEventListener("keydown", tirer);
            }
        }

}

invaderInterval = setInterval(bougerLesAliens, 400);

// Création du laser pour tirer

function tirer(e) { 
    let laserId;
    let laserEnCours = tireurPosition;

    function deplacementLaser() {
        toutesLesDivs[laserEnCours].classList.remove('laser');
        laserEnCours -= width;
        toutesLesDivs[laserEnCours].classList.add('laser');

        if(toutesLesDivs[laserEnCours].classList.contains('alien')) {
            toutesLesDivs[laserEnCours].classList.remove('laser','alien');
            toutesLesDivs[laserEnCours].classList.add('boom');

            allInvaders = allInvaders.filter(elt => elt !== laserEnCours);

            setTimeout(() => toutesLesDivs[laserEnCours].classList.remove('boom'), 250); 
            clearInterval(laserId) ;

            resultat++;
            if(resultat == 36){
                affichage.innerText='Vous avez gagné!!';
                clearInterval(invaderId);
            } else {
                affichage.innerText = `Score: ${resultat}`;
            }
        }

        if (laserEnCours < width) {
            clearInterval(laserId);
            setTimeout(()=> {
                toutesLesDivs[laserEnCours].classList.remove('laser');
            }, 100)
        }
    }

    if(e.key  === " "){
        laserId = setInterval(() => {
           deplacementLaser();  
        }, 100)
    }
}

document.addEventListener('keydown', tirer);

//Reset le jeu (pour recommencer si perdu ou gagné)

let button = document.querySelector('.myButton');

button.addEventListener('click', () => {
    document.location.reload();
})