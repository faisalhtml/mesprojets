<?php if(isset($_FILES['uploadedFile']) AND $_FILES['uploadedFile']['error'] == 0)
{
	if($_FILES['uploadedFile']['size'] <= 1000000)
	{
		$fileInformation = pathinfo($_FILES['uploadedFile']['name']);
		$fileExtension = $fileInformation['extension'];
		$autorisedExtension = ['jpg','jpeg','png'];
		if(in_array($fileExtension, $autorisedExtension))
		{
			if(in_array($fileExtension,['jpg','jpeg']))
			{
			$imageSource['ressource'] = imagecreatefromjpeg($_FILES['uploadedFile']['tmp_name']);
			}
			elseif($fileExtension == 'png')
			{
				$imageSource['ressource'] = imagecreatefrompng($_FILES['uploadedFile']['tmp_name']);
			}
			$tailles = getimagesize($_FILES['uploadedFile']['tmp_name']);
			$imageSource['largeur'] = $tailles[0];
			$imageSource['hauteur'] = $tailles[1];
			if($imageSource['largeur'] <= 100 AND $imageSource['hauteur'] <= 100)
			{
				$imageDestination['largeur'] = $imageSource['hauteur'];
				$imageDestination['hauteur'] = $imageSource['hauteur'];
			}
			else
			{
				$imageSource['ratio'] = $imageSource['largeur'] / $imageSource['hauteur'];
				if($imageSource['ratio'] > 1)
				{
					//largeur>hauteur
					$imageDestination['largeur'] = 100;
					$imageDestination['hauteur'] = round(100/$imageSource['ratio']);
				}

				else{
					//hauteur<=largeur
					$imageDestination['hauteur'] = 100;
					$imageDestination['largeur'] = round(100*$imageSource['ratio']);
				}
			}

			$imageDestination['ressource'] = imagecreatetruecolor($imageDestination['largeur'], $imageDestination['hauteur']);
			imagecopyresampled($imageDestination['ressource'], $imageSource['ressource'], 0, 0, 0, 0, $imageDestination['largeur'], $imageDestination['hauteur'], $imageSource['largeur'], $imageSource['hauteur']);
			if(in_array($fileExtension, ['jpg', 'jpeg']))
				{
					imagejpeg($imageDestination['ressource'], 'uploads/thumbnails/'.$fileInformation['basename'], 90);
					imagejpeg($imageSource['ressource'], 'uploads/'.$fileInformation['basename'], 90);
				}
				else
				{
					imagepng($imageDestination['ressource'], 'uploads/thumbnails/'.$fileInformation['basename'], 7);
					imagepng($imageSource['ressource'], 'uploads/'.$fileInformation['basename'], 7);
				}
			move_uploaded_file($_FILES['uploadedFile']['tmp_name'], 'uploads/'.$fileInformation['basename']);
		}
	}
}?>
<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="UTF-8">
		<title>Envoi de fichiers et redimensionnement d'image</title>
	</head>
	<body>
		<form action="index.php" method="POST" enctype="multipart/form-data" >
			<input type="file" name="uploadedFile" />
			<input type="submit" value="Envoyer" />
		</form>
	</body>
</html>





