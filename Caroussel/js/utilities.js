/*******************************************************************************************/
/********************************** FONCTIONS UTILITAIRES **********************************/
/*******************************************************************************************/
function getRandomInteger(min, max)
{
    
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function installEventHandler(selector, event, eventHandler)
{
	var domObject;
	domObject = document.querySelector(selector);
	domObject.addEventListener(event, eventHandler);
}
