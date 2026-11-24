
// Get currently logged-in user.
// This function is available to other JavaScript files too.
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch (error) {
        return null;
    }
}

// Return user to the requested same-site page after login.
function getPostLoginUrl() {
    const redirect = new URLSearchParams(window.location.search).get("redirect");

    if (!redirect) {
        return "index.html";
    }

    try {
        const target = new URL(redirect, window.location.href);

        if (target.origin === window.location.origin) {
            return target.href;
        }
    } catch (error) {
        // Invalid redirect: use the default page.
    }

    return "index.html";
}

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Login page only: other pages don't contain these forms.
    if (!loginForm || !registerForm) {
        return;
    }

    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const switchText = document.getElementById("switchText");
    const switchButton = document.getElementById("switchButton");
    const authMessage = document.getElementById("authMessage");

    let currentMode = "login";

    function showMessage(message, color) {
        authMessage.textContent = message;
        authMessage.style.color = color;
    }

    // Switch between Login and Register.
    function switchMode() {

        authMessage.textContent = "";
        authMessage.style.color = "";

        if (currentMode === "login") {

            currentMode = "register";

            loginForm.classList.add("hidden");
            registerForm.classList.remove("hidden");

            formTitle.textContent = "Welcome to Car-Zone";
            formSubtitle.textContent =
                "Join Car-Zone to buy and sell cars directly.";

            switchText.firstChild.textContent =
                "Already have an account? ";

            switchButton.textContent = "Login Now";

        } else {

            currentMode = "login";

            registerForm.classList.add("hidden");
            loginForm.classList.remove("hidden");

            formTitle.textContent = "Welcome to Car-Zone";
            formSubtitle.textContent =
                "Enter your details to access your account.";

            switchText.firstChild.textContent =
                "Don't have an account? ";

            switchButton.textContent = "Register Now";
        }
    }

    switchButton.addEventListener("click", switchMode);

    // Show / Hide password.
    document.querySelectorAll(".toggle-password").forEach(button => {

        button.addEventListener("click", function () {

            const input = document.getElementById(button.dataset.target);

            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                button.textContent = "Hide";
            } else {
                input.type = "password";
                button.textContent = "Show";
            }
        });
    });

    // Get registered users from localStorage.
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem("users")) || [];
        } catch (error) {
            return [];
        }
    }

    // Login form.
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const users = getUsers();

        const user = users.find(item =>
            item.email.toLowerCase() === email.toLowerCase() &&
            item.password === password
        );

        if (!user) {
            showMessage("Invalid email or password.", "#d93636");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify({
            name: user.name,
            email: user.email
        }));

        showMessage("Login successful!", "#16834a");

        window.location.href = getPostLoginUrl();
    });

    // Register form.
    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const users = getUsers();

        if (!name || !email || !password || !confirmPassword) {
            showMessage("Please fill in all fields.", "#d93636");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showMessage("Please enter a valid email.", "#d93636");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must be at least 6 characters.", "#d93636");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "#d93636");
            return;
        }

        const existingUser = users.find(item =>
            item.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            showMessage("This email is already registered.", "#d93636");
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("currentUser", JSON.stringify({
            name: name,
            email: email
        }));

        showMessage("Registration successful!", "#16834a");

        window.location.href = getPostLoginUrl();
    });

});
