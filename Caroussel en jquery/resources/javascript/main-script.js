/******************************************************************************/
/********************************** DONNÉES ***********************************/
/******************************************************************************/

	var carousel =
	{
		visibleSlide : {},

		pagination :
		{
			//	Créer la pagination
			create : function()
			{
				//	Création de l'élément gérant la pagination
				this.element = $('<ol class="pagination">');
				//	Pour chaque diapositive du carrousel
				for(var slide = 1 ; slide <= carousel.lastSlideNumber ; slide++)
				{
					//	Ajout d'un item à la pagination
					this.element.append('<li>');
				}
				//	Actualisation de l'affichage de la pagination
				this.updateDisplay();
				//	Ajout de la pagination au carrousel
				this.element.appendTo(carousel.element);
			},

			//	Actualiser l'affichage de la pagination
			updateDisplay : function()
			{
				//	Suppression de la mise en valeur de l'item correspondant à la diapositive précédemment visible
				this.element.find('li.active').removeClass('active');
				//	Mise en valeur de l'item correspondant à la diapositive actuellement visible
				this.element.find('li:nth-child(' + carousel.visibleSlide.number + ')').addClass('active');
			}
		},

		//	Initialise le carrousel
		initialize : function(element)
		{
			//	Sélection du carrousel
			this.element = element;

			//	Sélection de la diapositive actuellement visible
			this.visibleSlide.element = this.element.find('.slide:visible');
			//	Affectation du numéro (position) de la diapositive actuellement visible
			this.visibleSlide.number = this.visibleSlide.element.index() + 1;
			//	Affectation du numéro (position) de la dernière diapositive
			this.lastSlideNumber = this.element.find('.slide').length;

			//	Création de la pagination
			this.pagination.create();

			//	Démarrage du défilement automatique du carrousel
			this.play();

			//	Arrêt du défilement automatique du carrousel lorsque le pointeur entre dans le carrousel
			this.element.on('mouseenter', this.stop);
			//	Démarrage du défilement automatique du carrousel lorsque le pointeur sort du carrousel
			this.element.on('mouseleave', this.play);
			//	Lorsqu'on clique sur un item de la pagination
			this.pagination.element.find('li').on('click', function()
			{
				//	Va à la diapositive correspondante
				carousel.goToSlideNumber($(this).index() + 1);
			});
		},

		//	Aller à la diapositive précédente
		goToPreviousSlide : function()
		{
			//	Si la diapositive actuellement visible n'est pas la première du carrousel
			if(this.visibleSlide.number > 1)
			{
				//	La diapositive à afficher est la précédente
				this.visibleSlide.number--;
			}
			//	Si la diapositive actuellement visible est la première du carrousel
			else
			{
				//	La diapositive à afficher est la dernière
				this.visibleSlide.number = this.lastSlideNumber;
			}

			//	Actualisation de l'affichage du carrousel
			this.updateDisplay();
		},

		//	Aller à la diapositive suivante
		goToNextSlide : function()
		{
			//	Si la diapositive actuellement visible n'est pas la dernière du carrousel
			if(this.visibleSlide.number < this.lastSlideNumber)
			{
				//	La diapositive à afficher est la suivante
				this.visibleSlide.number++;
			}
			//	Si la diapositive actuellement visible est la dernière du carrousel
			else
			{
				//	La diapositive à afficher est la première
				this.visibleSlide.number = 1;
			}

			//	Actualisation de l'affichage du carrousel
			this.updateDisplay();
		},

		//	Aller à une diapositive précise
		goToSlideNumber : function(slideNumber)
		{
			//	Si la diapositive demandée existe dans le carrousel
			if(slideNumber >= 1 && slideNumber <= this.lastSlideNumber)
			{
				//	La diapositive à afficher est celle demandée
				this.visibleSlide.number = slideNumber;
			}
			//	Si la diapositive demandée n'existe pas dans le carrousel
			else
			{
				//	La diapositive à afficher est la première
				this.visibleSlide.number = 1;
			}

			//	Actualisation de l'affichage du carrousel
			this.updateDisplay();
		},

		//	Démarre le défilement automatique du carrousel
		play : function()
		{
			//	Va à la diapositive suivante toutes les 2 secondes (utilisation d'une fonction anonyme pour régler le problème de « this » avec setInterval())
			carousel.interval = setInterval(function()
			{
				carousel.goToNextSlide();
			}, 2000);
		},

		//	Arrête le défilement automatique du carrousel
		stop : function()
		{
			clearInterval(carousel.interval);
		},

		//	Actualise l'affichage du carrousel
		updateDisplay : function()
		{
			//	Disparition de la diapositive actuellement visible
			this.visibleSlide.element.fadeOut();
			//	Sélection de la nouvelle diapositive à afficher
			this.visibleSlide.element = this.element.find('.slide:nth-child(' + this.visibleSlide.number + ')');
			//	Apparition de la nouvelle diapositive à afficher
			this.visibleSlide.element.fadeIn();

			//	Actualisation de l'affichage de la pagination
			this.pagination.updateDisplay();
		}
	};


/******************************************************************************/
/******************************* CODE PRINCIPAL *******************************/
/******************************************************************************/

	//	Ĺorsque le dom est complètement chargé
	$(function()
	{
		//	Initialisation du carrousel
		carousel.initialize($('#carousel'));
	});
