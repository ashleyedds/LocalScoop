// Initialize Firebase
(function() {
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

  //get Login Elements
  const txtEmail = $("#txtEmail").value;
  const txtPassword = $("#txtPassword").value;
  //get buttons
  const btnLogin = $("#btnLogin")
  const btnSignUp = $("#btnSignUp")
  const btnLogout =$("#btnLogout")

}());
  const auth = firebase.auth();

  auth.signInWithEmailAndPassword(email, pass);

  auth.createUserWithEmailAndPassword(email, pass);

  auth.onAuthStateChanged(firebaseUser => { });

// add login event
$("#btnLogin").on("click", submitUser);
//add signup event
$("#btnSignUp").on("click", userSignUp);
//add logout event if logged in
$("#btnLogout").on("click", userSignOut);



function submitUser() {
    console.log("You have submitted a user.");
    
};

function userSignUp() {
    console.log("You have signed up.");
};

function userSignUp() {
    console.log("You have signed out.");
};