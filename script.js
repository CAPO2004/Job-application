// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector(".theme-icon");
    
    body.classList.toggle("dark-mode");
    
    if (body.classList.contains("dark-mode")) {
        themeIcon.className = "fas fa-sun theme-icon";
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.className = "fas fa-moon theme-icon";
        localStorage.setItem("theme", "light");
    }
    
    themeIcon.style.transform = "rotate(360deg)";
    setTimeout(() => {
        themeIcon.style.transform = "rotate(0deg)";
    }, 300);
}

// Load saved theme
document.addEventListener("DOMContentLoaded", function() {
    const savedTheme = localStorage.getItem("theme");
    const body = document.body;
    const themeIcon = document.querySelector(".theme-icon");
    
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeIcon.className = "fas fa-sun theme-icon";
    } else {
        themeIcon.className = "fas fa-moon theme-icon";
    }
    
    showWelcomeMessage();
});

// Welcome notification functionality
function showWelcomeMessage() {
    const welcomeNotification = document.getElementById("welcomeNotification");
    if (welcomeNotification) {
        welcomeNotification.style.display = "block";
        setTimeout(() => {
            hideWelcome();
        }, 5000);
    }
}

function hideWelcome() {
    const welcomeNotification = document.getElementById("welcomeNotification");
    if (welcomeNotification) {
        welcomeNotification.style.opacity = "0";
        welcomeNotification.style.transform = "translateX(100%)";
        setTimeout(() => {
            welcomeNotification.style.display = "none";
        }, 300);
    }
}

// Checkbox functionality
function toggleCheckbox(checkbox) {
    checkbox.classList.toggle("checked");
}

// Handle CV file selection for display
document.getElementById("cvFile").addEventListener("change", function(e) {
    const fileNameSpan = document.getElementById("fileName");
    const file = e.target.files[0];
    if (file) {
        fileNameSpan.textContent = `تم اختيار الملف: ${file.name}`;
        fileNameSpan.style.display = "block";
    } else {
        fileNameSpan.textContent = "";
        fileNameSpan.style.display = "none";
    }
});

// Add click listener to upload-area to trigger file input
document.addEventListener("DOMContentLoaded", function() {
    const uploadArea = document.querySelector(".upload-area");
    const cvFileInput = document.getElementById("cvFile");

    if (uploadArea && cvFileInput) {
        uploadArea.addEventListener("click", function() {
            cvFileInput.click(); // Programmatically click the hidden file input
        });
    }
});

// Form validation and submission - FINAL VERSION with file upload
document.getElementById("employmentForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitButton = form.querySelector(".submit-btn");
    const originalButtonText = submitButton.innerHTML;

    // --- Validation ---
    let isValid = true;
    const requiredInputs = form.querySelectorAll("input[required]:not([type=\'file\']), select[required]");
    const cvFile = document.getElementById("cvFile");

    requiredInputs.forEach(input => {
        input.classList.remove("input-error");
        const errorDiv = input.closest(".form-group").querySelector(".error");
        if (errorDiv) errorDiv.style.display = "none";

        if (!input.value.trim()) {
            isValid = false;
            input.classList.add("input-error");
            if (errorDiv) errorDiv.style.display = "block";
        }
    });

    // Validate CV file
    if (!cvFile.files.length) {
        isValid = false;
        alert("يرجى اختيار ملف السيرة الذاتية.");
    }

    if (!isValid) {
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "<i class=\"fas fa-spinner fa-spin\"></i> جاري الإرسال...";

    try {
        const formData = new FormData(form);
        
        // Add checkbox value to formData explicitly
        formData.append("is_available", document.querySelector(".checkbox").classList.contains("checked") ? "نعم" : "لا");

        // Append the file to formData
        if (cvFile.files.length > 0) {
            formData.append("cv_file", cvFile.files[0]);
        }

        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwBcKK_7bdxe_HlEhZ0yFHN2akqrEWc-6yrAfgzlXSKQJ98DU2rWWom_ikeZCr2IHIl/exec"; 

        // Send FormData directly for multipart/form-data
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            // mode: "no-cors", // Keep no-cors for now to avoid CORS issues, will handle response differently
            cache: "no-cache",
            body: formData, // FormData automatically sets Content-Type to multipart/form-data
            redirect: "follow"
        });

        // We cannot directly read response.json() with no-cors, so we assume success if no network error
        // A more robust solution would involve a proxy or a different CORS setup on GAS
        alert("تم استلام بياناتك والسيرة الذاتية بنجاح!");
        
        form.reset();
        document.getElementById("fileName").style.display = "none";
        const checkbox = document.querySelector(".checkbox");
        if (checkbox) checkbox.classList.remove("checked");

    } catch (error) {
        console.error("Error:", error);
        alert("عذراً، حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});


// Add animation to form elements on scroll
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", function() {
    const formGroups = document.querySelectorAll(".form-group");
    formGroups.forEach(group => { observer.observe(group); });
    createFloatingElements();
});

// Floating elements and other animations...
function createFloatingElements() {
    const container = document.querySelector(".floating-elements");
    if (!container) return;
    
    const elements = [
        "<i class=\"fas fa-file-alt\"></i>", "<i class=\"fas fa-briefcase\"></i>", "<i class=\"fas fa-user-tie\"></i>",
        "<i class=\"fas fa-chart-bar\"></i>", "<i class=\"fas fa-trophy\"></i>", "<i class=\"fas fa-dollar-sign\"></i>",
        "<i class=\"fas fa-graduation-cap\"></i>", "<i class=\"fas fa-handshake\"></i>", "<i class=\"fas fa-building\"></i>",
        "<i class=\"fas fa-clock\"></i>", "<i class=\"fas fa-laptop\"></i>", "<i class=\"fas fa-phone\"></i>"
    ];
    
    setInterval(() => {
        if (container.children.length < 12) {
            const element = document.createElement("div");
            element.className = "floating-element";
            element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
            element.style.left = Math.random() * 100 + "%";
            element.style.animationDuration = (Math.random() * 10 + 10) + "s";
            container.appendChild(element);
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 20000);
        }
    }, 3000);
}

// Particle effect on form interaction
document.addEventListener("DOMContentLoaded", () => {
    const createParticle = (x, y) => {
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.left = x + "px";
        particle.style.top = y + "px";
        particle.style.width = "4px";
        particle.style.height = "4px";
        particle.style.background = "linear-gradient(45deg, #4facfe, #00f2fe)";
        particle.style.borderRadius = "50%";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "1000";
        particle.style.animation = "particleFloat 1s ease-out forwards";
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 1000);
    };

    const particleStyle = document.createElement("style");
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) scale(0); }
        }
    `;
    document.head.appendChild(particleStyle);

    const inputs = document.querySelectorAll(".form-input, .form-select, .upload-area");
    inputs.forEach(input => {
        input.addEventListener("focus", (e) => {
            const rect = e.target.getBoundingClientRect();
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createParticle(
                        rect.left + Math.random() * rect.width,
                        rect.top + Math.random() * rect.height
                    );
                }, i * 100);
            }
        });
    });
});

