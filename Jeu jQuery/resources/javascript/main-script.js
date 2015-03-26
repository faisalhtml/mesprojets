/******************************************************************************/
/********************************* VARIABLES **********************************/
/******************************************************************************/

	var boxSize;
	var map = {};
	var character = {};
	var coin = {};
	var score = {};
	var possibleDirections = [];
	//	Les index correspondent aux valeurs renvoyées par « event.wich » lorsque la touche directionnelle correspondante est enfoncée
	possibleDirections[37] = 'left';
	possibleDirections[38] = 'up';
	possibleDirections[39] = 'right';
	possibleDirections[40] = 'down';


/******************************************************************************/
/********************************* FONCTIONS **********************************/
/******************************************************************************/

	/******************************[ PERSONNAGE ]******************************/

		//	Modifie la direction dans laquelle regarde le personnage
		character.changeDirectionTo = function(direction)
		{
			//	Mise à jour de la classe CSS correspondant à la direction du personnage
			this.element.removeClass('up right down left').addClass(direction);
		};

		//	Modifie aléatoirement la direction dans laquelle regarde le personnage
		character.randomlyChangeDirection = function()
		{
			//	Affectation d'une direction aléatoire
			var direction = possibleDirections[getRandomInt(37, 40)];

			//	Modification de la direction dans laquelle regarde le personnage
			this.changeDirectionTo(direction);
		};

		//	Déplace aléatoirement le personnage
		character.moveRandomly = function()
		{
			//	Affectation d'une position aléatoire au personnage
			this.position =
			{
				top : getRandomInt(map.boundaries.top / boxSize, map.boundaries.bottom / boxSize) * boxSize,
				left : getRandomInt(map.boundaries.left / boxSize, map.boundaries.right / boxSize) * boxSize
			};

			//	Déplace le personnage à sa nouvelle position
			this.element.css(this.position);
		};

		//	Déplace le personnage dans la direction souhaitée
		character.moveTo = function(direction)
		{
			var possibleMovement;
	
			//	S'il doit se déplacer vers le haut et qu'il n'a pas atteint la limite supérieure du terrain
			if(direction == 'up' && this.position.top > map.boundaries.top)
			{
				//	Affectation de sa nouvelle position
				this.position.top -= boxSize;
			}
			//	Sinon, s'il doit se déplacer vers la droite et qu'il n'a pas atteint la limite droite du terrain
			else if(direction == 'right' && this.position.left < map.boundaries.right)
			{
				//	Affectation de sa nouvelle position
				this.position.left += boxSize;
			}
			//	Sinon, s'il doit se déplacer vers le bas et qu'il n'a pas atteint la limite inférieure du terrain
			else if(direction == 'down' && this.position.top < map.boundaries.bottom)
			{
				//	Affectation de sa nouvelle position
				this.position.top += boxSize;
			}
			//	Sinon, s'il doit se déplacer vers la gauche et qu'il n'a pas atteint la limite gauche du terrain
			else if(direction == 'left' && this.position.left > map.boundaries.left)
			{
				//	Affectation de sa nouvelle position
				this.position.left -= boxSize;
			}
			//	Sinon
			else
			{
				//	Le déplacement est impossible
				possibleMovement = false;
			}

			//	Si le mouvement est possible
			if(possibleMovement !== false)
			{
				//	Déplace le personnage à sa nouvelle position
				this.element.css(this.position);

				//	Si le personnage a attrapé la pièce
				if(coin.isCaught())
				{
					//	Déplacement aléatoire de la pièce
					coin.moveRandomly();
					//	Incrémentation du score
					score.increment();
					//	Actualisation de l'affichage du score
					score.updateDisplay();
				}
			}
		};

	/********************************[ PIÈCE ]*********************************/

		//	Déplace aléatoirement la pièce
		coin.moveRandomly = function()
		{
			//	Affectation d'une position aléatoire à la pièce…
			do
			{
				this.position =
				{
					top : getRandomInt(map.boundaries.top / boxSize, map.boundaries.bottom / boxSize) * boxSize,
					left : getRandomInt(map.boundaries.left / boxSize, map.boundaries.right / boxSize) * boxSize
				}
			}
			//	…tant que celle-ci n'est pas située à au moins 2 cases du personnage
			while(Math.abs(character.position.left - this.position.left) <= 2 * boxSize && Math.abs(character.position.top - this.position.top) <= 2 * boxSize)

			//	Déplace la pièce à sa nouvelle position
			this.element.css(this.position);
		};

		//	Teste si le personnage a attrapé la pièce
		coin.isCaught = function()
		{
			//	Renvoie « true » si le personnage a attrapé la pièce (s'ils sont dans la même case) et « false » dans le cas contraire
			return (character.position.top == coin.position.top && character.position.left == coin.position.left);
		};

	/********************************[ SCORE ]*********************************/

		//	Incrémente le score
		score.increment = function()
		{
			this.value += 10;
		};

		//	Actualise l'affichage du score
		score.updateDisplay = function()
		{
			this.element.text(this.value);
		};


	//	Initialise le jeu
	function initializeGame()
	{
		//	Taille d'une case
		boxSize = parseInt($('html').css('font-size'));

		/*****************************[ TERRAIN ]******************************/

			//	Élément HTML correspondant au terrain
			map.element = $('#map');
			//	Dimensions du terrain
			map.element.width(boxSize * 21);
			map.element.height(boxSize * 15);
			//	Limites du terrain
			map.boundaries =
			{
				top : 0,
				right : map.element.width() - boxSize,
				bottom : map.element.height() - boxSize,
				left : 0
			}

		/****************************[ PERSONNAGE ]****************************/

			//	Élément HTML correspondant au personnage
			character.element = $('#character');
			//	Modification aléatoire de la direction dans laquelle regarde le personnage
			character.randomlyChangeDirection();
			//	Déplacement aléatoire du personnage
			character.moveRandomly();
			//	Affichage du personnage
			character.element.show();

		/******************************[ PIÈCE ]*******************************/

			//	Élément HTML correspondant à la pièce
			coin.element = $('#coin');
			//	Déplacement aléatoire de la pièce
			coin.moveRandomly();
			//	Affichage de la pièce
			coin.element.show();

		/******************************[ SCORE ]*******************************/

			//	Élément HTML correspondant au score
			score.element = $('#score');
			//	Valeur du score
			score.value = 0;
			//	Actualisation de l'affichage du score
			score.updateDisplay();
	};


/******************************************************************************/
/******************************* CODE PRINCIPAL *******************************/
/******************************************************************************/

	//	Quand le dom est complètement chargé
	$(function()
	{
		//	Initialisation du jeu
		initializeGame();

		//	Quand une touche est enfoncée
		$(document).on('keydown', function(event)
		{
			//	S'il s'agit d'une touche directionnelle
			if(typeof(possibleDirections[event.which]) != 'undefined')
			{
				//	Affectation de la direction en fonction de la touche enfoncée
				var direction = possibleDirections[event.which];

				//	Si le personnage regarde dans la direction souhaitée (s'il a la classe correspondante)
				if(character.element.hasClass(direction))
				{
					//	Déplacement du personnage dans la direction souhaitée
					character.moveTo(direction);
				}
				//	Si le personnage ne regarde pas dans la direction souhaitée (s'il n'a pas la classe correspondante)
				else
				{
					//	Modification de la direction dans laquelle regarde le personnage
					character.changeDirectionTo(direction);
				}
			}
		});
	});
