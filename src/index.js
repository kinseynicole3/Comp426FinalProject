export const $root = $('#root');
export const $section = $('#section1');

var myAccountButton = document.getElementById("myAccount")
var myAccountModal = document.getElementById("myAccountModal")
var myAccountClose = document.getElementById("myAccountClose")

myAccountButton.onclick = function() {
    myAccountModal.style.display = 'block';
}

myAccountClose.onclick = function() {
    myAccountModal.style.display = 'none';
}

var createDeckButton = document.getElementById("createDeck")
var createDeckModal = document.getElementById("createDeckModal")
var createDeckClose = document.getElementById("createDeckClose")

createDeckButton.onclick = function() {
    createDeckModal.style.display = 'block';
}

createDeckClose.onclick = function() {
    createDeckModal.style.display = 'none';
}

var loginButton = document.getElementById("login")
var loginModal = document.getElementById("loginModal")
var loginClose = document.getElementById("loginClose")

loginButton.onclick = function() {
    loginModal.style.display = 'block';
}

loginClose.onclick = function() {
    loginModal.style.display = 'none';
}

var signupButton = document.getElementById("signup")
var signupModal = document.getElementById("signupModal")
var signupClose = document.getElementById("signupClose")

signupButton.onclick = function() {
    signupModal.style.display = 'block';
}

signupClose.onclick = function() {
    signupModal.style.display = 'none';
}

$(function() {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('user logged in', user);
            loadParking();
        } else {
            console.log('user logged out');
            //location.reload();
        }
    })
    
});

const deckList = document.querySelector('.decks');

const setupDecks = (data) => {

    let html = '';
    data.forEach(doc => {
        const deck = doc.data();
        console.log(deck)
    })
}


export const renderListItem = function(deck) {
    return `
    <div id="${deck.id}">
        <section class="section" style="border-bottom-style: solid; border-width: 0.5px">
        <div class="container">
            <div class="content has-text-left">
                <div class="title deckname" id="${deck.id}">${deck.name}</div>
                <div class="subtitle" style="color: white">${deck.address}</div>
                <div class="subtitle" style="color:white">Notes: ${deck.description}</div>
            </div>
            </div>
        </section>
    </div>
    `
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