// go to top button
let up = document.querySelector(".up");
let nav = document.querySelector(".navbar");
let btt = document.getElementById("btt");

window.onscroll = function () {
    // show button
    this.scrollY >= 1000 ? up.classList.add('show') : up.classList.remove('show');
    // convert nav background color
    if (this.scrollY >= 100) {
        nav.style.cssText = "background: black !important"
    } else {

        nav.style.cssText = "background: transparent"
    }

}

btt.onclick = function () {
    nav.classList.toggle("bg-black");
}


up.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
})

// focus inputs
let inp = document.querySelectorAll("form input");
inp.forEach(element => {
    element.addEventListener("blur", function () {
        if (element.value !== "") {
            element.nextElementSibling.focus();
        }
    })
});


// iframe loader
let loader = document.getElementById("loader");
let body = document.getElementById("body-with-load");
let h1 = document.querySelector(".landing h1");
let p = document.querySelector(".landing p");
let btn = document.querySelector(".landing .btn");

setTimeout(function () {
    loader.classList.add("d-none");
    body.classList.remove("overflow-hidden");
    h1.classList.add("bounceIn");
    p.classList.add("bounceIn");
    btn.classList.add("bounceInUp");
}, 3000);