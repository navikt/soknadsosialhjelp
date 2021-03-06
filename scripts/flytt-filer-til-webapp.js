var fsextra = require("fs-extra");
var fs = require("fs");
const path = require("path");

function copyFile(srcFile, outFile) {
	fsextra.copy(srcFile.join(path.sep), outFile.join(path.sep), function(err) {
		if (err) {
			console.log(srcFile);
			return console.error(err);
		} else {
			console.log("Kopiert " + srcFile + " til: " + outFile);
		}
	});
}

function kopierSVG() {
	const bildefolder = [".", "build", "soknadsosialhjelp", "statisk", "bilder"];

	fs.readdir(bildefolder.join(path.sep), function(err, files) {
		var mainFile = files[0];
		files.forEach(function(filename) {
			const srcFile = bildefolder.slice();
			srcFile.push(filename);
			const outFile = ["..", "main", "resources", "webapp", "statisk", "bilder", filename];
			copyFile(srcFile, outFile);
		});
	});
}


function kopierRessurs(mainFile, folder) {
	var newFile = mainFile.split(".")
		// .filter((value) => { return value != "chunk" })
		.join(".");
	var srcFile = [".", "build", "static", folder, mainFile];
	var outFile = [
		"..",
		"main",
		"resources",
		"webapp",
		"statisk",
		folder,
		newFile
	];
	fsextra.copy(srcFile.join(path.sep), outFile.join(path.sep), function (
		err
	) {
		if (err) {
			console.log("build/static/" + folder + "/" + mainFile);
			return console.error(err);
		} else {
			console.log(
				"Kopiert " +
				"build/static/" +
				folder +
				"/" +
				mainFile +
				" til: " +
				"../main/resources/webapp/statisk/" +
				folder +
				"/" +
				newFile
			);
		}
	});
}

function kopierStatisk() {
	const mainFolder = [".", "build", "static"];
	fs.readdir(mainFolder.join(path.sep), function(err, folders) {
		folders.forEach(function(folder) {
			var dir = [".", "build", "static", folder];

			fs.readdir(dir.join(path.sep), function(err, files) {
				files.forEach( (file) => {
					kopierRessurs(file, folder)
				});
				// kopierRessurs(files[0], folder);
				// kopierRessurs(files[2], folder);
			});
		});
	});
}

kopierStatisk();
kopierSVG();
