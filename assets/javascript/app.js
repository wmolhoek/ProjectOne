$(document).ready(function () {

    // <!-- https://api.nal.usda.gov/ndb/search/?format=json&q=butter&sort=n&max=25&offset=0&api_key=DEMO_KEY -->

    var searchList = [];

    // Click handler for the Search Button
    $("#run-search").on("click", function (event) {
        console.log("clicked search");
        event.preventDefault();
        $('#warn').empty();
        userSearchTerm = $("#search-term").val().trim();
        userSearchTermSpacer = encodeURIComponent(userSearchTerm);
        foodSearchAjax(userSearchTermSpacer);
    });



    // AJAX request to the USDA Search
    var foodSearchAjax = function (input) {
        if (!input) {
            console.log("false");
            return false;
        }
        searchList.push(input);
        console.log("searchList: ", searchList);
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + input + "&max=10&offset=0" + "&api_key=" + APIKEY;
        console.log("foodSearchAjax queryURL: ", queryURL);
        // AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response;
                console.log("foodSearchAjax results:", results);
                displayFoodSearchResults(results);
            });
    };

    var displayFoodSearchResults = function (x) {
        $('.jumbowrap').hide();        
        var displayDiv = $('#food-search-results');
        displayDiv.empty();
        var resultsInfo = $('<div>');
        resultsInfo.attr("id", "results-div");
        resultsInfo.html("<span>Results 1 - 10</span>");
        displayDiv.append(resultsInfo);
        for (var i = 0; i < x.list.item.length; i++) {
            var foodName = x.list.item[i].name;
            var foodId = x.list.item[i].ndbno;
            var button = $('<button class="search-wrapper">');
            button.text(foodName);
            button.attr("value", foodId);
            button.attr("data-toggle", "off-initial");
            var buttonParentDiv = $("<div>");
            buttonParentDiv.attr("data-id", foodId);
            buttonParentDiv.append(button);
            displayDiv.append(buttonParentDiv);
        }
    };

    $('#food-search-results').on('click', 'button', function (event) {
        console.log("button clicked");
        var buttonParentDiv = $(this).parent();
        var foodNumber = $(this).attr("value");
        var dataToggleState = $(this).attr("data-toggle");
        if (dataToggleState === "off") {
            $("table#" + foodNumber).show();
            $(this).attr("data-toggle", "on");
        } else if (dataToggleState === "on") {
            $("table#" + foodNumber).hide();
            $(this).attr("data-toggle", "off");
        } else {
            foodReportAjax(foodNumber, buttonParentDiv);
            $(this).attr("data-toggle", "on");
        };
        
    });

    // $( "li.item-ii" ).find( "table" ).hide();






    // AJAX request to the USDA Report
    var foodReportAjax = function (foodNumber, buttonParentDiv) {
        if (!foodNumber) {
            console.log("false");
            return false;
        }
        // https://api.nal.usda.gov/ndb/V2/reports?ndbno=01009&ndbno=01009&ndbno=45202763&ndbno=35193&type=b&format=json&api_key=DEMO_KEY
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + foodNumber + "&format=json&q=" + "&max=5&offset=0&type=f" + "&api_key=" + APIKEY;
        console.log("foodReportAjax queryURL: ", queryURL);
        // AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response;
                console.log("foodReportAjax results:", results);
                displayFoodReportResults(results, foodNumber, buttonParentDiv);
            });
    };

    var displayFoodReportResults = function (results, foodNumber, buttonParentDiv) {
        console.log("here");
        // var displayDiv = $('#food-report-results');
        var reportWrapTable = $("<table class='report-wrapper'></table>");
        reportWrapTable.attr("id", foodNumber);

        var foodId = results.foods[0].food.desc.ndbno;
        var foodIdRow = $('<tr>');
        foodIdRow.html("<td class='data-heading-col'>Title:</td>" + "<td class='data-col'>" + foodId + "</td></tr>");
        reportWrapTable.append(foodIdRow);
        
        var foodName = results.foods[0].food.ing.desc;
        var foodNameRow = $('<tr>');
        foodNameRow.html("<td class='data-heading-col'>Name:</td>" + "<td class='data-col'>" + foodName + "</td></tr></table>");        
        reportWrapTable.append(foodNameRow);

        var manuName = results.foods[0].food.desc.manu;
        var manuNameRow = $('<tr>');
        manuNameRow.html("<td class='data-heading-col'>Manufacturer:</td>" + "<td class='data-col'>" + manuName + "</td></tr></table>");        
        reportWrapTable.append(manuNameRow);

        var nutrientsRows = function () {         
            for (var i = 0; i < results.foods[0].food.nutrients.length; i++) {
                var title = results.foods[0].food.nutrients[i].name;
                var value = results.foods[0].food.nutrients[i].value;
                var nutrientRow = $('<tr>');
                nutrientRow.html("<td class='data-heading-col'>" + title + ":</td>" + "<td class='data-col'>" + value + "</td></tr>");
                reportWrapTable.append(nutrientRow);
            }
        }
        nutrientsRows();
        buttonParentDiv.append(reportWrapTable);
    };




    // Initialize function
    var init = function () {
        console.log("---- hi init ----");
        $('.jumbowrap').show();
        foodSearchAjax();
    };
    // Start the 'app'
    init();

});