<?php
	
	function creerArborescenceHTML($cheminDossier)
	{
		$cheminDossier = rtrim($cheminDossier);

		$ressources = array_diff(scandir($cheminDossier), ['.', '..']);

		$arborescenceHTML = '<ul>';

		foreach($ressources as $ressource)
		{
			if(is_dir($cheminDossier.'/'.$ressource))
			{
				$arborescenceHTML .= '<li class="dossier">';
				$arborescenceHTML .= '<span>'.$ressource.'</span>';
				$arborescenceHTML .= creerArborescenceHTML($cheminDossier.'/'.$ressource);
				$arborescenceHTML .= '</li>';
			}
			else
			{
				$arborescenceHTML .= '<li class="fichier"><span>';
				$arborescenceHTML .= $ressource;
				$arborescenceHTML .= '</span></li>';
			}
		}

		$arborescenceHTML .= '</ul>';

		return $arborescenceHTML;
	}

	$arborescenceHTML = creerArborescenceHTML($_SERVER['DOCUMENT_ROOT']);

	include 'vue.phtml';
?>
