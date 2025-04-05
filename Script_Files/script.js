document.addEventListener('DOMContentLoaded', function () {
    // Modal on first visit
    if (!localStorage.getItem('payanamModalShown')) {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        localStorage.setItem('payanamModalShown', 'true');
    }

    // Login widget delay
    setTimeout(() => {
        const loginWidget = document.getElementById('loginWidget');
        loginWidget.style.display = 'block';
        setTimeout(() => {
            loginWidget.style.display = 'none';
        }, 8000);
    }, 3000);

    // Event listeners for login widget
    document.getElementById('closeWidget').addEventListener('click', function () {
        document.getElementById('loginWidget').style.display = 'none';
    });

    document.getElementById('widgetLoginBtn').addEventListener('click', function () {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        document.getElementById('loginWidget').style.display = 'none';
    });

    document.getElementById('loginButton').addEventListener('mouseenter', function () {
        document.getElementById('loginWidget').style.display = 'block';
    });

    document.getElementById('loginWidget').addEventListener('mouseenter', function () {
        this.style.display = 'block';
    });

    document.getElementById('loginWidget').addEventListener('mouseleave', function () {
        this.style.display = 'none';
    });

    // Navbar shrink on scroll
    const navbar = document.getElementById('mainNavbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('shrink');
        } else {
            navbar.classList.remove('shrink');
        }
    });

    // Date pickers
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('journeyDate').min = today;
    document.getElementById('journeyDate').value = today;

    document.getElementById('journeyDate').addEventListener('change', function () {
        document.getElementById('returnDate').min = this.value;
    });

    // Swap cities
    document.getElementById('swapCities').addEventListener('click', function () {
        const fromCity = document.getElementById('fromCity');
        const toCity = document.getElementById('toCity');
        const temp = fromCity.value;
        fromCity.value = toCity.value;
        toCity.value = temp;
    });

    // Booking form submission
    document.getElementById('bookingForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const fromCity = document.getElementById('fromCity').value;
        const toCity = document.getElementById('toCity').value;
        const journeyDate = document.getElementById('journeyDate').value;

        if (!fromCity || !toCity || !journeyDate) {
            alert('Please fill all required fields');
            return;
        }

        if (fromCity === toCity) {
            alert('From and To cities cannot be same');
            return;
        }

        showLoader({ preventDefault: () => { }, currentTarget: { getAttribute: () => 'Booking1.html' } });
    });

    // Loader function
    window.showLoader = function (event) {
        event.preventDefault();
        document.getElementById('loading-overlay').style.display = 'flex';
        const targetUrl = event.currentTarget.getAttribute('href');
        setTimeout(() => {
            window.location.href = targetUrl || 'Booking1.html';
        }, 1000);
    };

    // AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // OTP and login logic
    let generatedOtp = '';
    let mobileNumber = '';

    function generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    let otpTimer;
    let timeLeft = 30;

    function startOtpTimer() {
        timeLeft = 30;
        document.getElementById('resendOtp').style.display = 'none';
        document.getElementById('otpTimer').style.display = 'inline';

        otpTimer = setInterval(function () {
            timeLeft--;
            document.getElementById('countdown').textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(otpTimer);
                document.getElementById('resendOtp').style.display = 'inline';
                document.getElementById('otpTimer').style.display = 'none';
            }
        }, 1000);
    }

    document.getElementById('mobileForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        mobileNumber = document.getElementById('mobileNumber').value;

        if (!/^\d{10}$/.test(mobileNumber)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            console.log('Sending request to:', `${API_URL}/auth/register/phone`);
            const response = await axios.post(`${API_URL}/auth/register/phone`, {
                phone: mobileNumber
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Customer registered:', response.data);
            generatedOtp = generateOtp();
            alert('OTP sent to ' + mobileNumber + ': ' + generatedOtp);

            document.getElementById('otpLoginForm').style.display = 'none';
            document.getElementById('otpVerificationForm').style.display = 'block';
            document.getElementById('displayMobileNumber').textContent = '+91 ' + mobileNumber;

            startOtpTimer();
            setTimeout(() => document.querySelector('.otp-input').focus(), 100);
        } catch (error) {
            console.error('Error registering phone:', error);
            if (error.code === 'ERR_NETWORK') {
                alert('Network Error: Could not connect to the server. Please ensure the backend is running on ' + API_URL);
            } else if (error.response) {
                alert('Error: ' + (error.response.data.message || error.response.statusText));
            } else {
                alert('Something went wrong. Please try again.');
            }
        }
    });

    document.getElementById('resendOtp').addEventListener('click', function (e) {
        e.preventDefault();
        generatedOtp = generateOtp();
        alert('Resent OTP to ' + mobileNumber + ': ' + generatedOtp);
        startOtpTimer();
    });

    document.getElementById('loginModal').addEventListener('hidden.bs.modal', function () {
        clearInterval(otpTimer);
    });

    document.getElementById('showEmailLogin').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('otpLoginForm').style.display = 'none';
        document.getElementById('emailLoginForm').style.display = 'block';
    });

    document.getElementById('backToOtpForm').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('emailLoginForm').style.display = 'none';
        document.getElementById('otpLoginForm').style.display = 'block';
    });

    document.getElementById('backToMobileForm').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('otpVerificationForm').style.display = 'none';
        document.getElementById('otpLoginForm').style.display = 'block';
    });

    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function () {
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    document.getElementById('verifyOtpForm').addEventListener('submit', function (e) {
        e.preventDefault();
        let enteredOtp = '';
        otpInputs.forEach(input => { enteredOtp += input.value; });

        if (enteredOtp.length !== 6) {
            document.getElementById('otpError').style.display = 'block';
            return;
        }
        if (enteredOtp !== generatedOtp) {
            document.getElementById('otpError').style.display = 'block';
            return;
        }
        document.getElementById('otpError').style.display = 'none';
        document.getElementById('otpVerificationForm').style.display = 'none';
        document.getElementById('successScreen').style.display = 'block';
    });

    document.getElementById('loginForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Login submitted');
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            alert('Login successful!');
        }, 1000);
    });

    document.getElementById('forgotPasswordForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Password reset requested');
        alert('Password reset link has been sent to your email!');
    });

    function handleGoogleSignIn() {
        alert('Redirecting to Google Sign-In...');
        setTimeout(() => {
            document.getElementById('otpLoginForm').style.display = 'none';
            document.getElementById('emailLoginForm').style.display = 'none';
            document.getElementById('successScreen').style.display = 'block';
        }, 1500);
    }

    document.getElementById('googleSignIn')?.addEventListener('click', handleGoogleSignIn);
    document.getElementById('googleSignInEmail')?.addEventListener('click', handleGoogleSignIn);

    document.querySelector('.navbar-nav .btn-outline-primary').addEventListener('click', function (e) {
        e.preventDefault();
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'), {
            backdrop: 'static', keyboard: false, focus: true
        });
        loginModal._element.addEventListener('shown.bs.modal', function () {
            document.querySelector('#loginModal input:not([type="hidden"])').focus();
        });
        loginModal._element.addEventListener('hidden.bs.modal', function () {
            document.querySelector('.navbar-nav .btn-outline-primary').focus();
        });
        loginModal.show();
        document.getElementById('mobileForm').reset();
        document.getElementById('verifyOtpForm').reset();
        document.getElementById('loginForm').reset();
        document.getElementById('forgotPasswordForm').reset();
        otpInputs.forEach(input => { input.value = ''; });
        document.getElementById('otpLoginForm').style.display = 'block';
        document.getElementById('otpVerificationForm').style.display = 'none';
        document.getElementById('emailLoginForm').style.display = 'none';
        document.getElementById('successScreen').style.display = 'none';
        document.getElementById('loginForm').classList.remove('collapse');
        document.getElementById('forgotPassword').classList.remove('show');
    });
});

$(document).ready(function () {
    $('.gov-bus-offers-carousel').owlCarousel({
        loop: true, margin: 20, nav: true, dots: true, autoplay: true,
        autoplayTimeout: 4000, autoplayHoverPause: true,
        responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 }, 1200: { items: 4 } }
    });

    var exclusiveCarousel = $('.exclusive-carousel').owlCarousel({
        center: true, loop: true, margin: 40, nav: false, dots: true,
        autoplay: true, autoplayTimeout: 4000, autoplayHoverPause: true,
        responsive: { 0: { items: 1, dots: true }, 600: { items: 2, dots: true }, 1000: { items: 3, dots: true } }
    });

    $('.exclusive-card-arrow.prev-arrow').click(function () {
        exclusiveCarousel.trigger('prev.owl.carousel');
    });

    $('.exclusive-card-arrow.next-arrow').click(function () {
        exclusiveCarousel.trigger('next.owl.carousel');
    });

    function countdown() {
        let timeLeft = 3600;
        setInterval(() => {
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            $('.exclusive-offer-card p').each(function () {
                if ($(this).text().includes('Use code') || $(this).text().includes('Valid')) {
                    $(this).text(`Hurry! ${minutes}m ${seconds}s left`);
                }
            });
            timeLeft--;
            if (timeLeft < 0) timeLeft = 3600;
        }, 1000);
    }
    countdown();

    const widget = document.querySelector('.promo-widget');
    const exploreBtn = document.querySelector('.explore-btn');
    const closeBtn = document.querySelector('.close-btn');

    widget.style.display = 'flex';
    widget.style.opacity = '0';
    widget.classList.remove('mini');

    let isDragging = false, offsetX, offsetY;
    widget.addEventListener('mousedown', (e) => {
        if (e.target === closeBtn || e.target === exploreBtn) return;
        isDragging = true;
        offsetX = e.clientX - widget.getBoundingClientRect().left;
        offsetY = e.clientY - widget.getBoundingClientRect().top;
        widget.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        widget.style.left = `${e.clientX - offsetX}px`;
        widget.style.top = `${e.clientY - offsetY}px`;
        widget.style.right = 'unset';
        widget.style.bottom = 'unset';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        widget.style.cursor = 'pointer';
    });

    exploreBtn.addEventListener('click', function () {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
            window.location.href = 'LuxuriousBusRentals.html';
        }, 200);
    });

    closeBtn.addEventListener('click', function () {
        widget.style.transform = 'scale(0.8) translateY(100px)';
        widget.style.opacity = '0';
        setTimeout(() => {
            widget.classList.add('mini');
            widget.style.width = '60px';
            widget.style.height = '60px';
            widget.style.transform = 'scale(1)';
            widget.style.opacity = '1';
            widget.style.right = '30px';
            widget.style.bottom = '30px';
            widget.style.left = 'unset';
            widget.style.top = 'unset';
        }, 400);
    });

    widget.addEventListener('click', function (e) {
        if (widget.classList.contains('mini')) {
            widget.style.transform = 'scale(0.8)';
            widget.style.opacity = '0';
            setTimeout(() => {
                widget.classList.remove('mini');
                widget.style.width = '420px';
                widget.style.height = '280px';
                widget.style.transform = 'scale(1) translateY(0)';
                widget.style.opacity = '1';
                widget.style.animation = 'zoomInBounce 0.8s ease-out forwards';
            }, 300);
        }
    });
});
