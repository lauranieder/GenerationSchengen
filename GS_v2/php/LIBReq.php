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
	        'Item' => 'a',
	        'Store' => 'b',
	        'Size' => 'c',
	        'Price' => 'd',
	    ),
	    array(
	        'Item' => 'e',
	        'Store' => 'f',
	        'Size' => 'g',
	        'Price' => 'h',
	    ),
	);    
	echo json_encode($items);
//}
?>