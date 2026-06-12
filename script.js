const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });
}


const registerForm = document.getElementById('register-form');
const otpForm = document.getElementById('otp-form');
const regUsernameInput = document.getElementById('reg-username');
const regEmailInput = document.getElementById('reg-email');
const regPasswordInput = document.getElementById('reg-password');
const otpInput = document.getElementById('otp-input');
const regBtn = document.getElementById('reg-btn');
const verifyBtn = document.getElementById('verify-btn');

const API_URL = 'https://bloomfresh.onrender.com'; 

if (registerForm && otpForm) {
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const email = regEmailInput.value.trim();
        
        regBtn.innerText = "Sending OTP..."; 
        regBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/api/send-otp`, {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                alert("OTP successfully sent to " + email);
                registerForm.style.display = "none";
                otpForm.style.display = "block";
            } else {
                alert("Error: " + data.message);
                regBtn.innerText = "Register";
                regBtn.disabled = false;
            }
        } catch (error) {
            alert("Network Error: Could not reach the server.");
            console.error(error);
            regBtn.innerText = "Register";
            regBtn.disabled = false;
        }
    });

    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = regEmailInput.value.trim();
        const otp = otpInput.value.trim();

        verifyBtn.innerText = "Verifying...";
        verifyBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/api/verify-otp`, {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, otp: otp })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                localStorage.setItem('bloomUsername', regUsernameInput.value.trim());
                localStorage.setItem('bloomPassword', regPasswordInput.value.trim());

                alert("Registration Successful! Welcome to BloomFresh.");
                window.location.href = "home.html"; 
            } else {
                alert("Invalid OTP: " + data.message);
                verifyBtn.innerText = "Verify & Login";
                verifyBtn.disabled = false;
            }
        } catch (error) {
            alert("Network Error during verification. Check console for details.");
            console.error(error);
            verifyBtn.innerText = "Verify & Login";
            verifyBtn.disabled = false;
        }
    });
}

const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const loginSubmitBtn = document.getElementById('login-submit-btn');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const enteredUsername = loginUsernameInput.value.trim();
        const enteredPassword = loginPasswordInput.value.trim();

        const savedUsername = localStorage.getItem('bloomUsername');
        const savedPassword = localStorage.getItem('bloomPassword');

        if (!savedUsername || !savedPassword) {
            alert("Account not found! Please register first.");
            return;
        }

        if (savedPassword === 'GOOGLE_SIGNED_IN') {
            alert("This account is linked with Google. Please click the Google icon below to login.");
            return;
        }

        if (enteredUsername !== savedUsername) {
            alert("Invalid Username! Please check your username.");
            return;
        }

        if (enteredPassword === savedPassword) {
            alert("Login Successful!");
            window.location.href = "home.html"; 
        } else {
            alert("Invalid Password! Please try again.");
            loginPasswordInput.value = ""; 
        }
    });
}