var config = {
  apiKey: "AIzaSyDT3-sFZaJfHK0H8jC2CeuH98wqPs8zT_I",
  authDomain: "train-scheduler-97ecb.firebaseapp.com",
  databaseURL: "https://train-scheduler-97ecb.firebaseio.com",
  projectId: "train-scheduler-97ecb",
  storageBucket: "train-scheduler-97ecb.appspot.com",
  messagingSenderId: "703086247966"
};
firebase.initializeApp(config);

var database = firebase.database();
// set up and display running date and time using moment.js 
var datetime = null;
var date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, HH:mm:ss'));
};

$(document).ready(function () {
  datetime = $('#datetime')
  update();
  setInterval(update, 1000);
});

// set up an event listener for form submit to capture train info
$("#train-form").on("submit", function (event) {
  event.preventDefault();

  //get info for form 
  var trainInfoInput = {
    name: $("#train-input").val().trim(),
    destination: $("#train-dest").val().trim(),
    firstTrain: $("#first-train").val().trim(),
    frequency: parseInt($("#train-freq").val().trim())
  }
  // console log trainInfoInput to see if values entered made it
  console.log(trainInfoInput);
  // push trainInfoInput object to firebase
  database.ref().push(trainInfoInput);
});

// event listener to retrieve newly added pieces of data that were added with .push() method to firebase 
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());
  //save a reference to the data in childSnapshot 
  var trainInfo = childSnapshot.val();

  //get the converted time using moment.js
  var convertedTime = moment(trainInfo.firstTrain, "HH:mm").subtract(1, "years");
  //console log the converted time 
  console.log(convertedTime);
  // create variable for the current time 
  var currentTime = moment();
  // calculate the difference between current and converted time
  var timeDif = moment().diff(moment(convertedTime), "minutes");
  // console log the time difference 
  console.log(timeDif);
  // Calculate time remaining until next train 
  var timeRem = timeDif % trainInfo.frequency;
  //console log time remaining 
  console.log(timeRem);
  // variable for minutes remaining until next train 
  var minutesAway = trainInfo.frequency - timeRem;
  // console.log minutes away
  console.log(minutesAway);
  // create variable for time of next arrival 
  var nextArrival = moment().add(minutesAway, "minutes");
  console.log(nextArrival);

  // create new table row 
  var $tr = $("<tr>");
  // create <td> tags for each column and add the content from childSnapshot.val() to them
  var $trainName = $("<td>").text(trainInfo.name);
  var $trainDest = $("<td>").text(trainInfo.destination);
  var $trainFreq = $("<td>").text(trainInfo.frequency);
  var $nextArrival = $("<td>").text(nextArrival.format("HH:mm"));
  var $minAway = $("<td>").text(minutesAway);
  // append td tags to table row 
  $tr.append($trainName, $trainDest, $trainFreq, $nextArrival, $minAway);
  // append table row to tbody 
  $("tbody").append($tr);


})