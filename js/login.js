// ===============================
// CAR-ZONE AUTHENTICATION
// ===============================

// Get logged-in user
function getCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem("carZoneUser"));
    } catch {
        return null;
    }
}

// Redirect to login and remember the requested page
function requireLogin(destination) {
    sessionStorage.setItem("carZoneRedirect", destination || "index.html");
    window.location.href = "login.html?mode=login";
}

// Redirect after successful login/register
function redirectAfterAuth() {
    let destination = sessionStorage.getItem("carZoneRedirect");

    sessionStorage.removeItem("carZoneRedirect");

    if (!destination || destination.startsWith("//")) {
        destination = "index.html";
    }

    window.location.href = destination;
}


// ===============================
// LOGIN / REGISTER TABS
// ===============================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function showLoginForm() {
    if (!loginForm || !registerForm) return;

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");
}

function showRegisterForm() {
    if (!loginForm || !registerForm) return;

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");
}

if (loginTab && registerTab) {
    loginTab.addEventListener("click", showLoginForm);
    registerTab.addEventListener("click", showRegisterForm);

    document.getElementById("showRegister").addEventListener("click", function(event) {
        event.preventDefault();
        showRegisterForm();
    });

    document.getElementById("showLogin").addEventListener("click", function(event) {
        event.preventDefault();
        showLoginForm();
    });

    // Open the correct form from the URL
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    if (params.get("from") === "home") {
        sessionStorage.removeItem("carZoneRedirect");
    }

    if (mode === "register") {
        showRegisterForm();
    } else {
        showLoginForm();
    }
}


// ===============================
// REGISTER
// ===============================

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            message.style.color = "red";
            message.textContent = "Passwords do not match.";
            return;
        }

        let users = JSON.parse(sessionStorage.getItem("carZoneUsers") || "[]");

        const existingUser = users.find(function(user) {
            return user.email === email;
        });

        if (existingUser) {
            message.style.color = "red";
            message.textContent = "This email is already registered.";
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        sessionStorage.setItem("carZoneUsers", JSON.stringify(users));

        sessionStorage.setItem("carZoneUser", JSON.stringify({
            name: name,
            email: email
        }));

        message.style.color = "green";
        message.textContent = "Registration successful! Redirecting...";

        setTimeout(redirectAfterAuth, 700);
    });
}


// ===============================
// LOGIN
// ===============================

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        const users = JSON.parse(sessionStorage.getItem("carZoneUsers") || "[]");

        const matchedUser = users.find(function(user) {
            return user.email === email && user.password === password;
        });

        if (!matchedUser) {
            message.style.color = "red";
            message.textContent = "Invalid email or password.";
            return;
        }

        sessionStorage.setItem("carZoneUser", JSON.stringify({
            name: matchedUser.name,
            email: matchedUser.email
        }));

        message.style.color = "green";
        message.textContent = "Login successful! Redirecting...";

        setTimeout(redirectAfterAuth, 700);
    });
}


// ===============================
// PROTECT RESTRICTED LINKS
// ===============================

document.addEventListener("click", function(event) {
    const protectedLink = event.target.closest(".protected-action");

    if (!protectedLink) return;

    if (!getCurrentUser()) {
        event.preventDefault();
        requireLogin(protectedLink.getAttribute("href"));
    }
});


// ===============================
// PROTECT SELL PAGE
// ===============================

const currentPage = window.location.pathname.split("/").pop();

if (currentPage === "sell.html" && !getCurrentUser()) {
    requireLogin("sell.html");
}


// ===============================
// LOGOUT
// ===============================

function logoutUser() {
    sessionStorage.removeItem("carZoneUser");
    sessionStorage.removeItem("carZoneRedirect");

    window.location.href = "index.html";
}


// ===============================
// NAVBAR USER DETAILS
// ===============================

document.addEventListener("DOMContentLoaded", function() {

    const navActions = document.querySelector(".nav-actions");
    const currentUser = getCurrentUser();

    if (navActions && currentUser) {

        navActions.innerHTML = `
            <span class="welcome-user">
                Welcome, ${currentUser.name}
            </span>

            <button type="button" class="logout-btn" id="logoutButton">
                Logout
            </button>
        `;

        document.getElementById("logoutButton")
            .addEventListener("click", logoutUser);
    }
});