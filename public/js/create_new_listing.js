// Define multiple global variables that will be used throughout multiple functions.
let number_of_listings;
let file;
let current = [];
let unique;

// Grab number of unique listings that have been created.
var db = firebase.database().ref().child("Listings/UniqueListings");
db.on(
    "value",
    function(snap){
        unique = snap.val();
    }
);

// Grab user's name, email, and user id if they are logged in.
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var uid = user.uid;
        current.push(displayName);
        current.push(email);
        current.push(uid);
    }
});

// Assign a variable to the image when it is uploaded.
var photoupload = document.getElementById("photoupload");
photoupload.addEventListener("change", function(e) {
    file = e.target.files[0];
});

// Update to database
function updateDatabase() {

    // Creates a new key using the number of unique listings that have been created.
    let key = "Listing" + unique;
    let selection = document.getElementById("weight").value;

    // Create and pushes a new entry into the database using values in the form 
    // & information from the signed in user
    firebase.database().ref("Listings/").update({
        [key]: {
            Name: document.getElementById("product").value,
            Farmer: current[0],
            Description: document.getElementById("description").value,
            Quantity: document.getElementById("quantity").value,
            Weight: selection,
            FarmerID: current[2]
        }
    });

    // Increment the number of unique listings by 1.
    firebase.database().ref("Listings/").update({
        UniqueListings: unique + 1
    })

    // Stores the photo uploaded by the user onto firebase storage.
    var storageRef = firebase.storage().ref("produce_pics/" + key + "/produce.jpg");
    storageRef.put(file);

    // Disable the create button. 
    document.getElementById("submit").innerHTML = "Listing Created!";
    document.getElementById("submit").disabled = "true";
    document.getElementById("submit").style.opacity = "1";
}
