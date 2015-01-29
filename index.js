var request = require("request"),
	utils = require("./lib/utils");

// Create module object and export.
var fpaste = module.exports = {};

fpaste.HOST = "http://fpaste.org/";

/**
 * Post to fpaste
 * @param  {Object|String}  opts	String of content or object of params.
 * @param  {Function} 		cb   	Calback
 */
fpaste.post = function(opts, cb){
	// Allow content string to be used instead of object
	if(typeof opts === "string")
		opts = {data: opts};

	// Query object with defaults params
	var query = {
		uri: fpaste.HOST,
		form: {
			paste_lang: "text",
			api_submit: true,
			mode: "json"
		}
	};

	// For each key in opts, replace default or add value.
	// Prepending "paste_" to each key is fpaste API convention.
	for(var key in opts)
		if(opts[key] !== null)
			query.form["paste_" + key] = opts[key];

	// In the fpaste API post_private accepts "yes" or "no" rather
	// than true or false. This module accepts true and false instead
	// for consistency so we have to convert it.
	var private = query.form.paste_private;
	if(private !== null)
		query.form.paste_private = private ? "yes" : "no";

	request.post(query, function(err, res, body){
		var obj = JSON.parse(body);
		err = utils.handleErrors(err, obj);
		cb(err, obj);
	});
}

/**
 * Get content from fpaste by ID.
 * @param  {String|Int|Object}  opts	String or int of ID, or object of params.
 * @param  {Function} 			cb   	Callback
 */
fpaste.get = function(opts, cb){
	// If it's not an object, use opts as ID
	if(opts !== Object(opts))
		opts = {id: opts};

	// fpaste's URL format API is simpler
	var url = fpaste.HOST + "api/json/" + opts.id + "/";
	if(opts.hash){
		url += opts.hash + "/";
		if(opts.password) url += opts.password;
	}

	request(url, function(err, res, body){
		// fpaste files with tabs and multiline strings need to be escaped.
		// Only applies to fpaste#get responses.
		var obj = utils.escapeAndParseJSON(body);
		err = utils.handleErrors(err, obj);
		cb(err, obj);
	});
}

/**
 * List recent content from fpaste. Defaults to public posts.
 * @param  {Int|Object}   	opts	Page number of object of params.
 * @param  {Function}		cb   	Callback
 */
fpaste.list = function(opts, cb){
	// If opts isn't provided, default to page 1
	if(arguments.length === 1){
		cb = opts;
		opts = 1;
	}

	// Convenience. Accepts opts as a page number
	// instead of an object
	if(typeof opts === "number")
		opts = {page: opts};

	var url = fpaste.HOST;
	if(opts.project) url += "~" + opts.project + "/";
	url += "api/json/all/";
	if(opts.page) url += opts.page;

	request(url, function(err, res, body){
		var obj = JSON.parse(body);
		err = utils.handleErrors(err, obj);

		// Pastes are returned in an object, so convert to array
		var pastesObj = obj.result.pastes,
			pastesArr = [];

		for(var key in pastesObj){
			pastesArr.push({
				name: key,
				id: pastesObj[key]
			});
		}

		obj.result.pastes = pastesArr;

		cb(err, obj);
	});
}