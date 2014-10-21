/////////////////
//             //
//   made by   //
//             //
// fragment.in //
//             //
//      !      //
//             //
/////////////////

/*define('DB_NAME', '126663_saerus_wp');
define('DB_USER', '126663_saerus');
define('DB_PASSWORD', 'Bu1604tw3157');
define('DB_HOST', 'mysql1.web4all.fr');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');*/
//
function getContent() {
	var jqxhrAbout = $.ajax({
		type: 'GET',
		url: ajaxurl,
		data: {"action": "get_about", "page_id": num},
	})
	.done(function(result) {
		//alert("got about");
		$("#about").html(result);
		initAbout();
	})
	.fail(function() {
		$("#aboutDisp").html(errorMessage);
	})
	.always(function() {
		blockClick = 0;
	});
}