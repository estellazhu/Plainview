var noodle = require('noodlejs');

var domainTags = {
	"abcnews": {
		'tagsRetrieval': [
			{"tag" : "p", "fieldName": "content"},
			{"tag" : "div.author", "fieldName": "author"},
			{"tag" : "span.timestamp", "fieldName": "date"}
 		],
		'url' : 'http://www.abcnews.com'
	},
	"bbc" : {
		'tagsRetrieval': [
			{"tag" : "p", "fieldName": "content"},
			{"tag" : "div.byline", "fieldName": "author"},
			{"tag" : "div.date--v2", "fieldName": "date"}
		]
	}
}

// Testing
var url = "http://abcnews.go.com/International/wireStory/official-mexico-rejected-us-plan-3rd-country-deportees-45712867?cid=clicksource_4380645_1_hero_headlines_headlines_hed";
var domain = getDomain(url);
var content = {};
var jsonToReturn = {};

getData(url, domainTags[domain].tagsRetrieval, 0)
.then(function(){
	for (var property in content) {
    if (content.hasOwnProperty(property)) {
        jsonToReturn[property] = content[property][0].results;
    }
	}
	console.log(jsonToReturn);
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
				getData(url, tagInfo, index+1);
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
