export const $root = $('#root');
export const $maps = $('#maps');
export const $nav = $('#nav');

// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('decks').get().then(snapshot => {
            setupDecks(snapshot.docs);
            // setupUI(user);
        });
    } else {
        // setupUI();
        setupDecks([]);
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

const setupDecks = (data) => {

    let html = '';
    data.forEach(doc => {
        const theDeck = doc.data();
        const div = `  
        <div class="tile is-parent" style="min-width: 33%; max-width: 33%">
            <article class="tile is-child notification is-light">
                <div class="content has-text-left">
                    <button class="button deckname" id="${theDeck.deck}">${theDeck.deck}</button>
                    <p class="subtitle">${theDeck.address}</h2>
                    <p class="subtitle">Notes: ${theDeck.notes}</p>
                </div>
                <div class="content has-text-right" style="padding-top: 20px; padding-right: 20px; padding-bottom: 20px;">
                    <button class="button is-primary">Edit</button>
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

async function loadMap (theDeck) {
    $root.empty();
    $nav.empty();
    getCoordinates(theDeck.address, theDeck);    
}



async function getCoordinates (address, theDeck) {
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

const loggedOutLinks = document.querySelector('.loggedOut');
const loggedInLinks = document.querySelector('.loggedIn');

const setupUI = (user) => {
    if (user) {
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
        console.log(loggedInLinks)
        console.log(loggedOutLinks)
    } else {
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
        console.log(loggedInLinks)
        console.log(loggedOutLinks)
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
        const modal = document.querySelector('#signupModal');
        modal.style.display = 'none';
        signupForm.reset();
    })
})

// logout
const logout = document.querySelector('#logout');
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