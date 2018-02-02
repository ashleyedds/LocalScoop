firebase.initializeApp(config);

firebase.auth().onAuthStateChanges(firebaseUser =>{
    if(firebaseUser){
        window.location.replace("index.html");
    } else {
        console.log("You are not logged in");
    }
});