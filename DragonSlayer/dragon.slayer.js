// L'unique variable globale est un objet contenant l'état du jeu.
var game;

const ARMOR_COPPER  = 1;
const ARMOR_IRON    = 2;
const ARMOR_MAGICAL = 3;

const LEVEL_EASY   = 1;
const LEVEL_NORMAL = 2;
const LEVEL_HARD   = 3;

const SWORD_WOOD      = 1;
const SWORD_STEEL     = 2;
const SWORD_EXCALIBUR = 3;

function initializeGame()
{
	game = new Object();
	game.round = 1;
	game.difficulty = requestInteger
	(
	'Niveau de difficulte ?\n' +
	'1. Facile - 2. Normal - 3. Difficile',
	1, 3
	);

	switch(game.difficulty){
		case LEVEL_EASY:
            game.hpDragon = getRandomInteger(150, 200);
            game.hpPlayer = getRandomInteger(200, 250);
            break;

        case LEVEL_NORMAL:
            game.hpDragon = getRandomInteger(200, 250);
            game.hpPlayer = getRandomInteger(200, 250);
            break;

        case LEVEL_HARD:
            game.hpDragon = getRandomInteger(200, 250);
            game.hpPlayer = getRandomInteger(150, 200);
            break;
	}
	game.armor = requestInteger
	(
	'Armure ?\n' +
	'1.Cuivre - 2.Acier - 3.Magique',
	1, 3
	);

	switch(game.armor){
		case ARMOR_COPPER:
			game.armorRatio = 1;
			break;

		case ARMOR_IRON:
			game.armorRatio = 1.25;
			break;

		case ARMOR_MAGICAL:
			game.armorRatio = 2;
			break;
	}
	game.sword = requestInteger
	(
	'Epée ?\n' +
	'1.Bois - 2.Fer - 3.Excalibur',
	1,3
	);

	switch(game.sword){
		case SWORD_WOOD:
			game.swordRatio = 0.5;
			break;

		case SWORD_STEEL:
			game.swordRatio = 1;
			break;

		case SWORD_EXCALIBUR:
			game.swordRatio = 2;
			break;
	}
}
function showGameState()
{
	console.log
	(
		'Dragon: ' + game.hpDragon + ' PV, ' +
		'joueur: ' + game.hpPlayer  +  'PV'
	);
}


function gameLoop()
{

    while(game.hpDragon > 0 && game.hpPlayer > 0)
    {
        var damagePoint;
        var dragonSpeed;
        var playerSpeed;

        console.log('Tour numero ' + game.round++);

        // Détermination de la vitesse du dragon et du joueur.
        dragonSpeed = getRandomInteger(10, 20);
        playerSpeed = getRandomInteger(10, 20);

        // Est-ce que le dragon est plus rapide que le joueur ?
        if(dragonSpeed > playerSpeed)
        {
            // Oui, le joueur se prend des dégats et perd des points de vie.
            damagePoint = computeDragonDamagePoint();

            // Diminution des points de vie du joueur.
            game.hpPlayer -= damagePoint;
            // Identique Ã  game.hpPlayer = game.hpPlayer - damagePoint;

            console.log('Le dragon est plus rapide et vous brûle, il vous enleve ' +
                damagePoint + ' PV');
        }
        else{
            // Non, le dragon se prend des dégats et perd des points de vie.
            damagePoint = computePlayerDamagePoint();

            // Diminution des points de vie du dragon.
            game.hpDragon -= damagePoint;
            // Identique à  game.hpDragon = game.hpDragon - damagePoint;

            console.log('Vous êtes plus rapide et frappez le dragon, vous lui enlevez ' + damagePoint + ' PV');
        }

        showGameState();
    }
}


function startGame()
{
	console.clear();
	initializeGame();

	console.log('Points de vie de départ:');
	showGameState();
	gameLoop();


	showGameWinner();

}


startGame();
function computeDragonDamagePoint()
{
	var damagePoint;
	if(game.difficulty == LEVEL_EASY)
    {
    // Le dragon inflige moins de dégâts si le niveau de difficulté est facile.
    damagePoint = getRandomInteger(10, 20);
    }
    else
    {
        damagePoint = getRandomInteger(30, 40);
    }
    // Calcul du résultat final en fonction de l'armure du joueur.
	return Math.floor(damagePoint/game.armorRatio);
}

function computePlayerDamagePoint()
{
	var damagePoint;
     // Les dégâts infligés varient selon la difficulté du jeu.
    switch(game.difficulty)
    {
        case LEVEL_EASY:
        damagePoint = getRandomInteger(5, 10);
        break;

        case LEVEL_NORMAL:
        damagePoint = getRandomInteger(15, 20);
        break;

        case LEVEL_HARD:
        damagePoint = getRandomInteger(25, 30);
        break;
    }
    // Calcul du résultat final en fonction de l'épée du joueur.
    return Math.floor(damagePoint * game.swordRatio);
}

function showGameWinner()
{
	if(game.hpDragon <= 0)
    {
        showImage('images/chevalier.jpg');

        console.log("Vous avez gagné, vous etes vraiment fort !");
        console.log("Il vous restait " + game.hpPlayer + " PV");
    }
    else // if(game.hpPlayer <= 0)
    {
        showImage('images/dragon.jpg');

        console.log("Le dragon a gagne, vous avez ete carbonisee !");
        console.log("Il restait " + game.hpDragon + " PV au dragon");
    }
}


