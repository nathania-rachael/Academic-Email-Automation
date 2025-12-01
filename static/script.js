
if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify(sampleEvents));
}

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            const path = this.querySelector('path');
            if (type === 'text') {
                path.setAttribute('d', 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z');
            } else {
                path.setAttribute('d', 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z');
            }
        });
    });

    // Handle login form submission — call backend
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('login-error');

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (!res.ok) {
                    const err = await res.json();
                    errorMessage.textContent = err.detail || 'Invalid credentials';
                    return;
                }
                const data = await res.json();
                if (data.user) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    window.location.href = '/home.html';
                } else {
                    errorMessage.textContent = 'Login failed';
                }
            } catch (err) {
                console.error(err);
                errorMessage.textContent = 'Server error — try again';
            }
        });
    }

    // Handle signup form submission — call backend
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const appPassword = document.getElementById('app-password').value;
            const registration = document.getElementById('registration').value.trim();
            const year = document.getElementById('year').value.trim();
            const branch = document.getElementById('branch').value.trim();
            const school = document.getElementById('school').value.trim();
            const cgpa = document.getElementById('cgpa').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const tenth = (document.getElementById('tenth-percentage') || {value:''}).value.trim();
            const twelfth = (document.getElementById('twelfth-percentage') || {value:''}).value.trim();
            const errorMessage = document.getElementById('signup-error');

            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                return;
            }

            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullname,
                        email,
                        app_password: appPassword,
                        registration,
                        year,
                        branch,
                        school,
                        cgpa,
                        username,
                        password,
                        tenth_percentage: tenth,
                        twelfth_percentage: twelfth
                    })
                });

                const data = await res.json();
                if (!res.ok) {
                    errorMessage.textContent = data.detail || 'Registration failed';
                    return;
                }

                const popup = document.createElement('div');
                popup.className = 'popup success-popup';
                popup.innerHTML = `
                    <div class="popup-content">
                        <h3>🎉 Registration Successful!</h3>
                        <p>${data.message || 'Your account has been created successfully.'}</p>
                        <button id="popup-ok-btn" class="popup-btn">OK</button>
                    </div>
                `;
                document.body.appendChild(popup);

                setTimeout(() => popup.classList.add('show'), 50);

                const okBtn = document.getElementById('popup-ok-btn');
                okBtn.addEventListener('click', () => {
                    popup.classList.remove('show');
                    setTimeout(() => {
                        popup.remove();
                        window.location.href = '/'; 
                    }, 300);
                });

            } catch (err) {
                console.error(err);
                errorMessage.textContent = 'Server error — try again';
            }
        });
    }


    // Home page functionality (unchanged behaviour mostly)
    const logoutBtn = document.getElementById('logout-btn');
    const profileBtn = document.getElementById("profile-btn");
    const userIcon = document.getElementById('user-icon');
    const userDropdown = document.getElementById('user-dropdown');


    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = '/';
        });
    }
    
    if (profileBtn) {
        profileBtn.addEventListener("click", function() {
            window.location.href = "profile.html";
        });
    }

    // User dropdown functionality: populate from localStorage currentUser
    if (userIcon && userDropdown) {
        userIcon.addEventListener("click", function () {
            userDropdown.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!userIcon.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove("active");
            }
        });
    }

    // Check if user is logged in for protected pages
    if (window.location.pathname.includes('home.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = '/';
        }
    }

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.className = 'popup';

        popup.innerHTML = `
            <div class="popup-content">
                <h3>Notification</h3>
                <p>${message}</p>
                <button id="popup-ok-btn" class="popup-btn">OK</button>
            </div>
        `;

        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 50);

        const okBtn = popup.querySelector('#popup-ok-btn');
        okBtn.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });
    }

    const runBtn = document.getElementById('run-workflow-btn');
    if (runBtn) {
        runBtn.addEventListener('click', async function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const eventDate = document.getElementById('event-date').value;

            if (!currentUser) {
                showPopup("Please login first.");
                return;
            }
            if (!eventDate) {
                showPopup("Please select a date.");
                return;
            }

            try {
                const res = await fetch('/api/run-workflow', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        in_name: currentUser.fullname,
                        in_email: currentUser.email,
                        in_app_pass: currentUser.app_password,   
                        in_reg_no: currentUser.registration,
                        in_yop: currentUser.year,
                        in_branch: currentUser.branch,
                        in_school: currentUser.school,
                        in_cgpa: currentUser.cgpa,
                        in_10: currentUser.tenth_percentage,    
                        in_12: currentUser.twelfth_percentage,  
                        in_date: eventDate
                    })

                });

                const data = await res.json();
                const resultBox = document.getElementById('workflow-result');
                if (data.success) {
                    resultBox.textContent = "Workflow executed successfully!";
                    resultBox.style.color = "green";

                    const listContainer = document.getElementById("workflow-list");
                    listContainer.innerHTML = ""; 

                    let results = data.output.finalList || []; 

                    results.forEach(item => {
                        const div = document.createElement("div");
                        div.classList.add("result-widget");

                        const text = document.createElement("pre");
                        text.textContent = item.replace(/\\n/g, "\n");
                        text.style.whiteSpace = "pre-wrap";

                        const btn = document.createElement("button");
                        btn.textContent = "Add to Calendar";
                        btn.classList.add("calendar-btn");
                        btn.style.marginTop = "10px";

                        btn.addEventListener("click", async () => {
                            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                            if (!currentUser || !currentUser.email) {
                                showPopup("Please login first.");
                                return;
                            }

                            try {
                                const res = await fetch("/api/add-to-calendar", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        in_summary: item,
                                        in_mail: currentUser.email
                                    })
                                });

                                const data = await res.json();
                                if (data.success) {
                                    btn.textContent = "✔ Added to Calendar";
                                    btn.disabled = true;
                                    btn.style.backgroundColor = "#4CAF50";
                                } else {
                                    showPopup("⚠️ No proper date or time found to add event in calendar.");
                                }
                            } catch (err) {
                                console.error(err);
                                showPopup("Server error — could not add to calendar.");
                            }
                        });

                        div.appendChild(text);
                        div.appendChild(btn);
                        listContainer.appendChild(div);
                    });


                } else {
                    resultBox.textContent = "Error: " + data.error;
                    resultBox.style.color = "red";
                }


            } catch (err) {
                console.error(err);
                showPopup("Server error — could not run workflow.");
            }
        });
    }

    // Profile page
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        (async () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser) {
                showPopup("Please login first.");
                window.location.href = "index.html";
                return;
            }
            try {
                const res = await fetch(`/api/profile/${currentUser.username}`);
                let user;
                if (res.ok) {
                    user = await res.json();
                } else {
                    user = currentUser;
                }
                // Prefill form
                document.getElementById("fullname").value = user.fullname || "";
                document.getElementById("email").value = user.email || "";
                const appInput = document.getElementById("app-password");
                if (appInput) appInput.value = user.app_password || "";
                document.getElementById("registration").value = user.registration || "";
                document.getElementById("year").value = user.year || "";
                document.getElementById("branch").value = user.branch || "";
                document.getElementById("school").value = user.school || "";
                document.getElementById("cgpa").value = user.cgpa || "";
                const usernameInput = document.getElementById("username");
                if (usernameInput) {
                    usernameInput.value = user.username || "";
                    usernameInput.setAttribute("readonly", "readonly");
                }
                // new fields
                const tenthInput = document.getElementById("tenth-percentage");
                if (tenthInput) tenthInput.value = user.tenth_percentage || "";
                const twelfthInput = document.getElementById("twelfth-percentage");
                if (twelfthInput) twelfthInput.value = user.twelfth_percentage || "";
            } catch (err) {
                console.error("Error fetching profile:", err);
            }

            // Handle profile updates
            profileForm.addEventListener("submit", async function(e) {
                e.preventDefault();
                const payload = {
                    fullname: document.getElementById("fullname").value.trim(),
                    email: document.getElementById("email").value.trim(),
                    app_password: (document.getElementById("app-password")||{value:''}).value,
                    registration: document.getElementById("registration").value.trim(),
                    year: document.getElementById("year").value.trim(),
                    branch: document.getElementById("branch").value.trim(),
                    school: document.getElementById("school").value.trim(),
                    cgpa: document.getElementById("cgpa").value.trim(),
                    tenth_percentage: (document.getElementById("tenth-percentage")||{value:''}).value.trim(),
                    twelfth_percentage: (document.getElementById("twelfth-percentage")||{value:''}).value.trim()
                };
                try {
                    const res = await fetch(`/api/profile/${JSON.parse(localStorage.getItem("currentUser")).username}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    const data = await res.json();
                    const msg = document.getElementById("profile-message");
                    if (res.ok) {
                        localStorage.setItem("currentUser", JSON.stringify(data.user));
                        if (msg) msg.textContent = "Profile updated successfully!";
                    } else {
                        if (msg) msg.textContent = data.detail || "Error updating profile.";
                    }
                } catch (err) {
                    console.error(err);
                    showPopup("Server error while updating profile.");
                }
            });
        })();
    }
});

