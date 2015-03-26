/***********************************************************************************/
/*********************************** DONNEES SLIDER ********************************/
/***********************************************************************************/
// Objet contenant l'état du slider.
var slider;

// La liste des slides.
var slides = 
[
	{ image : 'images/1.jpg', legend : 'Photo 1' },
	{ image : 'images/2.jpg', legend : 'Photo 2' },
	{ image : 'images/3.jpg', legend : 'Photo 3' },
	{ image : 'images/4.jpg', legend : 'Photo 4' },
	{ image : 'images/5.jpg', legend : 'Photo 5' },
	{ image : 'images/6.jpg', legend : 'Photo 6' }
];



/***********************************************************************************/
/********************************** FONCTIONS SLIDER *******************************/
/***********************************************************************************/
function onSliderGoToNext()
{
    // Passage au slide suivant.
    slider.current++;

    // Est-ce qu'on est arrivée au bout de la liste ?
    if(slider.current == slides.length)
    {
        // Oui, on revient au début (le slider est circulaire).
        slider.current = 0;
    }

    // Mise à  jour de l'affichage.
    refreshSlider();
}

function onSliderGoToPrevious()
{
    // Passage au slide précédent.
    slider.current--;

    // Est-ce qu'on est arrivé en début de liste ?
    if(slider.current < 0)
    {
        // Oui, on revient à  la fin (le slider est circulaire).
        slider.current = slides.length - 1;
    }

    // Mise à  jour de l'affichage.
    refreshSlider();
}

function onSliderGoToRandom()
{
    // Passage à  un slide aléatoire.
    slider.current = getRandomInteger(0, slides.length - 1);

    // Mise à jour de l'affichage.
    refreshSlider();
}

function onSliderToggle()
{
    // Est-ce que le carousel est démarrée ?
    if(slider.timer == null)
    {
        // Non, démarrage du carousel, toutes les deux secondes.
        slider.timer = window.setInterval(onSliderGoToNext, 2000);

        // Modification du bouton.
        this.innerHTML = 'Arrêter le carroussel';
    }
    else
    {
        // Oui, arrêt du carousel.
        window.clearInterval(slider.timer);

        // Réinitialisation de la propriété pour le prochain clic sur le bouton.
        slider.timer = null;

        // Modification du bouton.
        this.innerHTML = 'Démarrer le carroussel';
    }
}

function onToolbarToggle()
{
    var icon;

    // Affiche ou cache la barre d'outils.
    document.querySelector('.toolbar').classList.toggle('hide');

    // Modification de l'icone du lien pour afficher ou cacher la barre d'outils.
    icon = document.querySelector('#js-toolbar-toggle i');
    if(icon.classList.contains('fa-arrow-down') == true)
    {
        icon.classList.remove('fa-arrow-down');
        icon.classList.add('fa-arrow-right');
    }
    else
    {
        icon.classList.remove('fa-arrow-right');
        icon.classList.add('fa-arrow-down');
    }
}

function refreshSlider()
{
    // Changement de la source de l'image et du texte de la lÃ©gende du slider.
    document.querySelector('#js-slider img').src     = slides[slider.current].image;
    document.querySelector('#js-slider p').innerHTML = slides[slider.current].legend;
}



/***********************************************************************************/
/********************************** CODE PRINCIPAL *********************************/
/***********************************************************************************/
document.addEventListener('DOMContentLoaded', function()
{
	// Initialisation du slider.
	slider = new Object();
	slider.current = 0 ;
	slider.timer = null;

// Installation des gestionnaires d'évènement.
	installEventHandler('#js-slider-random', 'click', onSliderGoToRandom);
	installEventHandler('#js-slider-previous', 'click', onSliderGoToPrevious);
    installEventHandler('#js-slider-next', 'click', onSliderGoToNext);
    installEventHandler('#js-slider-toggle', 'click', onSliderToggle);
    installEventHandler('#js-toolbar-toggle', 'click', onToolbarToggle);

    // Affichage initial du slider.
    refreshSlider();

});

