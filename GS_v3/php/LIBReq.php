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
	$items = array(
	    array(
	        'type' => 'type',
	        'photoLink' => 'photo link',
	        'audioLink' => 'audio link',
	        'text' => 'text',
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