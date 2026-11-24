
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const budgetFilter = document.getElementById("budgetFilter");
    const typeFilter = document.getElementById("typeFilter");
    const fuelFilter = document.getElementById("fuelFilter");
    const resetBtn = document.getElementById("resetBtn");

    const carCards = document.querySelectorAll(".car-card");
    const carCount = document.getElementById("carCount");
    const noResults = document.getElementById("noResults");

    // Search and filters
    function filterCars() {

        const searchValue = searchInput.value.trim().toLowerCase();
        const budgetValue = budgetFilter.value;
        const typeValue = typeFilter.value;
        const fuelValue = fuelFilter.value;

        let visibleCars = 0;

        carCards.forEach((card) => {

            const name = card.dataset.name.toLowerCase();
            const price = parseFloat(card.dataset.price);
            const type = card.dataset.type;
            const fuel = card.dataset.fuel;

            const searchMatch = name.includes(searchValue);

            const budgetMatch =
                budgetValue === "" || price < Number(budgetValue);

            const typeMatch =
                typeValue === "" || type === typeValue;

            const fuelMatch =
                fuelValue === "" || fuel === fuelValue;

            const showCar =
                searchMatch && budgetMatch && typeMatch && fuelMatch;

            card.hidden = !showCar;

            if (showCar) {
                visibleCars++;
            }
        });

        carCount.textContent =
            visibleCars + (visibleCars === 1 ? " Car Found" : " Cars Found");

        noResults.hidden = visibleCars !== 0;
    }

    // Filter event listeners
    searchInput.addEventListener("input", filterCars);
    budgetFilter.addEventListener("change", filterCars);
    typeFilter.addEventListener("change", filterCars);
    fuelFilter.addEventListener("change", filterCars);

    // Reset filters
    resetBtn.addEventListener("click", function () {

        searchInput.value = "";
        budgetFilter.value = "";
        typeFilter.value = "";
        fuelFilter.value = "";

        filterCars();
    });

    // Initial display
    filterCars();

    // Add View Details and Contact Seller buttons
    carCards.forEach(function (card) {

        const carName = card.dataset.name;
        const carInfo = card.querySelector(".car-info");
        const carImage = card.querySelector("img");

        if (!carInfo || !carImage) return;

        // Avoid adding duplicate buttons.
        if (carInfo.querySelector(".car-actions")) return;

        const carActions = document.createElement("div");
        carActions.className = "car-actions";

        // Prepare car information for the details page.
        const description = carInfo.querySelector("p")?.textContent || "";
        const year = description.split("|")[0].trim();

        const detailsParams = new URLSearchParams({
            name: carName,
            price: card.dataset.price,
            type: card.dataset.type,
            fuel: card.dataset.fuel,
            year: year,
            image: carImage.src
        });

        // View Details button
        const detailsButton = document.createElement("a");

        detailsButton.href = "car-details.html?" + detailsParams.toString();
        detailsButton.className = "view-details";
        detailsButton.textContent = "View Details";

        // Contact Seller button
        const contactButton = document.createElement("a");

        contactButton.href = "cars.html?contact=" + encodeURIComponent(carName);
        contactButton.className = "contact-seller protected-action";
        contactButton.textContent = "Contact Seller";

        contactButton.addEventListener("click", function (event) {

            event.preventDefault();

            const contactUrl =
                "cars.html?contact=" + encodeURIComponent(carName);

            if (getCurrentUser()) {
                window.location.href = contactUrl;
            } else {
                window.location.href =
                    "login.html?redirect=" + encodeURIComponent(contactUrl);
            }
        });

        carActions.appendChild(detailsButton);
        carActions.appendChild(contactButton);

        carInfo.appendChild(carActions);
    });

    // Handle Contact Seller after returning from login.
    const params = new URLSearchParams(window.location.search);
    const contactCar = params.get("contact");

    if (contactCar) {

        if (getCurrentUser()) {

            alert(
                "You are logged in! Seller contact feature will be connected with the backend later."
            );

            window.history.replaceState({}, document.title, "cars.html");

        } else {

            const returnUrl = "cars.html?contact=" + encodeURIComponent(contactCar);

            window.location.href =
                "login.html?redirect=" + encodeURIComponent(returnUrl);
        }
    }

});
