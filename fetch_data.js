var noodle = require('noodlejs');
var fs = require('fs');


// Testing
var url = "http://www.bbc.com/sport/football/39024318";
var domain = getDomain(url);
var getJson = "json/" + domain + ".json";
var content = {};
var jsonToReturn = {};
var domainTags;

fs.readFile(getJson, 'utf8', function (err, data) {
  if (err) throw err;
  domainTags = JSON.parse(data);
	getData(url, domainTags[domain].tagsRetrieval, 0)
	.then(function(){
		for (var property in content) {
	    if (content.hasOwnProperty(property)) {
	        jsonToReturn[property] = content[property][0].results;
	    }
		}
		console.log(jsonToReturn);
	});
});



// Get data from website html
function getData(url, tagInfo, index){
		return new Promise(function(resolve, reject){
			noodle.query({
				url: url,
				selector: tagInfo[index].tag,
				type: 'html',
				extract: 'text'
			}).then(function(data){
				content[tagInfo[index].fieldName] = data.results;
				if (tagInfo.length > index+1){
					getData(url, tagInfo, index+1)
						.then(function(){
							resolve();
						});
				} else {
					resolve();
				}
			}).catch(function(err){
				getData(url, tagInfo, index+1)
					.then(function(){
						resolve();
					});
			});
		});
}

// Get domain name from url string
function getDomain(url) {
	var startOfDomain;
	var endOfDomain;
	if (url.indexOf("www") !== -1) {
		startOfDomain = url.indexOf(".") + 1;
	} else {
		startOfDomain = url.indexOf("/") + 2;
	}
	endOfDomain = url.indexOf(".", startOfDomain);
	return url.substring(startOfDomain, endOfDomain);
}

