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
var alertClose = document.getElementById("alertClose")
var alertButtonClose = document.getElementById("noThanks")
var takeToSignUp = document.getElementById("takeToSignUp")

signupButton.onclick = function() {
    signupModal.style.display = 'block';
}

signupClose.onclick = function() {
    signupModal.style.display = 'none';
}


//credit JayantaTalukdar
const debounce = (func, delay) => { 
    let debounceTimer 
    return function() { 
        const context = this
        const args = arguments 
            clearTimeout(debounceTimer) 
                debounceTimer 
            = setTimeout(() => func.apply(context, args), delay) 
    } 
}  

window.addEventListener('scroll', debounce(function() { 
   
alertModal.style.display = 'block';
     }, 5000)); 


     alertClose.onclick = function() {
        alertModal.style = 'none';
    }

    alertButtonClose.onclick = function() {
        alertModal.style = 'none';
    }
    takeToSignUp.onclick = function () {
        alertModal.style = 'none';
        signupModal.style.display = 'block';
    }

