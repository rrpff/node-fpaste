// Escape newlines, return carriages and tabs in JSON response.
// JSON.parse is too strict for fpaste. 
exports.escapeAndParseJSON = function(json){
	var escaped = json
		.replace(/\r\n/g, "\\n") // Replace newlines
		.replace(/\t/g, "\\t"); // Replace tabs
	return JSON.parse(escaped);
}

// fpaste errors are returned in the result object, so extract them.
// If the fpaste response is not present, assume any errors are from request.
exports.handleErrors = function(err, obj){
	return obj && obj.result && obj.result.error
		? "Error: " + obj.result.error
		: err;
}