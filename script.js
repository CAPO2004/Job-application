// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.className = 'fas fa-sun theme-icon';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.className = 'fas fa-moon theme-icon';
        localStorage.setItem('theme', 'light');
    }
    
    // Add rotation animation
    themeIcon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeIcon.style.transform = 'rotate(0deg)';
    }, 300);
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun theme-icon';
    } else {
        themeIcon.className = 'fas fa-moon theme-icon';
    }
    
    // Show welcome message
    showWelcomeMessage();
});

// Welcome notification functionality
function showWelcomeMessage() {
    const welcomeNotification = document.getElementById('welcomeNotification');
    if (welcomeNotification) {
        welcomeNotification.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideWelcome();
        }, 5000);
    }
}

function hideWelcome() {
    const welcomeNotification = document.getElementById('welcomeNotification');
    if (welcomeNotification) {
        welcomeNotification.style.opacity = '0';
        welcomeNotification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            welcomeNotification.style.display = 'none';
        }, 300);
    }
}

// Checkbox functionality
function toggleCheckbox(checkbox) {
    checkbox.classList.toggle('checked');
}

// File upload handling
document.getElementById('cvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const fileNameDiv = document.getElementById('fileName');
    
    if (file) {
        if (file.type === 'application/pdf') {
            if (file.size <= 5 * 1024 * 1024) {
                fileNameDiv.style.display = 'block';
                fileNameDiv.innerHTML = `<i class="fas fa-check-circle"></i> تم اختيار الملف: ${file.name}`;
            } else {
                alert('حجم الملف كبير جداً. الحد الأقصى 5MB');
                e.target.value = '';
            }
        } else {
            alert('الرجاء رفع ملف PDF فقط');
            e.target.value = '';
        }
    }
});

// Form validation and submission
document.getElementById('employmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const inputs = this.querySelectorAll('input[required], select[required]');
    const errorDivs = this.querySelectorAll('.error');
    
    // Reset errors
    errorDivs.forEach(error => error.style.display = 'none');
    inputs.forEach(input => input.classList.remove('input-error'));
    
    // Validate inputs
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('input-error');
            const error = input.nextElementSibling;
            if (error && error.classList.contains('error')) {
                error.style.display = 'block';
            }
        }
    });
    
    // Validate file upload
    const fileInput = document.getElementById('cvFile');
    if (!fileInput.files.length) {
        isValid = false;
        fileInput.classList.add('input-error');
        const error = fileInput.closest('.form-group').querySelector('.error');
        if (error) error.style.display = 'block';
    }
    
    if (isValid) {
        // Show success message
        alert('تم استلام طلبك بنجاح! سنقوم بالاتصال بك خلال 24 ساعة.');
        this.reset();
        document.getElementById('fileName').style.display = 'none';
        
        // Reset checkbox
        const checkbox = document.querySelector('.checkbox');
        if (checkbox) checkbox.classList.remove('checked');
    } else {
        // Show error message
        alert('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
    }
});

// Add animation to form elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
        }
    });
}, observerOptions);

// Observe form groups
document.addEventListener('DOMContentLoaded', function() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        observer.observe(group);
    });
});

// Add floating animation to elements
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    
    const elements = [
        '<i class="fas fa-file-alt"></i>',
        '<i class="fas fa-briefcase"></i>',
        '<i class="fas fa-user-tie"></i>',
        '<i class="fas fa-chart-bar"></i>',
        '<i class="fas fa-trophy"></i>',
        '<i class="fas fa-dollar-sign"></i>',
        '<i class="fas fa-graduation-cap"></i>',
        '<i class="fas fa-handshake"></i>',
        '<i class="fas fa-building"></i>',
        '<i class="fas fa-clock"></i>',
        '<i class="fas fa-laptop"></i>',
        '<i class="fas fa-phone"></i>'
    ];
    
    setInterval(() => {
        if (container.children.length < 12) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
            element.style.left = Math.random() * 100 + '%';
            element.style.animationDuration = (Math.random() * 10 + 10) + 's';
            container.appendChild(element);
            
            // Remove element after animation
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 20000);
        }
    }, 3000);
}

// Start floating elements animation
document.addEventListener("DOMContentLoaded", createFloatingElements);
















    // Add particle effect on form interaction
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

    // Add particle animation CSS
    const particleStyle = document.createElement("style");
    particleStyle.textContent = `
        @keyframes particleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) scale(0);
            }
        }
    `;
    document.head.appendChild(particleStyle);

    // Add particles on input focus
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


