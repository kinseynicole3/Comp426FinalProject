// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in', user);
    } else {
        console.log('user logged out');
        //location.reload();
        
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

















