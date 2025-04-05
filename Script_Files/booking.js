document.addEventListener('DOMContentLoaded', () => {
    // Navbar shrink on scroll
    const navbar = document.getElementById('mainNavbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('shrink');
        } else {
            navbar.classList.remove('shrink');
        }
    });

    const busData = [
        {
            operator: 'Vijay Travels',
            type: 'VE AC Seater / Sleeper (2+1)',
            boarding: 'Salem',
            boardingTime: '23:18',
            dropping: 'Koyambedu',
            droppingTime: '04:53',
            duration: '5h 35m',
            price: 404,
            features: 'Live Tracking',
            isPrime: true,
            rating: 4.5
        },
        {
            operator: 'SRL Travels',
            type: 'Bharat Benz AC Sleeper (2+1)',
            boarding: 'Salem',
            boardingTime: '19:15',
            dropping: 'Koyambedu',
            droppingTime: '01:05',
            duration: '5h 50m',
            price: 700,
            features: 'Filling Fast',
            isPrime: true,
            rating: 4.8
        },
        {
            operator: 'Namasivaya Travels',
            type: 'Non-AC Seater (2+2)',
            boarding: 'Salem',
            boardingTime: '21:00',
            dropping: 'Koyambedu',
            droppingTime: '03:00',
            duration: '6h',
            price: 550,
            features: 'Live Tracking',
            isPrime: false,
            rating: 4.2
        }
    ];

    function getTimeSlot(time) {
        const [hours, minutes] = time.split(':').map(Number);
        if (hours >= 0 && hours < 6) return 'midnight-6am';
        if (hours >= 6 && hours < 12) return '6am-noon';
        if (hours >= 12 && hours < 18) return 'noon-6pm';
        return '6pm-midnight';
    }

    function applyFilters() {
        const busTypes = Array.from(document.querySelectorAll('input[name="busType"]:checked')).map(input => input.value);
        const departureTime = document.querySelector('input[name="departureTime"]:checked')?.value || '';
        const arrivalTime = document.querySelector('input[name="arrivalTime"]:checked')?.value || '';
        const boardingPoints = Array.from(document.querySelectorAll('#boardingPoints input:checked')).map(input => input.value);
        const droppingPoints = Array.from(document.querySelectorAll('#droppingPoints input:checked')).map(input => input.value);
        const operators = Array.from(document.querySelectorAll('#operators input:checked')).map(input => input.value);
        const promoFilter = document.querySelector('.promo-card.active')?.dataset.filter || '';

        const filteredBuses = busData.filter(bus => {
            const matchesBusType = busTypes.length === 0 || busTypes.some(type => bus.type.includes(type));
            const matchesDeparture = !departureTime || getTimeSlot(bus.boardingTime) === departureTime;
            const matchesArrival = !arrivalTime || getTimeSlot(bus.droppingTime) === arrivalTime;
            const matchesBoarding = boardingPoints.length === 0 || boardingPoints.includes(bus.boarding);
            const matchesDropping = droppingPoints.length === 0 || droppingPoints.includes(bus.dropping);
            const matchesOperator = operators.length === 0 || operators.includes(bus.operator);
            const matchesPromo = !promoFilter ||
                (promoFilter === 'prime' && bus.isPrime) ||
                (promoFilter === 'top-rated' && bus.rating >= 4.5) ||
                (promoFilter === 'deals' && bus.price <= 550);

            return matchesBusType && matchesDeparture && matchesArrival && matchesBoarding && matchesDropping && matchesOperator && matchesPromo;
        });

        displayResults(filteredBuses);
    }

    function displayResults(buses) {
        const resultsContainer = document.getElementById('busResults');
        const resultsCount = document.getElementById('resultsCount');
        resultsContainer.innerHTML = '';

        if (buses.length === 0) {
            resultsContainer.innerHTML = '<p>No buses found matching your criteria.</p>';
            resultsCount.textContent = 'Showing 0 Buses';
            return;
        }

        buses.forEach(bus => {
            const busCard = `
                        <div class="bus-card">
                            <div class="bus-card-left">
                                <h3>${bus.operator}</h3>
                                <p>${bus.type}</p>
                                <p>Boarding: ${bus.boarding} - ${bus.boardingTime}</p>
                                <p>Dropping: ${bus.dropping} - ${bus.droppingTime}</p>
                                <span class="travel-duration">Duration: ${bus.duration}</span>
                            </div>
                            <div class="bus-card-right">
                                <div class="price">
                                    <span>₹ ${bus.price}</span>
                                </div>
                                <button class="select-seat-btn">Select Seat</button>
                                <p class="features">${bus.features}</p>
                            </div>
                        </div>
                    `;
            resultsContainer.innerHTML += busCard;
        });

        resultsCount.textContent = `Showing ${buses.length} Buses`;
    }

    document.querySelectorAll('input[name="busType"], input[name="departureTime"], input[name="arrivalTime"], #boardingPoints input, #droppingPoints input, #operators input')
        .forEach(input => input.addEventListener('change', applyFilters));

    document.querySelector('.clear-all-btn').addEventListener('click', () => {
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => input.checked = false);
        document.querySelectorAll('.promo-card').forEach(card => card.classList.remove('active'));
        applyFilters();
    });

    document.querySelector('.update-search-btn').addEventListener('click', () => {
        const fromCity = document.getElementById('fromCity').value;
        const toCity = document.getElementById('toCity').value;
        const journeyDate = document.getElementById('journeyDate').value;
        alert(`Searching buses from ${fromCity} to ${toCity} on ${journeyDate}`);
        applyFilters();
    });

    document.querySelectorAll('.promo-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.promo-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            applyFilters();
        });
    });

    function filterList(searchInput, listContainer) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const items = listContainer.querySelectorAll('label');
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    filterList(document.getElementById('boardingSearch'), document.getElementById('boardingPoints'));
    filterList(document.getElementById('droppingSearch'), document.getElementById('droppingPoints'));
    filterList(document.getElementById('operatorSearch'), document.getElementById('operators'));

    applyFilters();

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-seat-btn')) {
            alert('Redirecting to seat selection page...');
        }
    });
});
