var noodle = require('noodlejs');
var fs = require('fs');

var url = "https://www.washingtonpost.com/powerpost/trump-we-must-fight-hard-line-conservative-freedom-caucus-in-2018-midterm-elections/2017/03/30/56783e38-154e-11e7-ada0-1489b735b3a3_story.html?hpid=hp_hp-top-table-main_gopcivilwar-940a%3Ahomepage%2Fstory&utm_term=.bae2c3a752f9";
var getDomainsJson = "json/supportedDomains.json";
var domain = getDomain(url);

// Extract domain name from url
function getDomain(url) {
  var domains = JSON.parse(fs.readFileSync(getDomainsJson, 'utf8'));
  for (var i = 0; i < domains.supportedDomains.length; i++) {
    if (url.indexOf(domains.supportedDomains[i]) !== -1) {
      return domains.supportedDomains[i];
    }
  }
}

// Get tags from corresponding json file
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
        var uniqueResults = unique(content[property][0].results);
        jsonToReturn[property] = uniqueResults;
	    }
		}
		console.log(jsonToReturn);
	});
});

// Get data from website html
function getData(url, tagInfo, index) {
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

// Remove duplicates in results arrays
function unique(arr) {
  if (arr.length !== new Set(arr).size) {
    var seen = {};
    return arr.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  } else {
    return arr;
  }
}


