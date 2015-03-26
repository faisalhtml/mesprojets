/***************************************************************************************/
/***************************** DONNEES CARNET D'ADRESSES *******************************/
/***************************************************************************************/

const DOM_STORAGE_ITEM_NAME = 'Address Book';



/***************************************************************************************/
/**************************** EVENEMENTS CARNET D'ADRESSES *****************************/
/***************************************************************************************/

function onClickAddContact()
{
    // Effacement du contenu du formulaire.
    clearForm('#js-contact-form');

    // Mise à jour de l'affichage.
    showHtml('#js-contact-form');
}

function onClickClearAddressBook()
{
    // Sauvegarde d'un carnet d'adresse vide, écrasant le carnet d'adresse existant.
    saveAddressBook(new Array());

    // Mise à jour de l'affichage.
    hideHtml('#js-contact-details');
    refreshAddressBook();
}

function onClickSaveContact()
{
    var addressBook;
    var contact;

    // Création d'un objet contact avec les données du formulaire.
    contact = createContact
    (
        getFormFieldValue('js-contact-form', 'title'),
        getFormFieldValue('js-contact-form', 'firstName'),
        getFormFieldValue('js-contact-form', 'lastName'),
        getFormFieldValue('js-contact-form', 'phone')
    );

    /*
     * Le carnet d'adresses est un tableau d'objets.
     *
     * 1. Chargement du carnet d'adresses
     * 2. Ajout du contact à la fin,
     *    le carnet d'adresses est considéré comme une pile de contacts
     * 3. Sauvegarde du carnet d'adresses avec le nouveau contact
     */
    addressBook = loadAddressBook();
    addressBook.push(contact);
    saveAddressBook(addressBook);

    // Mise à jour de l'affichage.
    hideHtml('#js-contact-form');
    refreshAddressBook();

    /*
     * L'évènement submit de formulaire ne doit pas s'exécuter.
     *
     * Le fait de retourner false dans un gestionnaire d'évènements permet
     * d'interrompre l'évènement dans le navigateur, qu'il n'y ait rien d'autre
     * qui s'exécute.
     */
    return false;
}

function onClickShowContactDetails()
{
    var addressBook;
    var contact;
    var contactElement;
    var index;

    /*
     * this = objet DOM qui a déclenché l'évènement,
     *        ici il s'agit donc de l'un des hyperliens généré dans refreshAddressBook()
     *
     * La propriété dataset des objets DOM permet de récupérer les attributs HTML
     * data-xxx : data-machin = dataset.machin.
     *
     * Les hyperliens générés dans refreshAddressBook() ont un attribut HTML data-index
     * donc cela donne dataset.index.
     */
    index = this.dataset.index;

    // Chargement du carnet d'adresses puis récupération du contact sur lequel on a cliqué.
    addressBook = loadAddressBook();
    contact     = addressBook[index];

    // Affichage HTML des données du contact, avec un hyperlien permettant son édition.
    contactElement            = document.getElementById('js-contact-details');
    contactElement.innerHTML  = '<h3>' + contact.title + ' ' + contact.firstName + ' ' + contact.lastName + '</h3>';
    contactElement.innerHTML += '<p>' + contact.phone + '</p>';

    // Mise à jour de l'affichage.
    showHtml('#js-contact-details');
}



/***************************************************************************************/
/***************************** FONCTIONS CARNET D'ADRESSES *****************************/
/***************************************************************************************/

function createContact(title, firstName, lastName, phone)
{
	var contact;

	contact           = new Object();
	contact.firstName = firstName;
	contact.lastName  = lastName.toUpperCase();
	contact.phone     = phone;

	switch(title)
	{
		case 'madam':
		contact.title = 'Mme.';
		break;

		case 'miss':
		contact.title = 'Mlle.';
		break;

		case 'mister':
		contact.title = 'M.';
		break;
	}

	return contact;
}

function loadAddressBook()
{
	var addressBook;

	// Chargement du carnet d'adresses depuis le DOM storage.
	addressBook = loadDataFromDomStorage(DOM_STORAGE_ITEM_NAME);

	// Est-ce qu'il n'y avait aucune donnée dans le DOM storage ?
	if(addressBook == null)
	{
		// Oui, création d'un carnet d'adresses vide.
		addressBook = new Array();
	}

	return addressBook;
}

function refreshAddressBook()
{
    var addressBook;
	var addressBookElement;

	addressBook = loadAddressBook();

	// Suppression de l'ensemble du carnet d'adresses HTML.
	addressBookElement           = document.getElementById('js-address-book');
	addressBookElement.innerHTML = null;

	// Affichage HTML du carnet d'adresses, un contact à la fois.
	for(var index = 0; index < addressBook.length; index++)
	{
		// Chaque contact est un hyperlien entouré d'une balise HTML <li>.
		addressBookElement.innerHTML +=
			'<li>' +
				'<a data-index="' + index + '" href="#">' + 
					addressBook[index].firstName + ' ' + 
					addressBook[index].lastName + 
				'</a>' +
			'</li>';
	}

	// Installation d'un gestionnaire d'évènement sur chaque hyperlien.
    installEventHandlers('#js-address-book a', 'click', onClickShowContactDetails);
}

function saveAddressBook(addressBook)
{
	// Enregistrement du carnet d'adresses dans le DOM storage.
	saveDataToDomStorage(DOM_STORAGE_ITEM_NAME, addressBook);
}



/************************************************************************************/
/********************************** CODE PRINCIPAL **********************************/
/************************************************************************************/

/*
 * Installation d'un gestionnaire d'évènement déclenché quand l'arbre DOM sera
 * totalement construit par le navigateur.
 *
 * Le gestionnaire d'évènement est une fonction anonyme que l'on donne en deuxième
 * argument directement à document.addEventListener().
 */
document.addEventListener('DOMContentLoaded', function()
{
    // Installation des gestionnaires d'évènements.
    installEventHandler('#js-add-contact', 'click', onClickAddContact);
    installEventHandler('#js-clear-address-book', 'click', onClickClearAddressBook);
    installEventHandler('#js-save-contact', 'click', onClickSaveContact);

    // Affichage initial du carnet d'adresses.
    refreshAddressBook();
});