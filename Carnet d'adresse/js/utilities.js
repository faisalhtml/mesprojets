/*******************************************************************************************/
/********************************** FONCTIONS UTILITAIRES **********************************/
/*******************************************************************************************/

/*
 * TODO: la fonction n'efface que les valeurs des balises HTML <input type="text">,
 *       il faudrait prendre en compte les <textarea> et les <select>...
 */
function clearForm(selector)
{
	var inputs;

	// Récupération de tous les champs de formulaire du formulaire spécifié.
	inputs = document.querySelectorAll(selector + ' input[type=text]');

	for(var index = 0; index < inputs.length; index++)
	{
		/*
		 * Pour chaque champ de formulaire, on supprime le contenu de la propriété value,
		 * correspondant à l'attribut HTML value du champ de formulaire.
		 */
		inputs[index].value = null;
	}
}

function getFormFieldValue(formId, formFieldName)
{
	var form;
    var formField;

	form = document.getElementById(formId);

	/*
	 * Les objets DOM de formulaires ont une propriété elements qui elle-même
	 * a une méthode namedItem permettant de retrouver un objet DOM de champ
	 * de formulaire en fonction de son attribut HTML name.
	 */
	formField = form.elements.namedItem(formFieldName);

    /*
     * Une fois qu'on a obtenu l'objet DOM de champ de formulaire, on renvoie
     * sa propriété value, correspondant à l'attribut HTML value du champ de formulaire.
     */
    return formField.value;
}

function hideHtml(selector)
{
	// Ajout de la classe CSS hide sur l'objet DOM trouvé avec le sélecteur spécifié.
    document.querySelector(selector).classList.add('hide');
}

function installEventHandler(selector, event, eventHandler)
{
    var domObject;

    // Récupération du premier objet DOM correspondant au sélecteur.
    domObject = document.querySelector(selector);

    // Installation d'un gestionnaire d'évènement sur cet objet DOM.
    domObject.addEventListener(event, eventHandler);
}

function installEventHandlers(selector, event, eventHandler)
{
    var domObjects;

    // Récupération de tous les objets DOM correspondant au sélecteur.
    domObjects = document.querySelectorAll(selector);

    // Installation d'un gestionnaire d'évènement sur chaque objet DOM.
    for(var index = 0; index < domObjects.length; index++)
    {
        domObjects[index].addEventListener(event, eventHandler);
    }
}

function loadDataFromDomStorage(name)
{
	var jsonData;

	jsonData = window.localStorage.getItem(name);

	/*
	 * Donnée simple (chaîne) -> JSON parse (= désérialisation) -> Donnée complexe
	 *
	 * Voir ci-dessous pour plus d'explications sur le pourquoi du JSON.
	 */
	return JSON.parse(jsonData);
}

function saveDataToDomStorage(name, data)
{
	var jsonData;

	/*
	 * Le DOM storage ne permet pas de stocker des données complexes (objet, tableau...).
	 * On doit donc d'aborder sérialiser nos données dans un format simple, le JSON.
	 *
	 * On obtient une chaîne représentant l'objet complexe, et c'est cette chaîne que
	 * l'on stocke dans le DOM storage.
	 *
	 * Donnée complexe -> JSON stringify (= sérialisation) -> Donnée simple (chaîne)
	 */
	jsonData = JSON.stringify(data);

	window.localStorage.setItem(name, jsonData);
}

function showHtml(selector)
{
	// Suppression de la classe CSS hide de l'objet DOM trouvé avec le sélecteur spécifié.
	document.querySelector(selector).classList.remove('hide');
}