document.addEventListener("DOMContentLoaded", () => {
    const gridCells = document.querySelectorAll(".grid-cell");
    const passenger = document.querySelector(".passenger");
    const batteryOptions = document.querySelectorAll(".battery-option");
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

    resetButton.addEventListener('click', () => {
        // Reset totalLoad to initial value
        totalLoad = 60; // Reset to initial load (Driver only)
        loadValue.textContent = totalLoad; // Update load display

        // Reset baseMileage to default battery selected (SIMBA 105 Ah)
        baseMileage = 110; // Reset to default mileage
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

    let baseMileage = 111;  // Default battery selected (SIMBA 105 Ah)
    let totalLoad = 60;     // Initial load (Driver only)

    const maxMileage = 110;  // Maximum mileage
    const minMileage = 108;  // Minimum mileage
    const passengerWeight = 60; // Weight per passenger in kg
    const reductionPerKg = (maxMileage - minMileage) / (5 * passengerWeight); // Mileage reduction per kg

    updateMileage();

    batteryOptions.forEach(option => {
        option.addEventListener("click", () => {
            // Remove active class from the currently active circle
            const activeCircle = document.querySelector(".circle.active");
            if (activeCircle) {
                activeCircle.classList.remove("active");
                activeCircle.parentElement.classList.remove("active");
            }
    
            // Add active class to the selected option's circle
            option.querySelector(".circle").classList.add("active");
            option.classList.add("active");
    
            // Update baseMileage based on the selected battery option
            baseMileage = parseFloat(option.getAttribute("data-mileage"));
    
            updateMileage();
        });
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

    passenger.addEventListener("dragend", () => {
        gridCells.forEach(cell => cell.classList.remove("highlight"));
    });

    gridCells.forEach(cell => {
        cell.addEventListener("dragover", event => {
            if (!cell.classList.contains("occupied")) {
                event.preventDefault();
            }
        });
        cell.addEventListener("drop", () => {
            if (!cell.classList.contains("occupied")) {
                cell.innerHTML = '<img src="images/Vector.png" alt="Passenger" class="passenger-image">';
                cell.classList.add("occupied");
                totalLoad += passengerWeight;
                loadValue.textContent = totalLoad;
                updateMileage();
                playSound();

                // Add click event to the passenger image
                const passengerImage = cell.querySelector('.passenger-image');
                passengerImage.addEventListener('click', () => {
                    cell.innerHTML = '+'; // Reset the cell to its original state
                    cell.classList.remove("occupied");
                    totalLoad -= passengerWeight; // Decrease the load
                    loadValue.textContent = totalLoad;
                    updateMileage();
                });
            }gridCells.forEach(cell => {
                cell.addEventListener("drop", () => {
                    if (!cell.classList.contains("occupied")) {
                        cell.innerHTML = '<img src="images/Vector.png" alt="Passenger" class="passenger-image">';
                        cell.classList.add("occupied");
                        totalLoad += passengerWeight;
                        loadValue.textContent = totalLoad;
                        updateMileage();
                        playSound();
            
                        // Check if the passenger area is full
                        if (isPassengerAreaFull()) {
                            alert("The passenger area is fully occupied!");
                        }
            
                        // Add click event to the passenger image
                        const passengerImage = cell.querySelector('.passenger-image');
                        passengerImage.addEventListener('click', () => {
                            cell.innerHTML = '+'; // Reset the cell to its original state
                            cell.classList.remove("occupied");
                            totalLoad -= passengerWeight; // Decrease the load
                            loadValue.textContent = totalLoad;
                            updateMileage();
                        });
                    }
                });
            });
            
            // Function to check if the passenger area is full
            function isPassengerAreaFull() {
                let occupiedCount = 0;
                gridCells.forEach(cell => {
                    if (cell.classList.contains("occupied")) {
                        occupiedCount++;
                    }
                });
                return occupiedCount >= 4; // Change 4 to the maximum number of passengers allowed
            }
        });
    });


    function updateMileage() {
        // Check if the passenger area is empty
        const isPassengerAreaEmpty = Array.from(gridCells).every(cell => !cell.classList.contains("occupied"));
    
        if (isPassengerAreaEmpty) {
            totalLoad = 0; // Set load to 0
            loadValue.textContent = '00'; // Set load display to 000
            mileageDisplay.textContent = '000'; // Set mileage display to 000
        } else {
            // Calculate adjusted mileage based on baseMileage and totalLoad
            const passengerCount = totalLoad / passengerWeight;
            const mileageReduction = reductionPerKg * totalLoad;
            const adjustedMileage = Math.max(baseMileage - mileageReduction, 108); // Ensure it doesn't go below 95
            mileageDisplay.textContent = Math.floor(adjustedMileage); // Use Math.floor to get a whole number
            loadValue.textContent = totalLoad; // Update load display
        }
    }

    function playSound() {
        const sound = new Audio('drop.mp3');
        sound.play();
    }
});