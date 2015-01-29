require("chai").should();

var fpaste = require("../");

describe("#post", function(){

	// #post is a little difficult to test as fpaste has spam prevention.
	// Plus when expiry isn't provided (as in this example) it defaults to never,
	// so best not to fill up their servers. The following worked at initial release:

	// it("should accept a string as the first parameter", function(done){
	// 	fpaste.post("Testing testing 123", function(err, body){
	// 		body.should.be.a("object");
	// 		body.id.should.be.a("string");
	// 		console.log(body);
	// 		done();
	// 	});
	// });

	it("should return an object containing an id", function(done){
		fpaste.post({
			expire: 10,
			data: "test"
		}, function(err, res){
			res.should.be.a("object");
			res.result.id.should.be.a("string");
			done();
		});
	});

});

describe("#get", function(){

	it("should take an id and pass post data to the callback", function(done){
		fpaste.get("176968", function(err, res){
			res.should.be.a("object");
			res.result.data.should.be.a("string");
			done();
		});
	});

});

describe("#list", function(){

	it("should allow options to be omitted", function(done){
		fpaste.list(function(err, res){
			res.should.be.a("object");
			res.result.pastes.should.be.a("array");
			done();
		});
	});

	it("should return pastes for the specified page", function(done){
		fpaste.list(5, function(err, res){
			// Unfortunately page number isn't returned from the fpaste API
			// So just perform generic tests
			res.should.be.a("object");
			res.result.pastes.should.be.a("array");
			done();
		});
	});

});