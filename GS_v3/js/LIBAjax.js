/////////////////
//             //
//   made by   //
//             //
// fragment.in //
//             //
//      !      //
//             //
/////////////////

// --------------- AJAX
function getContent() {
	var jqxhrContent = $.ajax({
		type: 'GET',
		url: "../php/LIBReq.php",
		data: {"action": "getText"},
		//contentType: "application/json;charset=utf-8",
 		dataType: "json",
	})
	.done(function(result) {
		alert(result);
	})
	.fail(function() {
		alert("fails");
	})
	.always(function() {
		//
	});
}
//getContent();