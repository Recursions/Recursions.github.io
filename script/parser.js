var apiKey = "&api_key=lnpVL48QKRvh2kyG4IpDzgCqv5cJQVU8pPsRKMLP";
var urlRef = "https://api.nal.usda.gov/ndb/search/?format=json&q=";
var urlRef2= "https://api.nal.usda.gov/ndb/nutrients/?format=json" + apiKey + "&nutrients=205&nutrients=203&nutrients=204&nutrients=208&nutrients=221&nutrients=601&nutrients=291&nutrients=269&nutrients=268"; 
var sortByName = (sort) => "&sort=" + sort;
var displayN = (num) => "&max=" + num;
var offsetData = (num) => "&offset=" + num;

var result = {}; // stores the search result 
var tmp; // use for testing, temporary variable
var showN = 25;
var page = 0;
var stringResult;
var nutrition = {};
var stringNutrition;
var basket = {};


function search() {
    if (event.keyCode == 13) {

		var url = urlRef + document.getElementById("searchBar").value + sortByName(document.getElementById("sortID").value) + displayN(showN) + offsetData(page) + apiKey;
		console.log(url);
		$.getJSON(url, function(data) {
			console.log(data);
			tmp = data.list;

			result['total'] = data.list.total;
			result['start'] = page; // page is used because data.list.start will always be 0
			result['end'] = data.list.end + page; // data.list.end is the length of the dataset + page will produce the offset
			result['sort'] = data.list.sort;

			result['item'] = [];
			for (var i in data.list.item) {
				result['item'].push({
					offset: data.list.item[i].offset,
					group: data.list.item[i].group,
					name: data.list.item[i].name,
					ndbno: data.list.item[i].ndbno
				});
			}

		})
		.done(function() {
			console.log("Successful");
			// display more buttons if there are more values
			stringResult = "<ul class='table-view'>";

			// handlebars
			for (var i in result['item']) {
				console.log(result['item'][i]['ndbno']);
				stringResult += "<li class='table-view-cell' id=" + result['item'][i]['ndbno'] + "><a class='navigate-right' onclick='test(this.parentElement.id)'>" + result['item'][i]['name'].substring(0, result['item'][i]['name'].indexOf(',')) + "</a></li>";
			}
			document.getElementById("results").innerHTML = stringResult + "</ul>";

		})
		.fail(function() {
			console.log("Failed");
		})
		.always(function() {
			console.log("Final Check");
		});
	}
}


function test(id) {
	console.log(id);
	var url = urlRef2 + "&ndbno=" + id; 
	console.log(url);
	$.getJSON(url, function(data){
		console.log(data);
		tmp = data;
		nutrition['item'] = [];
		for (var i in data.report.foods) {
			nutrition['item'].push({
				name: data.report.foods[i].name,
				ndbno: data.report.foods[i].ndbno,
				weight: data.report.foods[i].weight,
				measure: data.report.foods[i].measure,
				nutrients: []
			});
			for (var j in data.report.foods[i].nutrients) {
				nutrition['item'][i]['nutrients'].push({
					id: data.report.foods[i].nutrients[j].nutrient_id,
					nutrient: data.report.foods[i].nutrients[j].nutrient,
					unit: data.report.foods[i].nutrients[j].unit,
					gm: data.report.foods[i].nutrients[j].gm,
					value: data.report.foods[i].nutrients[j].value
				});	
			}
		}
	})
	.done(function() {

		stringNutrition = "<div style = 'cotext-align: center'><span >Add to Cart<\span><span class='icon icon-check'></span><span>Remove from Cart<\span><span class='icon icon-close'></span></div><ul class='table-view'>";
		for (var i in nutrition['item']) {
			stringNutrition += "<li class='table-view-cell media'><a class='navigate-right'><div class='media-body'>" + nutrition['item'][i]['name'].substring(0, nutrition['item'][i]['name'].indexOf(',') ) + "<br>" + nutrition['item'][i]['measure'] + "<p>";
			for (var j in nutrition['item'][i]['nutrients']) {
				stringNutrition += nutrition['item'][i]['nutrients'][j]['nutrient'] + ": " + nutrition['item'][i]['nutrients'][j]['gm'] + " " + nutrition['item'][i]['nutrients'][j]['unit'] + "<br>";
				// if (nutrition['item'][i]['nutrients'][j]['gm'] == "--") {
				// 	console.log(i + ":" + j + ":" + k);
				// 	continue;
				// }else {
				// 	console.log(i + ":" + j + ":" + k);
				// 	stringNutrition += nutrition['item'][i]['nutrients'][j]['nutrient'] + ": " + nutrition['item'][i]['nutrients'][j]['gm'] + " " + nutrition['item'][i]['nutrients'][j]['unit'];
				// }
			}
			stringNutrition += "</p></div></a><li>";
		}
		document.getElementById("results").innerHTML = stringNutrition + "</ul>";
		document.getElementById("backBtn").innerHTML = "<button class='btn pull-left' onclick='backBtn()'>Back</button>"

	})
	.fail(function() {
		console.log("Failed");
	})
	.always(function() {
		console.log("Final Check");
	});

}


function backBtn() {
	document.getElementById("results").innerHTML = stringResult;
	document.getElementById("backBtn").innerHTML = "";
}
