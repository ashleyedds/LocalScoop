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
var currentFirebaseUser;
var dbRef;
var postKey;

//add realtime listener

firebase.auth().onAuthStateChanged(firebaseUser =>{
  if(firebaseUser){
    userId = firebaseUser.uid;
    currentFirebaseUser = firebaseUser;
    console.log(currentFirebaseUser);
    console.log(firebaseUser);
    console.log(userId);
   $("#btnLogout").show();
    //classList.remove("hide");
    //create a variable to reference the database
    dbRef = firebase.database().ref('users/'+ userId);
  
  // Firebase watcher .on("child_added")
    dbRef.on("child_added", function(snapshot) {
      // Log everything that's coming out of snapshot
      console.log(snapshot.val());
      console.log(snapshot.key)
      postKey = snapshot.key
      $("#full-member-list").append(createUserDiv(snapshot.val(), postKey));
    }, function(err) {
      // Handle errors
      console.log("Error: ", err.code);
    });

  // Firebase watcher .on("child_removed")
  dbRef.on("child_removed", function(snapshot) {
    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.key)
    postKey = snapshot.key
    $("#full-member-list").empty()
    location.reload();
  }, function(err) {
    // Handle errors
    console.log("Error: ", err.code);
  });
  

    } else{
      console.log("not logged in");  
     $("#btnLogout").hide();
      //classList.remove("unhide");
  }
});




// console.log(currentFirebaseUser);


// //https://firebase.google.com/docs/auth/web/manage-users
// //user + userID 
// //var userId = firebase.auth().uid;
// //WHY IS THIS NOT TAKING MY USER ID? I KNOW IT HAS SOMETHING TO DO WITH GLOBAL SCOPE
// console.log(userId);
// var user = firebase.auth().currentUser;
// console.log(user);



//Capture button click
$("#submitLocation").on("click", event => {
  event.preventDefault();
  
  // var test = $("#location-name").val().trim();
  // console.log(test);
    // var latitude;
    // var longitude;
    // var startDate;

  

  dbRef.push({

    locationName : $("#location-name").val().trim(),
    longitude : $("#longitude").val().trim(),
    latitude : $("#latitude").val().trim(),
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  console.log("success");

});

//user functions
 
 



// dbRef.orderByChild('dateAdded').limitToLast(5).on('child_added',function(snapshot){
//   // Set most recent user
//   displayMostRecent(snapshot.val());
// },function(err) {
//   console.log("Error: ", err.code);
// });

// function displayMostRecent(user) {
//   // Add user info to HTML
//   console.log(user.locationName);
//   $("#name-display").text(user.locationName);
//   $("#latitude-display").text(user.latitude);
//   $("#employee-longitude").text(user.longitude);
//   $("#start-date").text(user.startDate);
// }

function createUserDiv(user) {
  // create a div displaying user info
  var locDate = moment(user.dateAdded);
  console.log(postKey);
  var dateFormat = 'MM/DD/YYYY';
  var convertedDate = locDate.format('MM/DD/YYYY hh:mm a');
  var delButton = $('<button>').addClass('btn btn-default').attr('id', 'delete-button').attr('value', postKey).text('Delete');
  var editButton = $('<button>').addClass('btn btn-default').attr('id', 'edit-button').attr('value', postKey).text('Edit');
  const uDiv = $('<tr>').addClass('well');
  uDiv.append($('<td>').addClass('member-location').text(user.locationName))
      .append($('<td>').addClass('member-latitude').text(user.latitude))
      .append($('<td>').addClass('member-longitude').text(user.longitude))
      .append($('<td>').addClass('member-longitude').text(convertedDate))
      .append($('<td>').append(delButton))
      .append($('<td>').addClass('edit-button').append(editButton))
      .append($('<td>').addClass('search-button').html("<button class='btn btn-default'>Search</button>").attr('lat-value', user.latitude).attr('long-value', user.longitude));
      
      
  
  return uDiv;
}

$(document).on("click", "#delete-button", function(){

  var postNum = $(this).val().trim();

  console.log(postNum);

 dbRef.child(postNum).remove();
  console.log('deleted');
}

);

$(document).on("click", "#edit-button", function(){
  
    var postNum = $(this).val().trim();
  
    console.log(postNum);
  
   dbRef.child(postNum).remove();
    console.log('edited');
  }
  
  );


// $(document).on("click", "#delete-button", deleteUser);

// function deleteUser() {
//   var postNum = $("#delete-button").val();
//   console.log(postNum);

//   dbRemove = firebase.database().ref('users/'+ userId+'/-L3xAHGiZc8nGHkhA9HN');
//   //https://geoloc-1516755897361.firebaseio.com/users/KyjBnHEZNzgglPWHC7oelSeyXeK2/-L3xAHGiZc8nGHkhA9HN
  
//   console.log(dbRef);
//   dbRemove.on
//   //dbRemove.remove();

//   //createUserDiv();
// }


/////// USER AUTH










// add login event
$("#btnLogin").on("click", submitUser);
//add signup event
$("#btnSignUp").on("click", userSignUp);
//add logout event if logged in
$("#btnLogout").on("click", userSignOut);

function getUserInput(){
    //get Login Elements
    const txtEmail = $("#txtEmail").val();
    console.log(txtEmail);
    const txtPassword = $("#txtPassword").val().trim();
    const formUserName = $("#userName")
    const formEmail = $("#txtEmail")
    const formPass = $("")
    const btnLogin = $("#btnLogin").val().trim();
    const btnSignUp = $("#btnSignUp").val().trim();
    const btnLogout =$("#btnLogout").val().trim();
}


function submitUser() {

//pull element info from form
getUserInput();

//prevent default so no auto refresh
event.preventDefault();

//Get email and pass
const email = txtEmail.value;
console.log(email);
const pass = txtPassword.value;
const auth = firebase.auth();

//sign in
const promise = auth.signInWithEmailAndPassword(email, pass);

// this logs any errors and logs them to the console
promise.catch(e => console.log(e.message));

}

function userSignUp() {

//prevent default so no auto refresh
event.preventDefault();

//pull element info from form
getUserInput();

//prevent default so no auto refresh
event.preventDefault();

//Get email and pass
//check for real email
const email = txtEmail.value;
console.log(email);
const pass = txtPassword.value;
const auth = firebase.auth();

//sign in
const promise = auth.createUserWithEmailAndPassword(email, pass);

// this logs any errors and logs them to the console
promise
    .catch(e => console.log(e.message));
}

function userSignOut() {
    firebase.auth().signOut();
}

// //add realtime listener
// firebase.auth().onAuthStateChanged(firebaseUser =>{
//     if(firebaseUser){
//         console.log(firebaseUser);
//         btnLogout.classList.remove("hide");
//     } else{
//         console.log("not logged in");  
//         btnLogout.classList.add("hide");
//     }
// });

