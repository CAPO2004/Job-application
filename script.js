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
    
    showWelcomeMessage();
});

// Welcome notification functionality
function showWelcomeMessage() {
    const welcomeNotification = document.getElementById('welcomeNotification');
    if (welcomeNotification) {
        welcomeNotification.style.display = 'block';
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
document.getElementById('employmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitButton = form.querySelector('.submit-btn');
    const originalButtonText = submitButton.innerHTML;

    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        input.classList.remove('input-error');
        const errorDiv = input.closest('.form-group').querySelector('.error');
        if (errorDiv) errorDiv.style.display = 'none';

        if (!input.value.trim() || (input.type === 'file' && input.files.length === 0)) {
            isValid = false;
            input.classList.add('input-error');
            if (errorDiv) errorDiv.style.display = 'block';
        }
    });

    if (!isValid) {
        alert('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

    try {
        const cvFile = document.getElementById('cvFile').files[0];
        const fileFormData = new FormData();
        fileFormData.append('file', cvFile);

        const fileUploadResponse = await fetch('https://file.io', { method: 'POST', body: fileFormData } );
        if (!fileUploadResponse.ok) throw new Error('فشل رفع السيرة الذاتية.');
        
        const fileUploadResult = await fileUploadResponse.json();
        const cvFileLink = fileUploadResult.link;

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            position: formData.get('position'),
            phone: formData.get('phone'),
            birth_date: formData.get('birth_date'),
            education: formData.get('education'),
            experience: formData.get('experience'),
            last_salary: formData.get('last_salary'),
            expected_salary: formData.get('expected_salary'),
            is_available: document.querySelector('.checkbox').classList.contains('checked') ? 'نعم' : 'لا',
            cv_file_link: cvFileLink
        };

        // ===============================================================
        // تم وضع الرابط الجديد الخاص بك هنا
        const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwaxBu5gTs3uiElRDGfWw2Zu7RD9oYKZU6aJQyc0K1V-FSbQdjoL3mLYV7mz2Dnhtdg/exec'; 
        // ===============================================================

        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data ),
            redirect: 'follow'
        });

        alert('تم استلام طلبك بنجاح! سنقوم بالاتصال بك خلال 24 ساعة.');
        form.reset();
        document.getElementById('fileName').style.display = 'none';
        const checkbox = document.querySelector('.checkbox');
        if (checkbox) checkbox.classList.remove('checked');

    } catch (error) {
        console.error('Error:', error);
        alert('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى. ' + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// Add animation to form elements on scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => { observer.observe(group); });
    createFloatingElements();
});

// Floating elements and other animations...
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    
    const elements = [
        '<i class="fas fa-file-alt"></i>', '<i class="fas fa-briefcase"></i>', '<i class="fas fa-user-tie"></i>',
        '<i class="fas fa-chart-bar"></i>', '<i class="fas fa-trophy"></i>', '<i class="fas fa-dollar-sign"></i>',
        '<i class="fas fa-graduation-cap"></i>', '<i class="fas fa-handshake"></i>', '<i class="fas fa-building"></i>',
        '<i class="fas fa-clock"></i>', '<i class="fas fa-laptop"></i>', '<i class="fas fa-phone"></i>'
    ];
    
    setInterval(() => {
        if (container.children.length < 12) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
            element.style.left = Math.random() * 100 + '%';
            element.style.animationDuration = (Math.random() * 10 + 10) + 's';
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
document.addEventListener('DOMContentLoaded', () => {
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
