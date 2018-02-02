  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCmpc4rChkZG6ca4aemFvXGpLT9sOvaW8w",
    authDomain: "employeedb-9c70e.firebaseapp.com",
    databaseURL: "https://employeedb-9c70e.firebaseio.com",
    projectId: "employeedb-9c70e",
    storageBucket: "employeedb-9c70e.appspot.com",
    messagingSenderId: "902147483238"
  };
  firebase.initializeApp(config);

//create a variable to reference the database
const dbRef = firebase.database().ref('recentUserPush');

//Capture button click
$("#submitEmployee").on("click", submitEmployee);


function submitEmployee() {
  // var employeeName;
  // var role;
  // var rate;
  // var startDate;

event.preventDefault();

dbRef.push({
  employeeName : $("#employee-name").val().trim(),
  role : $("#employeeRole").val().trim(),
  rate : $("#employeeRate").val().trim(),
  startDate : $("#startDate").val().trim(),
  dateAdded: firebase.database.ServerValue.TIMESTAMP
});

console.log("success");

}

// Firebase watcher .on("child_added")
dbRef.on("child_added", function(snapshot) {
  // Log everything that's coming out of snapshot
  console.log(snapshot.val());
  $("#dropdown1").append(createUserDiv(snapshot.val()));
}, function(err) {
  // Handle errors
  console.log("Error: ", err.code);
});

// dbRef.orderByChild('dateAdded').limitToLast(5).on('child_added',function(snapshot){
//   // Set most recent user
//   displayMostRecent(snapshot.val());
// },function(err) {
//   console.log("Error: ", err.code);
// });

// function displayMostRecent(user) {
//   // Add user info to HTML
//   console.log(user.employeeName);
//   $("#name-display").text(user.employeeName);
//   $("#role-display").text(user.role);
//   $("#employee-rate").text(user.rate);
//   $("#start-date").text(user.startDate);
// }

function createUserDiv(user) {
  // create a div displaying user info
  var convertedDate = moment(user.startDate, "YYYY-MM-DD")
  const uDiv = $('<tr>').addClass('well');
  uDiv.append($('<td>').addClass('member-name').text(user.employeeName))
      .append($('<td>').addClass('member-email').text(user.role))
      .append($('<td>').addClass('member-comment').text(convertedDate))
      .append($('<td>').addClass('member-comment').text(parseInt((convertedDate.diff(moment(),"months"))*-1)))
      .append($('<td>').addClass('member-age').text(user.rate));
      
      
  
  return uDiv;
}








