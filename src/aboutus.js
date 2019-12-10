export const $root = $('#root');
export const $maps = $('#maps');
export const $nav = $('#nav');

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

// listen for auth status changes
auth.onAuthStateChanged(user => {

    if (user) {
        db.collection('decks').onSnapshot(snapshot => {
            // setupDecksWithEdit(snapshot.docs);
            setupUI(user);
        });
    } else {
        db.collection('decks').onSnapshot(snapshot => {
            // setupDecksWithoutEdit(snapshot.docs);
            setupUI();
        });
    }
});


export const loadDeckEditForm = function (data, id) {
    $root.empty();
    $nav.empty();
    $nav.append(loadNoHero());
    let deckToEdit;
    data.forEach(doc => {
        if (doc.id == id) {
            deckToEdit = doc.data();
        }
    });
    $root.append(getEditForm(deckToEdit));
    // var database = firebase.database();
    let path = "-decks/" + id;

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
                <button class="button is-white save" id="submitDeckChange">Update</button>
                <button class="button is-dark cancel" id="cancelButton" type!="submit" value="Cancel">Cancel</button>
                <button class="button is-danger" id="deleteDeck" type="submit">Delete</button>
            </div>
        </form>
        </div>
    </section>
    `
}

export const loadNoHero = function () {
    return `
    <nav class="navbar is-fixed-top" style="background-color: hsl(171, 90%, 35%); border-bottom-style: solid; border-color: white; border-bottom-width: 1.5px;">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item">
          <h2 class="subtitle is-2">SPARC</h2>
        </a>
        <a class="navbar-item" href="index.html">
          Home
        </a>
        <a class="navbar-item" id="aboutUs" href="aboutUs.html">
          About Us
        </a>
        <span class="navbar-burger burger" data-target="navbarMenuHeroA">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div id="navbarMenuHeroA" class="navbar-menu">
        <div class="navbar-end">
          <a class="navbar-item" id="myAccount">
            My Account
          </a>
          <a class="navbar-item" class="loggedIn" id="logout">
            Logout
          </a>
          <a class="navbar-item" class="loggedIn" id="createDeck">
            Create Deck
          </a>
          <a class="navbar-item" class="loggedOut" id="login">
            Login
          </a>
          <a class="navbar-item" class="loggedOut" id="signup">
            Sign Up
          </a>

        </div>
      </div>
    </div>
  </nav>

      `
}

async function loadMap(theDeck) {
    $root.empty();
    $nav.empty();
    getCoordinates(theDeck.address, theDeck);
}



async function getCoordinates(address, theDeck) {
    L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcDQyNmZpbmFsIiwiYSI6ImNrMzZidGNsZDAwMzEzbXJ4bXFnM3loYjgifQ.gyiwVu9eUjqg-If1v-gK0A';
    var geocoder = L.mapbox.geocoder('mapbox.places');

    geocoder.query(address, showMap);

    function showMap(err, data) {
        if (data.latlng) {
            $nav.append(loadNoHero());
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