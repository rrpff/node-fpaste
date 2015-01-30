# node-fpaste

Simple node utility for the RESTful [`fpaste.org`](http://fpaste.org) API.
Simplifies public, private and password-protected posts and gets.
Includes a [CLI](#cli).

Note: fpaste rate limits to prevent spam.

## Installation
For use in a project:

```js
$ npm install --save fpaste
var fpaste = require("fpaste");
```

For use on the command line:

```
$ npm install -g fpaste
```

## API

### Basic usage
Require it in your project:

```js
var fpaste = require("fpaste");
```

Make a paste:

```js
fpaste.post("This is my paste", function(err, res){
	console.log(res.url);
	// => http://fpaste.org/123456
});
```

Retrieve a paste:

```js
fpaste.get(123456, function(err, res){
	console.log(res.result.data);
	// => "This is my paste"
});
```

List recent public pastes:

```js
fpaste.list(function(err, res){
	console.log(res.result.pastes);
	// => [{"name": "paste_1", id: "123456"}...]
});
```

### `#post(options, cb)`
Options can be a data string or an options object.
Options:
- `data`: String. Content of paste. Required.
- `lang`: String. Language of data. Defaults to "text".
- `user`: String. Username to use. Doesn't require registration. Defaults to "Anonymous".
- `password`: String. Password protect a paste. Doesn't require registration.
- `private`: Boolean. Mark as private. If password is provided, this is set by default.
- `expire`: Number. Time in seconds after which paste will be deleted. Defaults to 0, meaning don't delete.
- `project`: Name of project to associate it with.

### `#get(options, cb)`
Options can be an ID (string or int) or an options object.
Options:
- `id`: Id of paste to retrieve. Required.
- `hash`: Hash of paste, if paste is private.
- `password`: Password if required.

### `#list([options], cb)`
Options can be a page number, an options object, or left out.
Options:
- `page`: Page number. Defaults to 1.
- `project`: Specify if you want a project list. If null, list will be for all public pastes.

## CLI
Installation:

```
$ npm install -g fpaste
```

`fpaste` commands return the full `fpaste.org` response if the `-v / --verbose` flag if used.

## Basic example usage
Uploading a file:

```
$ fpaste example.md
```

The above echo's an URL, so piping it straight to the clipboard is useful.

```
$ fpaste example.md | clip	# Windows
$ fpaste example.md | xclip		# Linux
$ fpaste example.md | pbcopy	# OSX
```

Getting a paste's contents:

```
$ fpaste -i 123456
```

### Posting to fpaste
Upload a file by relative path.
```
$ fpaste {filepath}
```

Flags:
- `-f / --file`: Specify file path more verbosely.
- `-e / --expire`: Paste expiry in seconds.
- `-u / --user`: Username. Doesn't require registration. Defaults to "Anonymous".
- `-p / --password`: Password. Doesn't require registration.
- `--private`: Private. Set by default if password is supplied.
- `--project`: Project name to associate paste with.

### Retrieving a paste
Retrive a post by ID.
```
$ fpaste -i {id}
```

Flags:
- `-i / --id`: ID of paste to retrieve. Required.
- `-h / --hash`: Hash of paste if private.
- `-p / --password`: Password of paste if required.

## License
MIT licensed. Written by me, Richard Foster. Do what you like with it.
Thanks to Fedora!