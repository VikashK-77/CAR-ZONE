
const sellCarForm = document.getElementById("sellCarForm");
const carImage = document.getElementById("carImage");

// Form submission
sellCarForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get form values
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const year = document.getElementById("year").value;
    const fuel = document.getElementById("fuel").value;
    const transmission = document.getElementById("transmission").value;
    const kilometers = document.getElementById("kilometers").value;
    const price = document.getElementById("price").value;
    const city = document.getElementById("city").value;
    const phone = document.getElementById("phone").value;

    // Check image selection
    if (carImage.files.length === 0) {
        alert("Please upload at least one car image.");
        return;
    }

    // Check image file types
    for (let file of carImage.files) {

        if (!file.type.startsWith("image/")) {
            alert("Please upload valid image files only.");
            return;
        }
    }

    // Check phone number
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    // Show listing details
    alert(
        "Car Listing Submitted Successfully!\n\n" +
        "Brand: " + brand + "\n" +
        "Model: " + model + "\n" +
        "Year: " + year + "\n" +
        "Fuel: " + fuel + "\n" +
        "Transmission: " + transmission + "\n" +
        "Kilometers: " + kilometers + "\n" +
        "Price: ₹" + price + "\n" +
        "City: " + city
    );

    // Reset form
    sellCarForm.reset();

});

// Display selected image names
carImage.addEventListener("change", function() {

    if (carImage.files.length > 0) {

        let imageNames = [];

        for (let file of carImage.files) {
            imageNames.push(file.name);
        }

        alert(
            "Selected Images:\n" +
            imageNames.join("\n")
        );
    }

});
