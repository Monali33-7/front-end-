// ================= HOTEL DETAILS =================


let hotels = [
    // HYDERABAD
    {
        id: 1,
        name: "Grand Palace Hotel",
        city: "Hyderabad",
        price: 3500,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
    },
    {
        id: 2,
        name: "Taj Krishna",
        city: "Hyderabad",
        price: 5000,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
    },
    {
        id: 3,
        name: "Luxury Stay",
        city: "Hyderabad",
        price: 4200,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600"
    },

    // VIJAYAWADA
    {
        id: 4,
        name: "Royal Comfort",
        city: "Vijayawada",
        price: 2500,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600"
    },
    {
        id: 5,
        name: "Grand Vijayawada",
        city: "Vijayawada",
        price: 3000,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600"
    },
    {
        id: 6,
        name: "City View Hotel",
        city: "Vijayawada",
        price: 2200,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"
    },

    // GOA
    {
        id: 7,
        name: "Ocean View Resort",
        city: "Goa",
        price: 4500,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"
    },
    {
        id: 8,
        name: "Beach Paradise",
        city: "Goa",
        price: 5500,
        image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600"
    },
    {
        id: 9,
        name: "Palm Tree Resort",
        city: "Goa",
        price: 4000,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
    },

    // BANGALORE
    {
        id: 10,
        name: "Luxury Inn",
        city: "Bangalore",
        price: 3000,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600"
    },
    {
        id: 11,
        name: "Green Garden Hotel",
        city: "Bangalore",
        price: 3500,
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600"
    },
    {
        id: 12,
        name: "Royal Suites",
        city: "Bangalore",
        price: 4000,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
    }
];



// ================= DISPLAY HOTELS =================


function displayHotels(list) {
    let output = "";

    list.forEach(hotel => {
        output += `
        <div class="hotel">
            <img src="${hotel.image}" alt="${hotel.name}">

            <div class="hotel-info">
                <h3>${hotel.name}</h3>
                <p>📍 ${hotel.city}</p>
                <p>₹${hotel.price} / night</p>

                <button onclick="addToCart(${hotel.id})">
                    Add to Cart
                </button>

                <button onclick="openBooking(${hotel.id})">
                    Book Now
                </button>

                <button onclick="showDetails(${hotel.id})">
                    View Details
                </button>
            </div>
        </div>`;
    });

    document.getElementById("hotelList").innerHTML =
        output || "<p>No hotels found!</p>";
}



// ================= SEARCH HOTELS =================



function applyFilters() {
    let city = document.getElementById("search").value.toLowerCase();
    let maxPrice = document.getElementById("priceFilter").value;
    let sort = document.getElementById("sortFilter").value;

    let filteredHotels = hotels.filter(hotel => {
        let cityMatch = hotel.city.toLowerCase().includes(city);
        let priceMatch = maxPrice === "all" ||
                         hotel.price < Number(maxPrice);

        return cityMatch && priceMatch;
    });

    if (sort === "low") {
        filteredHotels.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filteredHotels.sort((a, b) => b.price - a.price);
    }

    displayHotels(filteredHotels);
}

// ================= LOGIN AND REGISTER =================

let users = JSON.parse(localStorage.getItem("users")) || [];

let currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || null;

let isRegister = false;

let pendingHotel = null;
let selectedHotel = null;


// OPEN LOGIN

function openLogin() {
    document.getElementById("authModal").style.display = "flex";
    isRegister = false;
    showForm();
}


// CLOSE LOGIN

function closeLogin() {
    document.getElementById("authModal").style.display = "none";
}


// SWITCH FORM

function switchForm() {
    isRegister = !isRegister;
    showForm();
}


// SHOW FORM

function showForm() {
    document.getElementById("formTitle").innerText =
        isRegister ? "Register" : "Login";

    document.getElementById("name").hidden = !isRegister;
    document.getElementById("name").required = isRegister;

    document.getElementById("submitBtn").innerText =
        isRegister ? "Register" : "Login";

    document.getElementById("switchText").innerHTML =
        isRegister
        ? 'Already registered? <a href="#" onclick="switchForm(); return false;">Login</a>'
        : 'New user? <a href="#" onclick="switchForm(); return false;">Register</a>';

    document.getElementById("message").innerText = "";
}


// LOGIN / REGISTER SUBMISSION

document.getElementById("authForm").addEventListener(
    "submit", function(e) {

        e.preventDefault();

        let name = document.getElementById("name").value.trim();

        let email = document.getElementById("email")
            .value.trim().toLowerCase();

        let password = document.getElementById("password").value;

        if (isRegister) {

            if (users.some(u => u.email === email)) {
                showMessage("Email already exists!");
                return;
            }

            users.push({ name, email, password });

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );
        }

        let user = users.find(u =>
            u.email === email && u.password === password
        );

        if (!user) {
            showMessage("Invalid email or password!");
            return;
        }

        currentUser = {
            name: user.name,
            email: user.email
        };

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        closeLogin();
        updateHeader();

        this.reset();

        // Add pending hotel to cart

        if (pendingHotel !== null) {
            let id = pendingHotel;
            pendingHotel = null;
            addSelectedHotel(id);
        }

        // Open pending hotel booking

        if (selectedHotel !== null) {
            let id = selectedHotel;
            selectedHotel = null;
            openBooking(id);
        }

        alert("Login successful!");
    }
);


// SHOW MESSAGE

function showMessage(msg) {
    document.getElementById("message").innerText = msg;
}


// UPDATE HEADER


// UPDATE HEADER
function updateHeader() {
    let authBtn = document.getElementById("authBtn");
    let profileBtn = document.getElementById("profileBtn");
    let logoutBtn = document.getElementById("logoutBtn");

    if (currentUser) {
        authBtn.hidden = true;
        profileBtn.hidden = false;
        logoutBtn.hidden = false;
    } else {
        authBtn.hidden = false;
        profileBtn.hidden = true;
        logoutBtn.hidden = true;
    }
}

// OPEN PROFILE
function openProfile() {
    if (!currentUser) {
        alert("Please login first!");
        openLogin();
        return;
    }

    document.getElementById("profileName").innerText =
        currentUser.name;

    document.getElementById("profileEmail").innerText =
        currentUser.email;

    document.getElementById("profileModal").style.display =
        "flex";
}

// CLOSE PROFILE
function closeProfile() {
    document.getElementById("profileModal").style.display =
        "none";
}

// LOGOUT
function logout() {
    currentUser = null;

    localStorage.removeItem("currentUser");

    closeProfile();
    updateHeader();

    alert("Logged out successfully!");
}



// ================= CART SYSTEM =================


// GET CART

function getCart() {
    if (!currentUser) return [];

    return JSON.parse(
        localStorage.getItem("cart_" + currentUser.email)
    ) || [];
}


// SAVE CART

function saveCart(cart) {
    localStorage.setItem(
        "cart_" + currentUser.email,
        JSON.stringify(cart)
    );
}


// ADD TO CART

function addToCart(id) {
    if (!currentUser) {
        pendingHotel = id;

        alert("Please login or register first!");

        openLogin();
        return;
    }

    addSelectedHotel(id);
}


// ADD SELECTED HOTEL

function addSelectedHotel(id) {
    let hotel = hotels.find(h => h.id === id);

    if (!hotel) return;

    let cart = getCart();

    if (cart.some(h => h.id === id)) {
        alert("Hotel already added to cart!");
        return;
    }

    cart.push(hotel);

    saveCart(cart);

    alert("Hotel added to cart!");
}


// OPEN CART

function openCart() {
    if (!currentUser) {
        alert("Please login to view your cart!");
        openLogin();
        return;
    }

    displayCart();

    document.getElementById("cartModal").style.display = "flex";
}


// CLOSE CART

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}


// DISPLAY CART

function displayCart() {
    let cart = getCart();

    let container = document.getElementById("cartItems");

    let total = 0;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty!</p>";
    }

    cart.forEach(hotel => {

        total += Number(hotel.price);

        container.innerHTML += `
        <div class="cart-item">
            <h3>${hotel.name}</h3>
            <p>₹${hotel.price} / night</p>

            <button onclick="removeFromCart(${hotel.id})">
                Remove
            </button>

            <button onclick="openBooking(${hotel.id})">
                Book Now
            </button>
        </div>`;
    });

    document.getElementById("cartTotal").innerText =
        "Total: ₹" + total + " / night";
}


// REMOVE FROM CART

function removeFromCart(id) {
    let cart = getCart();

    cart = cart.filter(h => h.id !== id);

    saveCart(cart);

    displayCart();
}


// ================= BOOKING SYSTEM =================


// GET TODAY'S LOCAL DATE

function getToday() {
    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// OPEN BOOKING FORM

function openBooking(id) {

    if (!currentUser) {
        selectedHotel = id;

        alert("Please login first!");

        openLogin();
        return;
    }

    let hotel = hotels.find(h => h.id === id);

    if (!hotel) return;

    document.getElementById("bookingHotelName").innerText =
        hotel.name + " - ₹" + hotel.price + " / night";

    document.getElementById("bookingMessage").innerText = "";

    document.getElementById("bookingForm").reset();

    let today = getToday();

    document.getElementById("checkin").min = today;
    document.getElementById("checkout").min = today;

    document.getElementById("bookingModal").style.display = "flex";
}


// CLOSE BOOKING FORM

function closeBooking() {
    document.getElementById("bookingModal").style.display = "none";
}


// CHECK-IN DATE CHANGE

document.getElementById("checkin").addEventListener(
    "change", function() {

        let checkout = document.getElementById("checkout");

        checkout.min = this.value;

        if (checkout.value && checkout.value <= this.value) {
            checkout.value = "";
        }
    }
);


// CONFIRM BOOKING

document.getElementById("bookingForm").addEventListener(
    "submit", function(e) {

        e.preventDefault();

        if (!currentUser) {
            alert("Please login first!");
            closeBooking();
            openLogin();
            return;
        }

        let checkin = document.getElementById("checkin").value;

        let checkout = document.getElementById("checkout").value;

        let guests = document.getElementById("guests").value;

        let today = getToday();

        if (checkin < today || checkout <= checkin) {
            document.getElementById("bookingMessage").innerText =
                "Please select valid booking dates!";
            return;
        }

        let hotelName =
            document.getElementById("bookingHotelName").innerText;

        let hotel = hotels.find(h =>
            hotelName.startsWith(h.name)
        );

        if (!hotel) return;

        let date1 = new Date(checkin + "T00:00:00");
        let date2 = new Date(checkout + "T00:00:00");

        let nights = Math.round(
            (date2 - date1) / (1000 * 60 * 60 * 24)
        );

        let totalPrice = nights * hotel.price;

        let bookings = JSON.parse(
            localStorage.getItem("bookings_" + currentUser.email)
        ) || [];

        let booking = {
            id: Date.now(),
            hotel: hotel.name,
            city: hotel.city,
            checkin: checkin,
            checkout: checkout,
            guests: guests,
            nights: nights,
            pricePerNight: hotel.price,
            totalPrice: totalPrice
        };

        bookings.push(booking);

        localStorage.setItem(
            "bookings_" + currentUser.email,
            JSON.stringify(bookings)
        );

        document.getElementById("bookingMessage").innerHTML =
            "🎉 Booking confirmed successfully!<br>" +
            "Hotel: " + hotel.name + "<br>" +
            "Nights: " + nights + "<br>" +
            "Guests: " + guests + "<br>" +
            "Total Amount: ₹" + totalPrice;

        this.reset();
    }
);


// ================= INITIAL LOADING =================

displayHotels(hotels);

updateHeader();

// SHOW MY BOOKINGS
function showMyBookings() {
    if (!currentUser) {
        alert("Please login first!");
        openLogin();
        return;
    }

    let key = "bookings_" + currentUser.email;
    let bookings = JSON.parse(localStorage.getItem(key)) || [];

    let output = "";

    if (bookings.length === 0) {
        output = "<p>No bookings found!</p>";
    } else {
        bookings.forEach((booking, index) => {
            output += `
                <div class="booking-card">
                    <h3>${booking.hotelName || booking.hotel || booking.name || "Hotel"}</h3>
                    <p>City: ${booking.city || "Not available"}</p>
                    <p>Check-in: ${booking.checkin || booking.checkIn}</p>
                    <p>Check-out: ${booking.checkout || booking.checkOut}</p>
                    <p>Guests: ${booking.guests}</p>
                    <p>Total: ₹${booking.totalPrice}</p>
                    <button onclick="cancelBooking(${index})">
                        Cancel Booking
                    </button>
                </div>
                <hr>
            `;
        });
    }

    document.getElementById("myBookingsList").innerHTML = output;
    document.getElementById("myBookingsModal").style.display = "block";
}

// CLOSE MY BOOKINGS
function closeMyBookings() {
    document.getElementById("myBookingsModal").style.display = "none";
}

// CANCEL BOOKING
function cancelBooking(index) {
    if (!confirm("Are you sure you want to cancel this booking?")) {
        return;
    }

    let key = "bookings_" + currentUser.email;
    let bookings = JSON.parse(localStorage.getItem(key)) || [];

    bookings.splice(index, 1);

    localStorage.setItem(key, JSON.stringify(bookings));

    alert("Booking cancelled!");
    showMyBookings();
}


function showDetails(id) {
    let hotel = hotels.find(h => h.id === id);

    document.getElementById("detailName").innerText =
        hotel.name;

    document.getElementById("detailImage").src =
        hotel.image;

    document.getElementById("detailCity").innerText =
        "📍 " + hotel.city;

    document.getElementById("detailPrice").innerText =
        "₹" + hotel.price + " / night";

    document.getElementById("detailDescription").innerText =
        "Enjoy a comfortable and relaxing stay at " +
        hotel.name + ". Perfect for family and business trips.";

    document.getElementById("detailFacilities").innerHTML =
        "<li>Free Wi-Fi</li>" +
        "<li>Swimming Pool</li>" +
        "<li>Restaurant</li>" +
        "<li>Parking</li>" +
        "<li>Room Service</li>";

    document.getElementById("detailBookBtn").onclick =
        function() {
            closeDetails();
            openBooking(id);
        };

    // DISPLAY CUSTOMER REVIEWS
    displayReviews(id);

    // OPEN HOTEL DETAILS
    document.getElementById("detailsModal").style.display =
        "block";
}

function closeDetails() {
    document.getElementById("detailsModal").style.display =
        "none";
}



let reviewHotelId = null;

// DISPLAY REVIEWS
function displayReviews(id) {
    reviewHotelId = id;

    let reviews = JSON.parse(
        localStorage.getItem("reviews_" + id)
    ) || [];

    let output = "";

    if (reviews.length === 0) {
        output = "<p>No reviews yet. Be the first!</p>";
    }

    reviews.forEach(review => {
        output += `
            <div class="review-card">
                <h4>${"⭐".repeat(review.rating)}</h4>
                <p>${review.text}</p>
                <small>By ${review.user}</small>
            </div>
        `;
    });

    document.getElementById("reviewsList").innerHTML = output;
}

// SUBMIT REVIEW
document.getElementById("reviewForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        if (!currentUser) {
            alert("Please login to write a review!");
            openLogin();
            return;
        }

        let rating = Number(
            document.getElementById("reviewRating").value
        );

        let reviewText =
            document.getElementById("reviewText").value;

        let key = "reviews_" + reviewHotelId;

        let reviews = JSON.parse(
            localStorage.getItem(key)
        ) || [];

        reviews.push({
            rating: rating,
            text: reviewText,
            user: currentUser.name || currentUser.email
        });

        localStorage.setItem(key, JSON.stringify(reviews));

        alert("Review submitted successfully!");

        document.getElementById("reviewForm").reset();

        displayReviews(reviewHotelId);
    }
);