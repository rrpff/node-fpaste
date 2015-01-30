#!/usr/bin/env node

// Parse process.argv
var argv = require("yargs")
	.alias("f", "file")
	.alias("u", "user")
	.alias("p", "password")
	.alias("h", "hash")
	.alias("e", "expire")
	.alias("i", "id")
	.alias("v", "verbose")
	.argv;

// Import utils
var fs = require("fs"),
	Path = require("path"),
	detectLang = require("language-detect"),
	async = require("async");

// ...and the fpaste module.
var fpaste = require("../");

// Create handler object
// Export for sake of it, may be useful
var CLI = module.exports = {
	// Get post from fpaste.org
	get: function(){

		var opts = {id: argv.id};
		// Include auth if passed
		if(argv.hash) opts.hash = argv.hash;
		if(argv.password) opts.password = argv.password;

		// Get data from fpaste
		fpaste.get(opts, function(err, res){
			console.log(!argv.verbose && res.result ? res.result.data : res);
		});

	},
	// Post file to fpaste.org
	post: function(){

		// Relevant post values
		var values = ["user", "password", "private", "project", "expire"];
		// Options object
		var opts = {};

		// Add any relevant values to opts
		for(var key in argv)
			if(argv[key] && values.indexOf(key) > -1)
				opts[key] = argv[key];

		// Mark as private if password provided
		if(opts.password) opts.private = true;

		// Create relative file path
		var fpath = Path.resolve(process.cwd(), (argv.file || argv._[0]));

		// Get language and contents of file
		async.parallel({
			language: function(cb){
				detectLang(fpath, cb);
			},
			contents: function(cb){
				fs.readFile(fpath, cb);
			}
		}, function(err, results){
			if(err) throw err;

			// File language from language-detect
			opts.lang = results.language;
			// Data buffer from fs.readFile
			opts.data = results.contents;

			fpaste.post(opts, function(err, data){
				if(err) throw err;
				// Pass response if verbose passed, or just the URL if not.
				console.log(argv.verbose ? data : data.result.url);
			});
		});

	}
}

// Call the relevant CLI option.
// Assume a GET operation if ID is present.
CLI[argv.id ? "get" : "post"]();
process.title = "fpaste";