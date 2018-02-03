    //Initialize Firebase
    const config = {
    apiKey: "AIzaSyBjLJpg39qNGQ3BZjJ17DmAejavYWGKtpc",
    authDomain: "geoloc-1516755897361.firebaseapp.com",
    databaseURL: "https://geoloc-1516755897361.firebaseio.com",
    projectId: "geoloc-1516755897361",
    storageBucket: "geoloc-1516755897361.appspot.com",
    messagingSenderId: "262816324086"
  };
  
  firebase.initializeApp(config);



// variables
var userId;
var currentFirebaseUser;
var postKey;
var editActive = false;
var accountEditActive = false;
var testValue = "Oh my";
var dbRef;
var loginActive;
var txtEmail;
var txtPassword;
var userCurrent;


firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
        loginActive = true;
        userId = firebaseUser.uid;
        testValue = "Yes"
        renderUserName(firebaseUser.displayName);

        console.log(userId);
        console.log(firebaseUser);
        console.log(firebaseUser.displayName);
        $('#btnLogin').addClass('hide');
        $('#btnLogout').removeClass('hide');
        //window.location = "index.html";
      // window.location.replace("index.html");

     dbRef = firebase.database().ref('users/'+ userId);

    // Firebase watcher .on("child_added")
        dbRef.on("child_added", function(snapshot) {
            // Log everything that's coming out of snapshot
            console.log(snapshot.val());
            console.log(snapshot.key)
            postKey = snapshot.key
            $("#dropdown1").append(createLocDiv(snapshot.val(), postKey));
            $("#updateUserFields").append(createUserDiv(snapshot.val(), postKey));
        }, function(err) {
            // Handle errors
            console.log("Error: ", err.code);
        });

        dbRef.on("child_removed", function(snapshot) {
            // Log everything that's coming out of snapshot
            console.log(snapshot.val());
            console.log(snapshot.key)
            postKey = snapshot.key
            $("#dropdown1").empty()
            location.reload();
          }, function(err) {
            // Handle errors
            console.log("Error: ", err.code);
          });


    } else {
        $('#btnLogin').removeClass('hide');
        $('#btnLogout').addClass('hide');
        console.log('not logged in');
        testValue = "No";
        loginActive = false;
    }
});

console.log(userId);
console.log(testValue);
 //create a variable to reference the database
 


function createUserDiv(user){
    delButton = $('<button>').addClass('btn-flat').attr('id', 'delete-button').attr('value', postKey).text("x");

    var listItem = $('<li>').text(user.locationName + "  ").addClass("location-item").attr('loc-name', user.locationName).attr('lat-value', user.latitude).attr('long-value', user.longitude).append(delButton);
   $('#dropdown1').append(listItem);
    
}  

function createUserDiv(user){
    emailLabel = $('<button>').addClass('btn').attr('id', 'delete-button').attr('value', postKey).text("x");
    var listItem = $('<li>').text(user.email).addClass("input-field col s8 offset-s2");
    $('#txtDisplayName').attr('placeholder', user.displayName);
    $('#txtDisplayEmail').attr('placeholder', user.email);
    $('#txtDisplayPassword').attr('placeholder', user.password);
    
}  

function renderUserName(user){
    if(user){
        $("#login-here").text("Welcome "+user+" !").append($("<span>").html("<i class='material-icons left'>menu</i>"));
        } else {
        $("#login-here").text("Welcome New User !").append($("<span>").html("<i class='material-icons left'>menu</i>"));
        }
}

  // Firebase watcher .on("child_added")
  function getLogInInput(){
    //get Login Elements
    txtEmail = $("#txtEmail").val().trim();
    console.log(txtEmail);
    txtPassword = $("#txtPassword").val().trim();    
    const btnLogin = $("#btnLogin").val().trim();
    const btnSignUp = $("#btnSignUp").val().trim();
    const btnLogout =$("#btnLogout").val().trim();
}

function getSignUpInput(){
    //get Login Elements
    //txtUserName = $("#txtSignUpUserName").val().trim();
    txtEmail = $("#txtSignUpEmail").val().trim();
    console.log(txtEmail);
    txtPassword = $("#txtSignUpPassword").val().trim();    
}

function getEditInput(){
    //get Login Elements
    txtUserName = $("#txtEditUserName").val().trim();
    txtEmail = $("#txtEditEmail").val().trim();
    console.log(txtEmail);
    txtPassword = $("#txtEditPassword").val().trim();    
}

//add signup event
$("#btnSignUp").on("click", e => {
    event.preventDefault();
    //Get email and pass
    getSignUpInput();
    console.log(txtEmail);
    const email = txtEmail;
    const pass = txtPassword;
    const auth = firebase.auth();
    
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    console.log("You have successfully signed up.");
    // this logs any errors and logs them to the console
    promise.catch(e => console.log(e.message));
    
});


//add logout event if logged in
$("#btnLogout").on("click", e =>{
    firebase.auth().signOut();
    $("#dropdown1, #dropdown2").empty();
    location.reload();
});


// add login event
$("#btnLogin").on("click",e => {
    event.preventDefault();
    //console.log("testing login");
    getLogInInput();
    //Get email and pass
    console.log(txtEmail);
    const email = txtEmail;
    const pass = txtPassword;
    const auth = firebase.auth();
    //location.reload();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    console.log("You have submitted a user.");
    $('#modalLogin').modal('close')
    $('#modalLogin').html("<h4>You are logged in!</h4>");
    $('#modalSignUp').html("<h4>You are logged in!</h4>");

    // this logs any errors and logs them to the console
    promise.catch(e => console.log(e.message));
    
});

$(document).on("click", "#getUsers", function() {
    userCurrent = firebase.auth().currentUser;
    
    createUserDiv(userCurrent);

});

$(document).on("click", "#newUserName", function(){
    event.preventDefault();
  newName =  $("#txtDisplayName").val().trim();
  console.log(newName);
  userCurrent.updateProfile({
    displayName : $("#txtDisplayName").val().trim()
  }).then(function(){
    alert("Success");
    $('#modalEdit').modal('close');
    renderUserName(newName);
});
});

$(document).on("click", "#newEmail", function(){
    event.preventDefault();
  newEmail =  $("#txtDisplayEmail").val().trim();
  console.log(newEmail);
  userCurrent.updateEmail(newEmail).then(function(){
    alert("Success");
    $('#modalEdit').empty();
    $('#modalEdit').modal('close');
});
});

$(document).on("click", "#newPwd", function(){
    event.preventDefault();
    var newPassword = getASecureRandomPassword();
    var auth = firebase.auth();
    var emailAddress = userCurrent.email;
    console.log(emailAddress);
    userCurrent.updatePassword(newPassword).then(function(){
        alert("Success");
        $('#modalEdit').empty();
        $('#modalEdit').modal('close');
    }).catch(function(error) {
    alert(error);
    });


    auth.sendPasswordResetEmail(emailAddress).then(function() {
        alert("password reset email sent");
        location.reload();
    }).catch(function(error) {
        // An error happened.
    });

});


function getASecureRandomPassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

$(document).on("click", "#delete-button", function(){
    
      var postNum = $(this).val().trim();
    
  dbRef.child(postNum).remove();
      console.log('deleted');
    }
    
    );

$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    });
