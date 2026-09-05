
/* ================= GLOBAL VARIABLES  ================= */


let selectedTrip = {
    destination: "",
    price: 0,
    date: "",
    people: 1
};

let appliedDiscount = 0;

let toastTimer;

/* ================= PAGE NAVIGATION  ================= */

function showPage(pageName) {

    if (typeof event !== "undefined" && event) {
        event.preventDefault();
    }

    document.querySelectorAll(".page").forEach(function (page) {
        page.classList.remove("active-page");
    });

    const selectedPage =
        document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    document.querySelectorAll(".nav-link").forEach(function (link) {
        link.classList.remove("active");
    });

    document.querySelectorAll(".nav-link").forEach(function (link) {

        const text = link.textContent.trim();

        if (
            (pageName === "home" && text === "Home") ||
            (pageName === "services" && text === "Services") ||
            (pageName === "about" && text === "About") ||
            (pageName === "contact" && text === "Contact Us")
        ) {
            link.classList.add("active");
        }

    });

    const navigation =
        document.getElementById("navigation");

    if (navigation) {
        navigation.classList.remove("show");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageName === "bookings") {
        displayBookings();
    }

    if (pageName === "favorites") {
        displayFavorites();
    }

    if (pageName === "destinations") {
        updateFavoriteButtons();
    }
}


  /* =================  MOBILE MENU ================= */


function toggleMenu() {

    const menu =
        document.getElementById("navigation");

    if (menu) {
        menu.classList.toggle("show");
    }
}

/* ================= SEARCH ================= */

function searchTrip() {

    const destination =
        document.getElementById("destination").value;

    const date =
        document.getElementById("date").value;

    const people =
        parseInt(
            document.getElementById("people").value
        );


    if (destination === "") {

        showToast("Please select a destination.");

        return;
    }


    if (date === "") {

        showToast("Please select your travel date.");

        return;
    }


    if (!people || people < 1) {

        showToast("Please enter number of people.");

        return;
    }


    const saveSearch =
        document.getElementById("saveSearch").checked;


    if (saveSearch) {

        const search = {
            destination: destination,
            date: date,
            people: people
        };

        localStorage.setItem(
            "lastTourSearch",
            JSON.stringify(search)
        );

        showToast("Search saved successfully!");

    } else {

        showToast(
            "Trip found for " +
            destination +
            "!"
        );

    }


    setTimeout(function () {

        showPage("destinations");

    }, 800);
}


/* =================   BOOKING MODAL ================= */


function openBooking(destination, price) {

    selectedTrip.destination = destination;
    selectedTrip.price = price;

    const modal =
        document.getElementById("bookingModal");


    document.getElementById(
        "selectedDestination"
    ).textContent = destination;


    document.getElementById(
        "bookingDate"
    ).value = "";


    document.getElementById(
        "bookingPeople"
    ).value = 1;


    updateBookingPrice();

    modal.classList.add("show");
}


function closeBooking() {

    const modal =
        document.getElementById("bookingModal");

    modal.classList.remove("show");
}



/* =================  BOOKING PRICE CALCULATION  ================= */


function updateBookingPrice() {

    const people =
        parseInt(
            document.getElementById(
                "bookingPeople"
            ).value
        ) || 1;


    const total =
        selectedTrip.price * people;


    document.getElementById(
        "bookingPrice"
    ).textContent =
        formatCurrency(total);
}


 /* ================= CONTINUE TO PAYMENT   ================= */


function continueToPayment() {

    const date =
        document.getElementById(
            "bookingDate"
        ).value;


    const people =
        parseInt(
            document.getElementById(
                "bookingPeople"
            ).value
        ) || 0;


    if (date === "") {

        showToast(
            "Please select your travel date."
        );

        return;
    }


    const today =
        new Date().toISOString().split("T")[0];


    if (date < today) {

        showToast(
            "Please select a future travel date."
        );

        return;
    }


    if (people < 1) {

        showToast(
            "Please enter number of people."
        );

        return;
    }


    selectedTrip.date = date;
    selectedTrip.people = people;


    closeBooking();

    appliedDiscount = 0;


    document.getElementById(
        "coupon"
    ).value = "";


    document.getElementById(
        "couponMessage"
    ).textContent = "";


    updatePaymentPage();

    showPage("payment");

    showCouponHint();
}

 /* ================= UPDATE PAYMENT PAGE  ================= */


function updatePaymentPage() {

    const people =
        selectedTrip.people || 1;


    const basePrice =
        selectedTrip.price * people;


    document.getElementById(
        "paymentDestination"
    ).textContent =
        selectedTrip.destination;


    document.getElementById(
        "paymentPrice"
    ).textContent =
        formatCurrency(basePrice);


    document.getElementById(
        "paymentPeople"
    ).textContent =
        people;


    document.getElementById(
        "paymentDiscount"
    ).textContent =
        formatCurrency(appliedDiscount);


    const total =
        Math.max(
            0,
            basePrice - appliedDiscount
        );


    document.getElementById(
        "paymentTotal"
    ).textContent =
        formatCurrency(total);
}


  /* =================  COUPON  ================= */

function applyCoupon() {

    const couponInput = document.getElementById("coupon");
    const couponMessage = document.getElementById("couponMessage");
    const destinationElement = document.getElementById("paymentDestination");
    const priceElement = document.getElementById("paymentPrice");
    const discountElement = document.getElementById("paymentDiscount");
    const totalElement = document.getElementById("paymentTotal");

    const destination = destinationElement.textContent.trim();
    const enteredCode = couponInput.value.trim().toUpperCase();

    const coupons = {
        "Italy": {
            code: "ITALY10",
            discount: 10
        },
        "Greece": {
            code: "GREECE15",
            discount: 15
        },
        "Paris": {
            code: "PARIS20",
            discount: 20
        },
        "Maldives": {
            code: "MALDIVES12",
            discount: 12
        },
        "Dubai": {
            code: "DUBAI10",
            discount: 10
        },
        "Bali": {
            code: "BALI15",
            discount: 15
        }
    };

    const coupon = coupons[destination];

    if (!coupon) {
        couponMessage.textContent = "Coupon not available.";
        couponMessage.style.color = "red";
        return;
    }

    if (enteredCode === coupon.code) {

        const priceText = priceElement.textContent
            .replace(/[₹,]/g, "");

        const price = Number(priceText);

        const discountAmount = Math.round(
            price * coupon.discount / 100
        );

        const total = price - discountAmount;

        discountElement.textContent =
            "₹" + discountAmount.toLocaleString("en-IN");

        totalElement.textContent =
            "₹" + total.toLocaleString("en-IN");

        couponMessage.textContent =
            "Coupon applied! " + coupon.discount + "% discount.";

        couponMessage.style.color = "green";

    } else {

        discountElement.textContent = "₹0";

        totalElement.textContent = priceElement.textContent;

        couponMessage.textContent =
            "Invalid coupon code. Use " + coupon.code;

        couponMessage.style.color = "red";
    }
}

  /* ================= PAYMENT METHOD   ================= */


function changePaymentMethod() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    if (!selected) {
        return;
    }

    const method = selected.value;


    document.getElementById(
        "upiPayment"
    ).classList.add("hidden");


    document.getElementById(
        "cardPayment"
    ).classList.add("hidden");


    document.getElementById(
        "netbankingPayment"
    ).classList.add("hidden");


    if (method === "upi") {

        document.getElementById(
            "upiPayment"
        ).classList.remove("hidden");

    }


    if (method === "card") {

        document.getElementById(
            "cardPayment"
        ).classList.remove("hidden");

    }


    if (method === "netbanking") {

        document.getElementById(
            "netbankingPayment"
        ).classList.remove("hidden");

    }
}



   /* =================   PROCESS PAYMENT   ================= */


function processPayment() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!selected) {

        showToast(
            "Please select a payment method."
        );

        return;
    }


    const method = selected.value;


    /* UPI */

    if (method === "upi") {

        const upiInput =
            document.querySelector(
                "#upiPayment input"
            );


        if (!upiInput.value.trim()) {

            showToast(
                "Please enter your UPI ID."
            );

            return;
        }


        if (!upiInput.value.includes("@")) {

            showToast(
                "Please enter a valid UPI ID."
            );

            return;
        }
    }


    /* CARD */

    if (method === "card") {

        const cardNumber =
            document.querySelector(
                "#cardPayment input[type='text']"
            );


        const cardInputs =
            document.querySelectorAll(
                "#cardPayment input"
            );


        for (
            let i = 0;
            i < cardInputs.length;
            i++
        ) {

            if (!cardInputs[i].value.trim()) {

                showToast(
                    "Please complete card details."
                );

                return;
            }
        }


        if (
            cardNumber.value.replace(/\s/g, "").length < 16
        ) {

            showToast(
                "Please enter a valid card number."
            );

            return;
        }
    }


    /* NET BANKING */

    if (method === "netbanking") {

        const bank =
            document.querySelector(
                "#netbankingPayment select"
            ).value;


        if (bank === "") {

            showToast(
                "Please select your bank."
            );

            return;
        }
    }


    /* DEMO BOOKING */

    const booking = {

        id:
            "TR" +
            Date.now(),

        destination:
            selectedTrip.destination,

        date:
            selectedTrip.date,

        people:
            selectedTrip.people,

        price:
            selectedTrip.price,

        discount:
            appliedDiscount,

        total:
            Math.max(
                0,
                selectedTrip.price *
                selectedTrip.people -
                appliedDiscount
            ),

        paymentMethod:
            method,

        status:
            "Confirmed",

        createdAt:
            new Date().toLocaleString()

    };


    saveBooking(booking);


    showToast(
        "Payment successful! Booking confirmed."
    );


    setTimeout(function () {

        showPage("bookings");

        displayBookings();

    }, 1200);
}

   /* =================  SAVE BOOKING ================= */



function saveBooking(booking) {

    let bookings =
        JSON.parse(
            localStorage.getItem(
                "tourBookings"
            )
        ) || [];


    bookings.push(booking);


    localStorage.setItem(
        "tourBookings",
        JSON.stringify(bookings)
    );
}



  /* =================   DISPLAY BOOKINGS ================= */



function displayBookings() {

    const container =
        document.getElementById(
            "bookingList"
        );


    if (!container) {
        return;
    }


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "tourBookings"
            )
        ) || [];


    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="empty-bookings">

                <div class="empty-icon">
                    🧳
                </div>

                <h2>
                    No bookings yet
                </h2>

                <p>
                    Your confirmed bookings
                    will appear here.
                </p>

                <button
                    onclick="showPage('destinations')">
                    Explore Destinations
                </button>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    bookings.slice().reverse().forEach(
        function (booking, reverseIndex) {

            const index =
                bookings.length -
                1 -
                reverseIndex;


            const card =
                document.createElement("div");


            card.className =
                "booking-card";


            card.innerHTML = `

                <h3>
                    🧳 ${booking.destination}
                </h3>

                <p>
                    <strong>Booking ID:</strong>
                    ${booking.id}
                </p>

                <p>
                    <strong>Travel Date:</strong>
                    ${booking.date}
                </p>

                <p>
                    <strong>Travelers:</strong>
                    ${booking.people}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${booking.paymentMethod.toUpperCase()}
                </p>

                <p>
                    <strong>Total Paid:</strong>
                    ${formatCurrency(booking.total)}
                </p>

                <span class="booking-status">
                    ✓ ${booking.status}
                </span>

                <br>

                <button
                    class="cancel-booking"
                    onclick="cancelBooking(${index})">

                    Cancel Booking

                </button>

            `;


            container.appendChild(card);

        }
    );
}


 /* =================    CANCEL BOOKING  ================= */


function cancelBooking(index) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmCancel) {
        return;
    }


    let bookings =
        JSON.parse(
            localStorage.getItem(
                "tourBookings"
            )
        ) || [];


    bookings.splice(index, 1);


    localStorage.setItem(
        "tourBookings",
        JSON.stringify(bookings)
    );


    displayBookings();


    showToast(
        "Booking cancelled."
    );
}


  /* =================     FAVORITES ================= */


function getFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "tourFavorites"
        )
    ) || [];
}


function saveFavorites(favorites) {

    localStorage.setItem(
        "tourFavorites",
        JSON.stringify(favorites)
    );
}


function toggleFavorite(button, destination) {

    let favorites =
        getFavorites();


    const index =
        favorites.indexOf(destination);


    if (index === -1) {

        favorites.push(destination);

        button.classList.add("favorite");

        button.textContent = "♥";

        showToast(
            destination +
            " added to favorites."
        );

    } else {

        favorites.splice(index, 1);

        button.classList.remove("favorite");

        button.textContent = "♡";

        showToast(
            destination +
            " removed from favorites."
        );
    }


    saveFavorites(favorites);

    displayFavorites();
}


function displayFavorites() {

    const container =
        document.getElementById(
            "favoriteList"
        );

    if (!container) {
        return;
    }

    const favorites =
        getFavorites();

    if (favorites.length === 0) {

        container.innerHTML = `

            <div class="empty-bookings">

                <div class="empty-icon">
                    ❤️
                </div>

                <h2>
                    No favorites yet
                </h2>

                <p>
                    Save destinations you want
                    to visit later.
                </p>

                <button
                    onclick="showPage('destinations')">
                    Explore Destinations
                </button>

            </div>

        `;

        return;
    }

    container.innerHTML = "";

    favorites.forEach(function (destination) {

        const item =
            document.createElement("div");

        item.className =
            "favorite-item";

        item.innerHTML = `

            <h3>
                ❤️ ${destination}
            </h3>

          <button type="button" onclick="removeFavorite('${destination}')">
    Remove
</button>

        `;

        container.appendChild(item);

    });
}

function removeFavorite(destination) {

    let favorites =
        getFavorites();

    favorites =
        favorites.filter(
            function(item) {
                return item !== destination;
            }
        );

    saveFavorites(favorites);

    displayFavorites();

    updateFavoriteButtons();

    showToast(
        destination +
        " removed from favorites."
    );
}

function updateFavoriteButtons() {

    const favorites =
        getFavorites();


    document.querySelectorAll(
        ".favorite-button"
    ).forEach(function (button) {

        const onclickText =
            button.getAttribute("onclick");


        if (!onclickText) {
            return;
        }


        const match =
            onclickText.match(
                /['"]([^'"]+)['"]\s*\)/
            );


        if (!match) {
            return;
        }


        const destination =
            match[1];


        if (
            favorites.includes(destination)
        ) {

            button.classList.add("favorite");

            button.textContent = "♥";

        } else {

            button.classList.remove("favorite");

            button.textContent = "♡";

        }

    });
}

 /* =================   DARK MODE  ================= */

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        "tourDarkMode",
        isDark
    );


    showToast(
        isDark
            ? "Dark mode enabled."
            : "Light mode enabled."
    );
}


function loadDarkMode() {

    const darkMode =
        localStorage.getItem(
            "tourDarkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark-mode"
        );

    }
}


/* =============== CONTACT FORM ==================== */

function sendMessage(e) {

    e.preventDefault();


    const name =
        document.getElementById(
            "name"
        ).value.trim();


    showToast(
        "Thank you, " +
        name +
        "! Your message has been submitted."
    );


    e.target.reset();
}


/* =================   DESTINATION FILTER =================== */

function filterDestinations() {

    const search =
        document.getElementById(
            "destinationSearch"
        ).value
            .toLowerCase();


    const region =
        document.getElementById(
            "continentFilter"
        ).value;


    document.querySelectorAll(
        "#destinationGrid .destination-card"
    ).forEach(function (card) {

        const name =
            card.dataset.name.toLowerCase();

        const cardRegion =
            card.dataset.region;


        const matchesSearch =
            name.includes(search);


        const matchesRegion =
            region === "all" ||
            cardRegion === region;


        if (
            matchesSearch &&
            matchesRegion
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });
}


/* ==================  TYPING EFFECT ================= */

const places = [
    "San Francisco",
    "Italy",
    "Greece",
    "Maldives",
    "Dubai",
    "Bali"
];


let placeIndex = 0;
let letterIndex = 0;
let deleting = false;


function typingEffect() {

    const typing =
        document.getElementById(
            "typing"
        );


    if (!typing) {
        return;
    }


    const currentPlace =
        places[placeIndex];


    if (!deleting) {

        typing.textContent =
            currentPlace.substring(
                0,
                letterIndex + 1
            );


        letterIndex++;


        if (
            letterIndex ===
            currentPlace.length
        ) {

            deleting = true;


            setTimeout(
                typingEffect,
                1200
            );

            return;
        }

    } else {

        typing.textContent =
            currentPlace.substring(
                0,
                letterIndex - 1
            );


        letterIndex--;


        if (letterIndex === 0) {

            deleting = false;

            placeIndex++;


            if (
                placeIndex >=
                places.length
            ) {

                placeIndex = 0;

            }
        }
    }


    setTimeout(
        typingEffect,
        deleting ? 60 : 100
    );
}


/* =============== TOAST ==================== */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(function () {

            toast.classList.remove(
                "show"
            );

        }, 3000);
}


/* ============== CURRENCY FORMAT ================ */

function formatCurrency(amount) {

    return "₹" +
        Number(amount).toLocaleString(
            "en-IN"
        );
}


/* ================= CLOSE MODAL ================= */

window.addEventListener(
    "click",
    function (e) {

        const modal =
            document.getElementById(
                "bookingModal"
            );


        if (
            e.target === modal
        ) {

            closeBooking();

        }
    }
);


/* ================  DATE MINIMUM ================ */

function setMinimumDates() {

    const today =
        new Date().toISOString().split("T")[0];


    const dateInputs =
        document.querySelectorAll(
            'input[type="date"]'
        );


    dateInputs.forEach(function (input) {

        input.min = today;

    });
}


/* ================= LOAD SAVED SEARCH ================== */

function loadSavedSearch() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                "lastTourSearch"
            )
        );


    if (!saved) {
        return;
    }


    const destination =
        document.getElementById(
            "destination"
        );


    const date =
        document.getElementById(
            "date"
        );


    const people =
        document.getElementById(
            "people"
        );


    if (destination) {
        destination.value =
            saved.destination;
    }


    if (date) {
        date.value =
            saved.date;
    }


    if (people) {
        people.value =
            saved.people;
    }
}

/* ================= LOGIN SYSTEM =================== */

/* ================= SHOW LOGIN ================= */

function showLogin() {

    document.getElementById("loginFormBox")
        .classList.remove("hidden-auth");

    document.getElementById("createAccountBox")
        .classList.add("hidden-auth");
}


/* ================= SHOW CREATE ACCOUNT ================= */

function showCreateAccount() {

    document.getElementById("loginFormBox")
        .classList.add("hidden-auth");

    document.getElementById("createAccountBox")
        .classList.remove("hidden-auth");
}


/* ================= CREATE ACCOUNT ================= */

function createAccount(e) {

    e.preventDefault();

    const username =
        document.getElementById("createUsername")
            .value.trim();

    const password =
        document.getElementById("createPassword")
            .value;

    const confirmPassword =
        document.getElementById("confirmPassword")
            .value;


    if (username === "" || password === "") {

        showToast("Please fill all fields.");

        return;
    }


    if (password.length < 4) {

        showToast(
            "Password must contain at least 4 characters."
        );

        return;
    }


    if (password !== confirmPassword) {

        showToast(
            "Passwords do not match."
        );

        return;
    }


    const existingAccount =
        JSON.parse(
            localStorage.getItem("tourAccount")
        );


    if (
        existingAccount &&
        existingAccount.username.toLowerCase() ===
        username.toLowerCase()
    ) {

        showToast(
            "Account already exists. Please login."
        );

        showLogin();

        return;
    }


    const account = {

        username: username,
        password: password

    };


    localStorage.setItem(
        "tourAccount",
        JSON.stringify(account)
    );


    document.getElementById(
        "createUsername"
    ).value = "";

    document.getElementById(
        "createPassword"
    ).value = "";

    document.getElementById(
        "confirmPassword"
    ).value = "";


    showToast(
        "Account created successfully! Please login."
    );


    showLogin();
}


/* ================= LOGIN ================= */

function loginUser(e) {

    e.preventDefault();


    const username =
        document.getElementById("loginUsername")
            .value.trim();

    const password =
        document.getElementById("loginPassword")
            .value;


    const account =
        JSON.parse(
            localStorage.getItem("tourAccount")
        );


    if (!account) {

        showToast(
            "No account found. Please create an account first."
        );

        return;
    }


    if (
        username === account.username &&
        password === account.password
    ) {

        localStorage.setItem(
            "tourLoggedIn",
            "true"
        );


        localStorage.setItem(
            "tourUsername",
            account.username
        );


        document.getElementById(
            "loginUsername"
        ).value = "";

        document.getElementById(
            "loginPassword"
        ).value = "";


        showToast(
            "Login successful! Welcome " +
            account.username
        );


        setTimeout(function () {

            showMainWebsite();

        }, 700);


    } else {

        showToast(
            "Invalid username or password."
        );

    }
}


/* ================= SHOW MAIN WEBSITE ================= */

function showMainWebsite() {

    const loginPage =
        document.getElementById("loginPage");


    if (loginPage) {

        loginPage.style.display = "none";

    }


    document.querySelectorAll(
        ".navbar, .page, footer"
    ).forEach(function (element) {

        element.style.display = "";

    });


    showPage("home");
}


/* ================= LOGOUT ================= */

function logoutUser() {

    localStorage.removeItem(
        "tourLoggedIn"
    );

    localStorage.removeItem(
        "tourUsername"
    );


    document.querySelectorAll(
        ".navbar, .page, footer"
    ).forEach(function (element) {

        element.style.display = "none";

    });


    const loginPage =
        document.getElementById("loginPage");


    if (loginPage) {

        loginPage.style.display = "flex";

    }


    showLogin();


    showToast(
        "You have been logged out."
    );
}


/* ================= CHECK LOGIN ================= */

function checkLogin() {

    const loginPage =
        document.getElementById(
            "loginPage"
        );


    if (!loginPage) {
        return;
    }

        loginPage.style.display = "flex";


        document.querySelectorAll(
            ".navbar, .page, footer"
        ).forEach(function (element) {

            element.style.display = "none";

        });

    }


/* ===================  PAGE LOAD ================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        typingEffect();

        displayBookings();

        displayFavorites();

        updateFavoriteButtons();

        loadDarkMode();

        setMinimumDates();

        loadSavedSearch();

        changePaymentMethod();

        checkLogin();

    }
);