// get data
db.collection('decks').get().then(snapshot => {
    setupDecks(snapshot.docs);
})

const deckList = document.querySelector('.decks');

const setupDecks = (data) => {

    let html = '';
    data.forEach(doc => {
        const theDeck = doc.data();
        const div = `
        <div class="card">
      <div class="card-content">
        <div>
            <p class="title is-2">${theDeck.deck}</p>
            <p class="subtitle is-4">${theDeck.address}</p>
            <h1>${theDeck.notes}</p>
        </div>
      </div>
      <footer class="card-footer">
          <div class="buttons">
              <button class="button is-primary">Save</button>
              <button class="button is-primary">Edit</button>
              <button class="button is-primary">Delete</button>
            </div>
        </footer>
    </div>
        `;
        html += div;
    });

    deckList.innerHTML = html;
}

// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in', user);
    } else {
        console.log('user logged out');
    }
})

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

















