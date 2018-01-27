// Initialize Firebase
var config = {
  apiKey: "AIzaSyBjLJpg39qNGQ3BZjJ17DmAejavYWGKtpc",
  authDomain: "geoloc-1516755897361.firebaseapp.com",
  databaseURL: "https://geoloc-1516755897361.firebaseio.com",
  projectId: "geoloc-1516755897361",
  storageBucket: "geoloc-1516755897361.appspot.com",
  messagingSenderId: "262816324086"
};
firebase.initializeApp(config);

var userId;

//add realtime listener
$(document).ready(function(){
firebase.auth().onAuthStateChanged(firebaseUser =>{
  if(firebaseUser){
      console.log(firebaseUser);
      userId = firebaseUser.uid;
      console.log(userId);
      btnLogout.classList.remove("hide");
  } else{
      console.log("not logged in");  
      btnLogout.classList.add("hide");
  }
});
});


//https://firebase.google.com/docs/auth/web/manage-users
//user + userID 
//var userId = firebase.auth().uid;
//WHY IS THIS NOT TAKING MY USER ID? I KNOW IT HAS SOMETHING TO DO WITH GLOBAL SCOPE
console.log(userId);
var user = firebase.auth().currentUser;
console.log(user);

//create a variable to reference the database
const dbRef = firebase.database().ref('users/'+ userId + '/recentUserPush');

//Capture button click
$("#submitEmployee").on("click", submitEmployee);

//user functions

function submitEmployee() {
  if(user != null){
    var test = $("#employee-name").val().trim();
    console.log(test);
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
  else{
    alert("You must sign in to submit")
  }
}

// Firebase watcher .on("child_added")
dbRef.on("child_added", function(snapshot) {
  // Log everything that's coming out of snapshot
  console.log(snapshot.val());
  $("#full-member-list").append(createUserDiv(snapshot.val()));
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










