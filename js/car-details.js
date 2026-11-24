
document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const price = Number(params.get("price"));
    const type = params.get("type");
    const fuel = params.get("fuel");
    const year = params.get("year");
    const image = params.get("image");

    // Validate car information
    if (!name || !Number.isFinite(price) || price <= 0 ||
        !type || !fuel || !year || !image) {
        alert("Car details are not available.");
        window.location.replace("cars.html");
        return;
    }

    // Validate image URL
    let imageUrl;

    try {
        imageUrl = new URL(image);

        if (!["http:", "https:"].includes(imageUrl.protocol)) {
            throw new Error("Invalid image URL");
        }
    } catch (error) {
        alert("Car image is not available.");
        window.location.replace("cars.html");
        return;
    }

    // Display car details
    document.getElementById("detailsName").textContent = name;
    document.getElementById("detailsPrice").textContent =
        "₹" + price.toFixed(2) + " Lakh";
    document.getElementById("detailsYear").textContent = year;
    document.getElementById("detailsFuel").textContent = fuel;
    document.getElementById("detailsType").textContent = type;

    const detailsImage = document.getElementById("detailsImage");
    detailsImage.src = imageUrl.href;
    detailsImage.alt = name;

    const buyButton = document.getElementById("buyCarBtn");
    const contactButton = document.getElementById("contactSellerBtn");
    const purchaseForm = document.getElementById("purchaseForm");

    // Login required before buying or contacting seller
    function requireLogin(action) {

        if (getCurrentUser()) {
            return true;
        }

        const returnUrl = new URL(window.location.href);
        returnUrl.searchParams.set("action", action);

        const redirectPath =
            returnUrl.pathname.split("/").pop() +
            returnUrl.search;

        window.location.href =
            "login.html?mode=login&redirect=" +
            encodeURIComponent(redirectPath);

        return false;
    }

    // Buy This Car
    buyButton.addEventListener("click", function () {

        if (!requireLogin("buy")) return;

        purchaseForm.hidden = false;
        purchaseForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });

    // Contact Seller
    contactButton.addEventListener("click", function () {

        if (!requireLogin("contact")) return;

        alert(
            "You are logged in! Seller contact functionality " +
            "will be connected with the backend later."
        );
    });

    // Handle returning after login
    const action = params.get("action");

    if (action === "buy" && getCurrentUser()) {
        purchaseForm.hidden = false;
    }

    if (action === "contact" && getCurrentUser()) {
        alert(
            "You are logged in! Seller contact functionality " +
            "will be connected with the backend later."
        );
    }

    if (action === "buy" || action === "contact") {
        params.delete("action");

        const cleanUrl =
            window.location.pathname +
            (params.toString() ? "?" + params.toString() : "");

        window.history.replaceState({}, document.title, cleanUrl);
    }

    // Submit purchase enquiry
    purchaseForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!getCurrentUser()) {
            requireLogin("buy");
            return;
        }

        const buyer = getCurrentUser();
        const buyerName = document.getElementById("buyerName").value.trim();
        const buyerPhone = document.getElementById("buyerPhone").value.trim();
        const buyerMessage = document.getElementById("buyerMessage").value.trim();

        if (!/^[6-9][0-9]{9}$/.test(buyerPhone)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        const enquiry = {
            carName: name,
            carPrice: price,
            buyerName: buyerName,
            buyerEmail: buyer.email,
            buyerPhone: buyerPhone,
            message: buyerMessage,
            date: new Date().toISOString()
        };

        let enquiries = [];

        try {
            enquiries = JSON.parse(
                localStorage.getItem("purchaseEnquiries")
            ) || [];
        } catch (error) {
            enquiries = [];
        }

        enquiries.push(enquiry);

        localStorage.setItem(
            "purchaseEnquiries",
            JSON.stringify(enquiries)
        );

        alert(
            "Purchase enquiry submitted successfully!\n\n" +
            "Car: " + name + "\n" +
            "Price: ₹" + price.toFixed(2) + " Lakh\n\n" +
            "Your interest has been recorded."
        );

        purchaseForm.reset();
        purchaseForm.hidden = true;
    });

});
