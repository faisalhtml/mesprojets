//	Génère un nombre entier aléatoire compris entre « min » et « max » inclus
function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}





function deboguer()
{
	console.log('boxSize : ', boxSize);
	console.log('map : ', map);
	console.log('character : ', character);
	console.log('coin : ', coin);
	console.log('score : ', score);
}
