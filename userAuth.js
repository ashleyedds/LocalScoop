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

//add realtime listener
firebase.auth().onAuthStateChanged(firebaseUser =>{
    if(firebaseUser){
        console.log(firebaseUser);
        btnLogout.classList.remove("hide");
    } else{
        console.log("not logged in");  
        btnLogout.classList.add("hide");
    }
});