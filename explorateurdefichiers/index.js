$(function()
    {
    // On commence par cacher tous les sous dossiers
    $('ul ul').hide();
 
    // Lors du click du un dossier
    $('li.dossier span').on('click', function(evenement)
    {
        $(this).closest('li').children('ul').toggle();
        console.log(evenement);
    });
    
        // Si le dossier n'est pas ouvert on l'ouvre, sinon, on le ferme
        
    });
 
    // Lors du click sur un fichier
    
        // On lance le téléchargement du fichier
        
 


