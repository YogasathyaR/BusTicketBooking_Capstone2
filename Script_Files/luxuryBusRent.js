const busData = {
    1: {
        title: "Premium Coach",
        features: ["AC Luxury", "WiFi Enabled", "24/7 Support", "Seating: 40"],
        pricePerDay: 15000,
        available: true,
        description: "Experience luxury travel with our Premium Coach, perfect for large groups.",
        gallery: [
            "/assets/LuxuryBus7.avif",
        ]
    },
    2: {
        title: "Executive Shuttle",
        features: ["AC Luxury", "WiFi Enabled", "24/7 Support", "Seating: 30"],
        pricePerDay: 12000,
        available: false,
        description: "Compact yet luxurious, ideal for corporate trips or small gatherings.",
        gallery: [
            "/assets/LuxuryBus2.jpg"
        ]
    },
    3: {
        title: "Deluxe Traveler",
        features: ["AC Luxury", "WiFi Enabled", "24/7 Support", "Seating: 50"],
        pricePerDay: 18000,
        available: true,
        description: "Spacious and elegant, designed for ultimate comfort on long journeys.",
        gallery: [
            "/assets/LuxuryBus3.avif",
        ]
    }
};

let selectedBusId = null;

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('mainNavbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('shrink');
        else navbar.classList.remove('shrink');
    });

    // Populate bus cards
    const busCards = document.getElementById('busCards');
    Object.keys(busData).forEach(id => {
        const bus = busData[id];
        busCards.innerHTML += `
                    <div class="col-md-4">
                        <div class="bus-card" data-bus-id="${id}">
                            <img src="${bus.gallery[0]}" alt="${bus.title}">
                            <div class="bus-card-body">
                                <h3 class="bus-card-title">${bus.title}</h3>
                                <ul class="bus-card-features">
                                    ${bus.features.map(f => `<li>${f}</li>`).join('')}
                                </ul>
                                <p class="bus-card-price">₹${bus.pricePerDay.toLocaleString()}/day</p>
                                <p class="availability ${bus.available ? '' : 'unavailable'}">${bus.available ? 'Available' : 'Not Available'}</p>
                            </div>
                        </div>
                    </div>
                `;
    });

    // Handle card clicks
    document.querySelectorAll('.bus-card').forEach(card => {
        card.addEventListener('click', () => {
            const busId = card.getAttribute('data-bus-id');
            const bus = busData[busId];

            document.querySelectorAll('.bus-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // Update details section
            document.getElementById('busTitle').textContent = bus.title;
            document.getElementById('busDescription').textContent = bus.description;
            document.getElementById('busFeatures').innerHTML = bus.features.map(f => `<li>${f}</li>`).join('');
            document.getElementById('busPrice').textContent = `₹${bus.pricePerDay.toLocaleString()}/day`;
            document.getElementById('busAvailability').textContent = bus.available ? "Available" : "Not Available";
            document.getElementById('busAvailability').className = `availability-status ${bus.available ? 'text-success' : 'text-danger'}`;

            const gallery = document.getElementById('busGallery');
            gallery.innerHTML = '';
            // Add all gallery items except the first one
            bus.gallery.slice(1).forEach(item => {
                if (item.endsWith('.mp4')) {
                    gallery.innerHTML += `<video controls><source src="${item}" type="video/mp4"></video>`;
                } else {
                    gallery.innerHTML += `<img src="${item}" alt="${bus.title}">`;
                }
            });
            // Add the first image at the bottom
            gallery.innerHTML += `<img src="${bus.gallery[0]}" alt="${bus.title}">`;

            // Show details section
            const detailsSection = document.getElementById('busDetailsSection');
            detailsSection.style.display = 'block';

            // Scroll to details section
            detailsSection.scrollIntoView({ behavior: 'smooth' });

            selectedBusId = busId;
        });
    });

    // Filter logic
    const applyFilters = () => {
        if (!selectedBusId) return;
        const bus = busData[selectedBusId];
        const duration = parseInt(document.getElementById('rentalDuration').value);
        const driver = document.getElementById('driver').checked;
        const fuel = document.getElementById('fuel').checked;
        let price = bus.pricePerDay * duration;
        if (driver) price += 2000 * duration;
        if (fuel) price += 5000 * duration;
        document.getElementById('busPrice').textContent = `₹${price.toLocaleString()} for ${duration} day(s)`;
    };

    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('rentalDuration').addEventListener('change', applyFilters);
    document.getElementById('driver').addEventListener('change', applyFilters);
    document.getElementById('fuel').addEventListener('change', applyFilters);

    // Book Now button
    document.getElementById('bookNow').addEventListener('click', () => {
        if (!selectedBusId) return;
        const bus = busData[selectedBusId];
        if (bus.available) {
            alert(`Booking ${bus.title} for ${document.getElementById('rentalDuration').value} day(s)!`);
        } else {
            alert('This bus is currently unavailable.');
        }
    });
});
