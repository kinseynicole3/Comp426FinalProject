export const $root = $('#root');
export const $section = $('#section1');



$(function() {
    loadParking();
});

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