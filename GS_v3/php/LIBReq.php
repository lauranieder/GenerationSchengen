<?
$servername = "mysql1.web4all.fr";
$username = "126663_saerus";
$password = "Bu1604tw3157";
$dbname = "126663_lib";
// LOCAL
/*$servername = "localhost";
$username = "8889";
$password = "root";
$dbname = "root";*/
// Mysqli
//$conn = new mysqli($servername, $username, $password, $dbname);
//
//if(isset($_POST['action'])) {


$a = "On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et e n tout cas comparable avec celle du français standard.";
$b = "On sait depuis longtemps que travailler avec du texte lisible.";



	$items = array(
	    array(
	        'type' => 'type',
	        'photoLink' => 'photo link',
	        'audioLink' => 'audio link',
	        'text' => $b,
	    ),
	    array(
	        'kreuzberg',
	        'mur',
	        'mika akim',
	    ),
	    array(
	        1000,
	        5000,
	        13000,
	    ),
	);    
	echo json_encode($items);
//}
?>