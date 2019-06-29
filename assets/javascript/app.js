var config = {
  apiKey: "AIzaSyCk7VHJHBumi7uF_0QfwROwWfy4sT4mr8E",
  authDomain: "trainschedule-47d54.firebaseapp.com",
  databaseURL: "https://trainschedule-47d54.firebaseio.com",
  projectId: "trainschedule-47d54",
  storageBucket: "",
  messagingSenderId: "218393688071",
  appId: "1:218393688071:web:d97f6b094b421234"
};

firebase.initializeApp(config);

var database = firebase.database();
// current time
var currentTime = moment(new Date());
currentTime = moment().format("HH:mm");

// Button for adding a Train
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs train input
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var trainDestination = $("#train-destination-input")
    .val()
    .trim();
  var trainTime = $("#train-time-input")
    .val()
    .trim();
  moment("HH:mm").format("X");
  var trainFrequency = $("#train-frequency-input")
    .val()
    .trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#train-destination-input").val("");
  $("#train-time-input").val("");
  $("#train-frequency-input").val("");

  // Prevents new page from loading
  return false;
});
// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFrequency);

  // Train time conversion
  var trainTimeConverted = moment(childSnapshot.val().time, "HH:mm");
  console.log(trainTimeConverted);

  var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
  console.log("Difference in time: " + diffTime);

  // Time between
  var tRemainder = diffTime % childSnapshot.val().frequency;
  console.log(tRemainder);

  // Mins until train arrives
  var tMinsTillTrain = childSnapshot.val().frequency - tRemainder;
  console.log(tMinsTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinsTillTrain, "minutes");
  var nextTrainConvert = moment(nextTrain).format("HH:mm");

  // Adding train times/schedules

  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrainConvert),
    $("<td>").text(nextTrain)
  );
  $("#train-table > tbody").append(newRow);
});
