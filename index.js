var cheerio = require('cheerio');
var gutil = require('gulp-util');
var through = require('through2');
var PluginError = gutil.PluginError;
var fs = require('fs');

// Consts
const PLUGIN_NAME = 'gulp-inject-target';

module.exports = function(args) {
	var target = args.target
	var selector = args.selector

	/**
	 * add content to target
	 * @param  {string}   content     [content to be appended]
	 */
	var prepFile = function(content, callback){
		fileContent =  fs.readFileSync(target, {
			encoding: 'utf-8'
		});
		var targetDOM = cheerio.load(fileContent);
		
		// repalce content with data
		targetDOM(selector).html(content);
		return targetDOM.html();
	}

	/**
	 * rewite target file
	 */
	var rewriteFile = function (newContet){
		
		try{
			fs.writeFileSync(target, newContet, {
				flag: 'w'
			});

			return true;
		} catch(error) {
			throw new PluginError(PLUGIN_NAME, error.message);
			return false;
		}
	}

	return through.obj(function(file, encoding, callback) {
		if (file.isNull()) {
			// nothing to do
			return callback(null, file);
		}

		//Data to be added
		var dataToAppend = file.contents.toString('utf8');
		var newContet = prepFile(dataToAppend);
		
		if( rewriteFile(newContet) ){
			return callback();
		}
	});
};