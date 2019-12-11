export const $root = $('#root');
export const $maps = $('#maps');
export const $hero = $('#hero');

export const myAccount = document.querySelector('#myAccount');
export const logout = document.querySelector('#logout');
export const createDeck = document.querySelector('#createDeck');
export const login = document.querySelector('#login');
export const signup = document.querySelector('#signup');
export const accountBody = document.querySelector('#accountBody')


// if (auth.user) {
//     // db.collection('decks').onSnapshot(snapshot => {
//         // setupDecksWithEdit(snapshot.docs);
//         setupUI(user);
//     // });
// } else {
//     // db.collection('decks').onSnapshot(snapshot => {
//         // setupDecksWithoutEdit(snapshot.docs);
//         setupUI();
//     // });
// }
let global_user;
// listen for auth status changes
auth.onAuthStateChanged(user => {
    global_user = user;
    if (user) {
        db.collection('decks').onSnapshot(snapshot => {
            setupDecksWithEdit(snapshot.docs);
            setupUI(user);
        });
    } else {
        db.collection('decks').onSnapshot(snapshot => {
            setupDecksWithoutEdit(snapshot.docs);
            setupUI();
        });
    }
});

// create new deck
const createForm = document.querySelector('#createForm');
const createButton = document.querySelector('#createDeckButton')
createDeckButton.addEventListener('click', (e) => {
    e.preventDefault();

    db.collection('decks').add({
        deck: createForm['deck'].value,
        address: createForm['address'].value,
        notes: createForm['notes'].value
    }).then(() => {
        // close modal and reset form
        const modal = document.querySelector('#createDeckModal');
        modal.style.display = 'none';
        createForm.reset();
    })

})

// render decks
const deckList = document.querySelector('.decks');

const setupDecksWithoutEdit = (data) => {

    let html = '';
    data.forEach(doc => {
        const theDeck = doc.data();
        const div = `  
        <div class="tile is-parent" style="min-width: 33%; max-width: 33% word-break: break-word; 
        width: 500px;">
            <article class="tile is-child notification is-light">
                <div class="content has-text-left">
                    <button class="button deckname" id="${theDeck.deck}">${theDeck.deck}</button>
                    <p class="subtitle">${theDeck.address}</h2>
                    <p class="subtitle">Notes: ${theDeck.notes}</p>
                </div>
                <div class="content has-text-right" style="padding-top: 20px; padding-right: 20px; padding-bottom: 20px;">
                    
                </div>
            </article>
        </div>
        `;
        html += div;
    });

    deckList.innerHTML = html;

    data.forEach(doc => {
        const theDeck = doc.data();
        const deckName = document.getElementById(theDeck.deck);
        deckName.addEventListener('click', (e) => {
            e.preventDefault();
            loadMap(theDeck);
        });
    });

}

// const deckList = document.querySelector('.decks');

const setupDecksWithEdit = (data) => {

    let html = '';
    data.forEach(doc => {
        const theDeck = doc.data();
        const div = `  
        <div class="tile is-parent" style="min-width: 33%; max-width: 33% word-break: break-word; 
        width: 500px;">
            <article class="tile is-child notification is-light">
                <div class="content has-text-left">
                    <button class="button deckname" id="${theDeck.deck}">${theDeck.deck}</button>
                    <p class="subtitle">${theDeck.address}</h2>
                    <p class="subtitle">Notes: ${theDeck.notes}</p>
                </div>
                <div class="content has-text-right" style="padding-top: 20px; padding-right: 20px; padding-bottom: 20px;">
                    <button id="${doc.id}"class="button is-primary edit">Edit</button>
                </div>
            </article>
        </div>
        `;
        html += div;
    });

    deckList.innerHTML = html;

    data.forEach(doc => {
        const theDeck = doc.data();
        const editID = document.getElementById(doc.id);
        editID.addEventListener('click', (e) => {
            e.preventDefault();
            loadDeckEditForm(data, doc.id);
        });
    });

    data.forEach(doc => {
        const theDeck = doc.data();
        const deckName = document.getElementById(theDeck.deck);
        deckName.addEventListener('click', (e) => {
            e.preventDefault();
            loadMap(theDeck);
        });
    });

}

export const loadDeckEditForm = function (data, id) {
    $root.empty();
    $hero.empty();
    let deckToEdit;
    let global_doc;
    data.forEach(doc => {
        if (doc.id == id) {
            global_doc = doc;
            deckToEdit = doc.data();
        }
    });
    $root.append(getEditForm(deckToEdit));

    $(document).on("click", ".save", function (event) {
        let newName = document.getElementById("newDeckName").value;
        let newAddress = document.getElementById("newDeckAddress").value;
        let newNotes = document.getElementById("newDeckNotes").value;
        event.preventDefault();

        db.collection("decks").doc(id).update({
            deck: newName,
            address: newAddress,
            notes: newNotes
        });
        
        setupDecksWithEdit(data);
        $hero.append(loadHero());
    });

    $(document).one("click", "#deleteDeck", function (event) {
        event.preventDefault();

        db.collection("decks").doc(id).delete().then(function() {
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        
    });
}

export const getEditForm = function (theDeck) {
    return `
    <section class="section" style="width: 100%">
    <div class="content has-text-left">
        <h1 class="subtitle">Edit Deck</h1>
        <form>
            <div class="field">
                <label class="label" >Name</label>
                <div class="control">
                    <textarea class="textarea" id="newDeckName">${theDeck.deck}</textarea>
                </div>
            </div>
            <div class="field">
                <label class="label">Address</label>
                <div class="control">
                    <textarea class="textarea" id="newDeckAddress">${theDeck.address}</textarea>
                </div>
            </div>
            <div class="field">
                <label class="label">Notes</label>
                <div class="control">
                    <textarea class="textarea" id="newDeckNotes">${theDeck.notes}</textarea>
                </div>
            </div>
            <div class="content has-text-right">
                <button class="button is-white save" id="submitDeckChange" href="index.html">Update</button>
                <button class="button is-dark cancel" id="cancelButton" type!="submit" value="Cancel">Cancel</button>
                <button class="button is-danger" id="deleteDeck" type="submit">Delete</button>
            </div>
        </form>
        </div>
    </section>
    `
}

export const loadHero = function () {
    return `
    <div class="hero-body" id="hero-body" style="background-image: url('gps.jpg'); background-position: center; background-repeat: no-repeat; background-size: cover; overflow: hidden;">
      <div class="container has-text-centered" style="background: hsla(0, 0%, 96%, 0.68); width: 500px; padding: 40px;">
        <h1 class="subtitle is-2" style="color: #494949">Find Parking at UNC</h1>
        <div class="content has-text-centered">
          <form autocomplete="off" action="/action_page.php">
            <div class="autocomplete">
              <input class="input" id="myInput" type="text" placeholder="Address" name="myAddress" style="width: 70%">
              <button class="button" id = "autofillbutton" type="submit" value="Search">Submit</button>
            </div>
        </div>
        </form>
      </div>
    </div>
    `
}

async function loadMap(theDeck) {
    $root.empty();
    $hero.empty();
    getCoordinates(theDeck.address, theDeck);
}



async function getCoordinates(address, theDeck) {
    L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcDQyNmZpbmFsIiwiYSI6ImNrMzZidGNsZDAwMzEzbXJ4bXFnM3loYjgifQ.gyiwVu9eUjqg-If1v-gK0A';
    var geocoder = L.mapbox.geocoder('mapbox.places');

    geocoder.query(address, showMap);

    function showMap(err, data) {
        if (data.latlng) {
            $maps.append(renderMap(theDeck, data.latlng[0], data.latlng[1]));
        }
    }
}


export const renderMap = function (theDeck, x, y) {
    return `
    <section class="section" style="padding-top: 40px; background-color: hsl(0, 0%, 96%)">
        <div class="container is-light">
            <div class="content has-text-left">
                <div class="title" id="${theDeck.deck}" style="color: #494949">${theDeck.deck}</div>
                <p class="subtitle" style="color: #494949">${theDeck.address}</h2>
                <p class="subtitle" style="color: #494949">Notes: ${theDeck.notes}</p>
            </div>
        </div>
        </section>
    <div class="content has-text-center">
    <div id='map' style='width: 100%; height: 400px;'></div>
    <script>
        mapboxgl.accessToken =
            'pk.eyJ1IjoiY29tcDQyNmZpbmFsIiwiYSI6ImNrMzZidGNsZDAwMzEzbXJ4bXFnM3loYjgifQ.gyiwVu9eUjqg-If1v-gK0A';
            var map = new mapboxgl.Map({
                container: 'map', 
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [${y}, ${x}],
                zoom: 16 
                });
                map.addControl(new MapboxDirections({
                    accessToken: mapboxgl.accessToken
                    }), 'top-left');
                map.addControl(new mapboxgl.NavigationControl());
                map.on('load', function() {
                    map.loadImage('./location1.png', function(error, image) {
                        if (error) throw error;
                        map.addImage('cat', image);
                        map.addLayer({
                            "id": "points",
                            "type": "symbol",
                            "source": {
                            "type": "geojson",
                            "data": {
                            "type": "FeatureCollection",
                            "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [${y},${x}]
                            }
                        }]
                        }
                    },
                    "layout": {
                        "icon-image": "cat",
                        "icon-size": 0.1
                    }
                });
            });
        });
    </script>
    </div>
    
    `
}



// render UI



const setupUI = (user) => {
    if (user) {
        // account info
        db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
            <div> <b> Email: </b> ${user.email}</div> <br>
            <div> <b> Name: </b> ${doc.data().name}</div>
            `;
            accountBody.innerHTML = html;
        })

        // toggle UI elements
        myAccount.style.display = 'flex';
        logout.style.display = 'flex';
        createDeck.style.display = 'flex';
        login.style.display = 'none';
        signup.style.display = 'none';

    } else {
        // hide account info
        accountBody.innerHTML = '';

        // toggle UI elements
        myAccount.style.display = 'none';
        logout.style.display = 'none';
        createDeck.style.display = 'none';
        login.style.display = 'flex';
        signup.style.display = 'flex';
    }
}

// sign up
const signupForm = document.querySelector('#signupForm')
const signupButton = document.querySelector('#signupButton')

signupButton.addEventListener('click', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signupEmail'].value;
    const password = signupForm['signupPassword'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // console.log(signupForm['name'].value);
        return db.collection('users').doc(cred.user.uid).set({
            name: signupForm['name'].value
        });
    }).then(() => {
        const modal = document.querySelector('#signupModal');
        modal.style.display = 'none';
        signupForm.reset();
    });
});

// logout
// const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("logged out");
    })
    location.reload();
})

// login
const loginForm = document.querySelector('#loginForm');
const loginButton = document.querySelector('#loginButton')
loginButton.addEventListener('click', (e) => {
    e.preventDefault();

    // get the user info
    const email = loginForm['loginEmail'].value;
    const password = loginForm['loginPassword'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user.email);
        const modal = document.querySelector('#loginModal');
        modal.style.display = 'none';
        loginForm.reset();
    })
})

//event listener on the submit button, call loadMap with that 
document.getElementById("autofillbutton").addEventListener('click', (e) => {
    e.preventDefault();
    var input = document.getElementById("myInput").value;
    var deck;
    db.collection('decks').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var deckObjects = doc.data();
            var address = deckObjects.address;
            var spotname = deckObjects.deck;

            if (input == address) {
                deck = deckObjects;
                loadMap(deck);
            }
            if (input == spotname) {
                deck = deckObjects;
                loadMap(deck);
            }
        });

    });
});