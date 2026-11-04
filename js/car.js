const searchInput = document.getElementById("searchInput");
const budgetFilter = document.getElementById("budgetFilter");
const typeFilter = document.getElementById("typeFilter");
const fuelFilter = document.getElementById("fuelFilter");
const resetBtn = document.getElementById("resetBtn");

const carCards = document.querySelectorAll(".car-card");
const carCount = document.getElementById("carCount");
const noResults = document.getElementById("noResults");

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

    carCount.textContent = visibleCars + " Cars Found";
    noResults.hidden = visibleCars !== 0;
}

// Filter event listeners
searchInput.addEventListener("input", filterCars);
budgetFilter.addEventListener("change", filterCars);
typeFilter.addEventListener("change", filterCars);
fuelFilter.addEventListener("change", filterCars);

// Reset filters
resetBtn.addEventListener("click", function() {

    searchInput.value = "";
    budgetFilter.value = "";
    typeFilter.value = "";
    fuelFilter.value = "";

    filterCars();
});

// Initial display
filterCars();


// Add Contact Seller button to every car card
carCards.forEach(function(card) {

    const carName = card.dataset.name;

    const contactButton = document.createElement("a");

    contactButton.href =
        "cars.html?contact=" + encodeURIComponent(carName);

    contactButton.className = "contact-seller protected-action";
    contactButton.textContent = "Contact Seller";

    const carInfo = card.querySelector(".car-info");

    if (carInfo) {
        carInfo.appendChild(contactButton);
    }
});


// Check Contact Seller action after login
const params = new URLSearchParams(window.location.search);
const contactCar = params.get("contact");

if (contactCar && getCurrentUser()) {

    alert(
        "You are logged in! Seller contact feature will be connected with the backend later."
    );

    window.history.replaceState({}, document.title, "cars.html");
}