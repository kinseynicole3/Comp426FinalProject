export const $root = $('#root');


$(function() {
    loadParking();
});

export const renderListItem = function(deck) {
    return `
    <div id="${deck.id}">
        <section class="section" style="border-bottom-style: solid; border-width: 0.5px">
        <div class="container">
            <div class="content has-text-left">
                <div class="title" style="color: white"><a>${deck.name}</a></div>
                <div class="subtitle" style="color: white">${deck.address}</div>
                <div class="subtitle" style="color:white">Notes: ${deck.description}</div>
            </div>
            </div>
        </section>
    </div>
    `
}


export const loadParking = function() {
    parkingDecks.forEach(deck => {
        $root.append(renderListItem(deck));
    })
}