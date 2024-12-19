document.addEventListener("DOMContentLoaded", () => {
    const gridCells = document.querySelectorAll(".grid-cell");
    const passenger = document.querySelector(".passenger");
    const loadValue = document.getElementById("load-value");
    const mileageDisplay = document.getElementById("mileage-value");
    const helpButton = document.querySelector('.header-icons .tooltip[title="Help"]');
    const helpModal = document.getElementById('help-modal');
    const closeButton = document.querySelector('.close-button');
    const resetButton = document.querySelector('.header-icons .tooltip[title="Reset"]');
    const homeButton = document.querySelector('.header-icons .tooltip[title="Home"]');


    homeButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Change 'in.html' to your actual home page URL
    });

    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });
    
    closeButton.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });

    passenger.addEventListener("dragstart", () => {
        gridCells.forEach(cell => {
            if (!cell.classList.contains("occupied")) {
                cell.classList.add("highlight");
            }
        });
    });

    resetButton.addEventListener('click', () => {
        // Reset totalLoad to initial value
        totalLoad = 60; // Reset to initial load (Driver only)
        loadValue.textContent = totalLoad; // Update load display

        // Reset baseMileage to default battery selected (SIMBA 105 Ah)
        baseMileage = 132; // Reset to default mileage
        updateMileage(); // Update mileage display

        // Reset all grid cells to unoccupied
        gridCells.forEach(cell => {
            cell.innerHTML = '+'; // Reset the cell to its original state
            cell.classList.remove("occupied");
        });

        // Optionally, reset the active battery option if needed
        document.querySelector(".circle.active").classList.remove("active");
        batteryOptions[0].querySelector(".circle").classList.add("active"); // Reset to first battery option
        baseMileage = parseFloat(batteryOptions[0].getAttribute("data-mileage")); // Reset baseMileage
        updateMileage(); // Update mileage display
    });
    
    const passengerWeight = 60; // Weight per passenger in kg
    let baseMileage = 132;      // Maximum mileage (default with only the driver)
    let totalLoad = 60;         // Initial load with only the driver

    // Touch-based drag-and-drop logic
    let activePassenger = null;
    let offsetX = 0, offsetY = 0;

    // Add touchstart event for passenger drag
    passenger.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];

        // Clone the passenger and make it draggable
        activePassenger = passenger.cloneNode(true);
        document.body.appendChild(activePassenger);

        offsetX = touch.clientX;
        offsetY = touch.clientY;

        activePassenger.style.position = "absolute";
        activePassenger.style.left = `${offsetX}px`;
        activePassenger.style.top = `${offsetY}px`;
        activePassenger.style.zIndex = "1000";
    });

    // Add touchmove event for passenger drag
    passenger.addEventListener("touchmove", (event) => {
        if (activePassenger) {
            const touch = event.touches[0];
            offsetX = touch.clientX;
            offsetY = touch.clientY;

            activePassenger.style.left = `${offsetX}px`;
            activePassenger.style.top = `${offsetY}px`;
        }
    });

    // Add touchend event for passenger drop
    passenger.addEventListener("touchend", (event) => {
        if (activePassenger) {
            const touch = event.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

            // Check if the drop target is a grid cell
            if (dropTarget && dropTarget.classList.contains("grid-cell") && !dropTarget.classList.contains("occupied")) {
                handlePassengerDrop(dropTarget);
            }

            // Remove the draggable passenger
            document.body.removeChild(activePassenger);
            activePassenger = null;
        }
    });

    // Function to handle passenger drop
    function handlePassengerDrop(cell) {
        cell.innerHTML = '<img src="images/Vector.png" alt="Passenger" class="passenger-image">';
        cell.classList.add("occupied");
        totalLoad += passengerWeight;
        loadValue.textContent = totalLoad;
        updateMileage();
        playSound();

        // Add event listener to remove passenger on click
        const passengerImage = cell.querySelector('.passenger-image');
        passengerImage.addEventListener('click', () => {
            cell.innerHTML = '+';
            cell.classList.remove("occupied");
            totalLoad -= passengerWeight;
            loadValue.textContent = totalLoad;
            updateMileage();
            playSound();
        });

        // Optional: Check if all cells are occupied
        if (isPassengerAreaFull()) {
            // Show the warning image
            document.getElementById('overlay').style.display = 'flex';
        }
        document.getElementById('close-btn').addEventListener('click', function() {
            document.getElementById('overlay').style.display = 'none';
        });
    }

    // Function to check if all passenger slots are filled
    function isPassengerAreaFull() {
        let occupiedCount = 0;
        gridCells.forEach(cell => {
            if (cell.classList.contains("occupied")) {
                occupiedCount++;
            }
        });
        return occupiedCount >= 5; // Maximum of 5 passengers (including the driver)
    }

    // Function to update mileage
    function updateMileage() {
        const isPassengerAreaEmpty = Array.from(gridCells).every(cell => !cell.classList.contains("occupied"));

        if (isPassengerAreaEmpty) {
            // If no passengers, set display to 000
            totalLoad = 0;
            loadValue.textContent = "00";
            mileageDisplay.textContent = "000";
        } else {
            const passengerCount = totalLoad / passengerWeight; // Calculate number of passengers
            const reductionPerPassenger = (baseMileage - 108) / 4; // Reduction between max and min mileage over 4 passengers

            // Calculate adjusted mileage
            const adjustedMileage = Math.max(baseMileage - reductionPerPassenger * (passengerCount - 1), 108);
            mileageDisplay.textContent = Math.floor(adjustedMileage); // Show as whole number
            loadValue.textContent = totalLoad; // Update load display
        }
    }
    // Initialize the values on page load
    updateMileage();

    function playSound() {
        const sound = new Audio('drop.mp3');
        sound.play();
    }
});
