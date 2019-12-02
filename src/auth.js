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
        <div id="${theDeck.deck}></div>
        <section class="section" style="border-bottom-style: solid; border-width: 0.5px; padding-top: 20px;">
        <div class="container is-light">
            <div class="content has-text-left">
                <h1 class="title deckname" id="">${theDeck.deck}</h1>
                <h2 class="subtitle">${theDeck.address}</h2>
                <p class="subtitle">Notes: ${theDeck.notes}</p>
            </div>
        </div>
          <div class="content has-text-right" style="padding-top: 20px; padding-right: 20px; padding-bottom: 20px;">
              <button class="button is-light">Save</button>
              <button class="button is-light">Edit</button>
              <button class="button is-light">Delete</button>
            </div>
        </div>
        </section>
        `;
        html += div;
    });

    deckList.innerHTML = html;
}
export const loadMap = function() {
    let deck = parkingDecks.find(function(element) {
        return element.id == event.target.id;
    });

    $root.append(renderMap(deck.xCoordinate, deck.yCoordinate));
}

export const renderMap = function(x, y) {
    return `
    <div id='map' style='width: 400px; height: 300px;'></div>
    <script>
        mapboxgl.accessToken =
            'pk.eyJ1IjoiY29tcDQyNmZpbmFsIiwiYSI6ImNrMzZidGNsZDAwMzEzbXJ4bXFnM3loYjgifQ.gyiwVu9eUjqg-If1v-gK0A';
            var map = new mapboxgl.Map({
                container: 'map', 
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [${y}, ${x}],
                zoom: 16 
                });
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
    `
}

export const loadParking = function() {
    
    parkingDecks.forEach(deck => {
        $root.append(renderListItem(deck));
    });
    
    $(document).on("click", ".deckname", function(event) {
        event.preventDefault();
        $section.empty();
        $root.empty();
        loadMap(event);
    });

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

















