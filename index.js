/* function check connection device by cordova API*/
document.addEventListener("offline", onOffline, false);

function onOffline() {

    navigator.notification.alert(" You are offline! \n Check your data connection!");
    $("#iconcamera").hide();
    $("#iconalbum").hide();
    $("#analysis").hide();
    $("#outimage").hide();
    $("#Page2").hide();
    $("#Page3").hide();
    show('Page1');

}
document.addEventListener("online", onOnline, false);

function onOnline() {
    show('Page1');
    $("#iconcamera").show();
    $("#iconalbum").show();
    $("#analysis").show();
    $("#outimage").show();
}



/* setting for take picture */
var pictureSource;
var destinationType;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

function onPhotoDataSuccess(imageData) {

    var smallImage = document.getElementById('smallImage');
    smallImage.src = "data:image/jpeg;base64," + imageData;
    $('#outimage').css("background-image", "url(" + smallImage.src + ")"); // set photo as background in div outimage
    predictFromWorkflow(imageData);
}


function onPhotoURISuccess(imageURI) {

    var largeImage = document.getElementById('smallImage');
    largeImage.src = "data:image/jpeg;base64," + imageURI;
    $('#outimage').css("background-image", "url(" + largeImage.src + ")"); // set photo as background in div outimage
    predictFromWorkflow(imageURI);

}



/* function take picture by cordova API */
function capturePhoto() {

    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: destinationType.DATA_URL
    });
}

function getPhoto(source) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.DATA_URL,
        sourceType: source
    });
}

function onFail(message) {
    navigator.notification.alert('Failed because: ' + message);
}

function show(elementID) {
    var ele = document.getElementById(elementID);
    if (!ele) {
        navigator.notification.alert("no such element");
        return;
    }
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    ele.style.display = 'block';
}




/*function Clarifai API  */
var clarifaiApiKey = ''; //clarifai apikey
var workflowId = ''; //clarifai work ID

var app = new Clarifai.App({
    apiKey: clarifaiApiKey
});

function predictFromWorkflow(photoUrl) {
    $("#inner-div").show();
    document.getElementById("inner-div").innerHTML = "<img src='img/easyg.svg' style='max-width:100%; padding-top:100px;'> ";
    app.workflow.predict(workflowId, {
        base64: photoUrl
    }).then(
        function (response) {
            var outputs = response.results[0].outputs;
            var analysis = $(".analysis");
            analysis.empty();
            console.log(outputs);
            outputs.forEach(function (output) {
                var modelName = getModelName(output);

                //  Create heading for each section
                var newModelSection = document.createElement("div");
                // newModelSection.className = modelName + " modal-container";

                var newModelHeader = document.createElement("h2");
                newModelHeader.innerHTML = modelName;
                newModelHeader.className = "model-header";

                var formattedString = getFormattedString(output);
                var newModelText = document.createElement("p");
                newModelText.innerHTML = formattedString;
                newModelText.className = "model-text";

                // newModelSection.append(newModelHeader);
                //  newModelSection.append(newModelText);
                analysis.append(newModelSection);
            });
        },
        function (err) {
            console.log(err);
        }
    );
}

// Helper function to get model name
function getModelName(output) {
    if (output.model.display_name !== undefined) {
        return output.model.display_name;
    } else if (output.model.name !== undefined) {
        return output.model.name;
    } else {
        return "";
    }
}

// Helper function to get output customized for each model
function getFormattedString(output) {
    var formattedString = "";
    var data = output.data;
    var maxItems = 5;

    //Food recognized
    if (output.model.model_version.id === "dfebc169854e429086aceb8368662641") {
        var items = data.concepts;
        if (items.length < maxItems) {
            maxItems = items.length;
            if (maxItems === 0) {
                formattedString = " <p class='write' style='font-family: Pacifico, cursive; '> Unrecognized dish! </p>";
            }
        } else {
            formattedString = " <p class='write' style='font-family: Pacifico, cursive; '>Recognized dishes: </p> <br>";
        }
        /*Print results */
        show('Page2');
        $('#inner-div').hide();
        for (var i = 0; i < maxItems; i++) {

            document.getElementById("analysis").innerHTML = (formattedString += "  <button class='elementsb'    onClick='reply_click(this.id)' id=" + items[i].name + " />  " + items[i].name + " &nbsp; accuracy percentage " + (Math.round(items[i].value * 10000) / 100) + "% <img src='img/freccia.svg' class='freccia'/> ");

            $(".elementsb").after("<br>");
        }
    }
    return formattedString;
}




/*function get recipe */
function reply_click(clicked_id)

{

    $("#loadp3").show();
    $("#recipe").hide();
    var b = "";
    var c = "";

    show('Page3');

    /*call AJAX for mealDB REST API */
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + clicked_id,
        type: "POST",
        dataType: "json",
        success: function (data) {


            $("#loadp3").hide();

            var cit = JSON.parse(JSON.stringify(data));
            var bet = (cit.meals);

            /*If results== null search in own missrecipe.JSON the correct recipe */
            if (bet == null) {

                var mydata = JSON.parse(missrecipe);

                for (var j = 0; j < mydata.length; j++) {

                    if (clicked_id == mydata[j].name) {

                        /*Print results of missrecipe.JSON */

                        document.getElementById("recipe").innerHTML = "<p class='write'> <strong>" + (mydata[j].name) + " </strong></p><img class='dish' src='" + (mydata[j].photo) + "'  />" + "<br><u> Origin: </u> <br>" + (mydata[j].origin) + "<br><br><u> Ingredients: </u><br> <ul><li>" + (mydata[j].ingredient1) + "</li><li>" + (mydata[j].ingredient2) + "</li><li>" + (mydata[j].ingredient3) + "</li><li>" + (mydata[j].ingredient4) + "</li><li>" + (mydata[j].ingredient5) + "</li><li>" + (mydata[j].ingredient6) + "</li><li>" +
                            (mydata[j].ingredient7) + "</li><li>" + (mydata[j].ingredient8) + "</li><li>" + (mydata[j].ingredient9) + "</li><li>" + (mydata[j].ingredient10) + "</li><li></ul> <br>" + "<u>Instructions:</u> <br>" + (mydata[j].instruction);
                        c = mydata[j].name;
                    }

                }
                /*If MealDB found recipe print results */
            } else if (c == "" && bet != null) {
                document.getElementById("recipe").innerHTML = "<p class='write'> <strong>" + (bet[0].strMeal) + " </strong></p><img class='dish' src='" + (bet[0].strMealThumb) + "'  />" + "<br><u> Origin: </u> <br>" + (bet[0].strArea) + "<br><br><u> Ingredients: </u><br> <ul><li>" + (bet[0].strIngredient1) + "&nbsp;" + (bet[0].strMeasure1) + "</li><li>" + (bet[0].strIngredient2) + "&nbsp;" + (bet[0].strMeasure2) + "</li><li>" + (bet[0].strIngredient3) + "&nbsp;" + (bet[0].strMeasure3) + "</li><li>" + (bet[0].strIngredient4) + "&nbsp;" + (bet[0].strMeasure4) + "</li><li>" +
                    (bet[0].strIngredient5) + "&nbsp;" + (bet[0].strMeasure5) + "</li><li>" + (bet[0].strIngredient6) + "&nbsp;" + (bet[0].strMeasure6) + "</li><li>" +
                    (bet[0].strIngredient7) + "&nbsp;" + (bet[0].strMeasure7) + "</li><li>" + (bet[0].strIngredient8) + "&nbsp;" + (bet[0].strMeasure8) + "</li><li>" +
                    (bet[0].strIngredient9) + "&nbsp;" + (bet[0].strMeasure9) + "</li><li>" + (bet[0].strIngredient10) + "&nbsp;" + (bet[0].strMeasure10) + "</li><li>" +
                    (bet[0].strIngredient11) + "&nbsp;" + (bet[0].strMeasure11) + "</li><li>" + (bet[0].strIngredient12) + "&nbsp;" + (bet[0].strMeasure12) + "</li><li>" +
                    (bet[0].strIngredient13) + "&nbsp;" + (bet[0].strMeasure13) + "</li><li>" + (bet[0].strIngredient14) + "&nbsp;" + (bet[0].strMeasure14) + "</li><li>" +
                    (bet[0].strIngredient15) + "&nbsp;" + (bet[0].strMeasure15) + "</li><li>" + (bet[0].strIngredient16) + "&nbsp;" + (bet[0].strMeasure16) + "</li><li>" +
                    (bet[0].strIngredient17) + "&nbsp;" + (bet[0].strMeasure17) + "</li><li>" + (bet[0].strIngredient18) + "&nbsp;" + (bet[0].strMeasure18) + "</li><li>" +
                    (bet[0].strIngredient19) + "&nbsp;" + (bet[0].strMeasure19) + "</li><li>" + (bet[0].strIngredient20) + "&nbsp;" + (bet[0].strMeasure20) + "</li><li></ul> <br>" + "<u>Instructions:</u> <br>" + (bet[0].strInstructions);

            }
            /*else print recipe not found*/
            if (c == "" && b == null) {
                document.getElementById("recipe").innerHTML = "<p class='write'> <strong>Recipe not found! </strong></p>";
            }
            
             /*delete all empty fields*/
            $('li').filter(function () {
                return this.innerHTML == '&nbsp; ';
            }).remove();
            $('li').filter(function () {
                return this.innerHTML == '';
            }).remove();
            $('li').filter(function () {
                return this.innerHTML == '&nbsp;';
            }).remove();
            $('li').filter(function () {
                return this.innerHTML == 'null&nbsp;null';
            }).remove();

            /*show div where is present the result*/
            $("#recipe").show();

        }
    });

}
