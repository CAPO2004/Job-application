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

// Load saved theme and other initializations
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
    
    // إصلاح مشكلة رفع الملف المزدوج - حل جذري
    const uploadArea = document.querySelector(".upload-area");
    const cvFileInput = document.getElementById("cvFile");
    if (uploadArea && cvFileInput) {
        let isProcessing = false;
        uploadArea.addEventListener("click", (e) => {
            if (isProcessing) return;
            isProcessing = true;
            
            // منع الحدث الافتراضي
            e.preventDefault();
            e.stopPropagation();
            
            cvFileInput.click();
            
            // إعادة تعيين الحالة بعد فترة قصيرة
            setTimeout(() => {
                isProcessing = false;
            }, 500);
        });
        
        // منع النقر المزدوج على input نفسه
        cvFileInput.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    // إضافة تأثير الجزيئات المتوهجة
    createFloatingElements();
    setupParticleEffect();
    
    // إنشاء رسالة النجاح المخصصة
    createSuccessModal();
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
        if (file.size > 5 * 1024 * 1024) {
            alert("حجم الملف كبير جداً. الحد الأقصى هو 5MB.");
            e.target.value = "";
            fileNameSpan.style.display = "none";
            return;
        }
        fileNameSpan.textContent = `تم اختيار الملف: ${file.name}`;
        fileNameSpan.style.display = "block";
    } else {
        fileNameSpan.style.display = "none";
    }
});

// Form validation and submission (Base64 VERSION)
document.getElementById("employmentForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const form = this;
    const submitButton = form.querySelector(".submit-btn");
    const originalButtonText = submitButton.innerHTML;

    // منع الإرسال المزدوج
    if (submitButton.disabled) {
        return;
    }

    // --- Validation ---
    let isValid = true;
    const requiredInputs = form.querySelectorAll("input[required]:not([type='file']), select[required]");
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

    // تم جعل حقل السيرة الذاتية اختيارياً
    // if (!cvFile.files.length) {
    //     isValid = false;
    //     alert("يرجى اختيار ملف السيرة الذاتية.");
    // }

    if (!isValid) {
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "<i class='fas fa-spinner fa-spin'></i> جاري الإرسال...";

    const file = cvFile.files[0];
    let fileData = [null, null]; // تهيئة البيانات لكي تكون اختيارية
    let payload = {};

    const sendForm = async () => {
        payload = {
            name: form.elements["name"].value,
            position: form.elements["position"].value, // الوظيفة المطلوبة (كان آخر راتب)
            phone: form.elements["phone"].value,
            birth_date: form.elements["birth_date"].value,
            education: form.elements["education"].value,
            experience: form.elements["experience"].value,
            address: form.elements["address"].value, // العنوان (كان الوظيفة المطلوبة)
            expected_salary: form.elements["expected_salary"].value,
            is_available: document.querySelector(".checkbox").classList.contains("checked") ? "نعم" : "لا",
            fileContent: fileData[1],
            mimeType: fileData[0] ? fileData[0].split(':')[1].split(';')[0] : null,
            fileName: file ? file.name : null
        };

        try {
            const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzep_LS8CmkA0sz3JTjPL5a7BaUIChhy_3Ehsg5B8bXhoe_XtFc7e4XB5HMqddjJi_7/exec";

            const response = await fetch(WEB_APP_URL, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            });

            const result = await response.json();

            if (result.status === "success") {
                showCustomSuccessMessage(); // استدعاء رسالة النجاح المخصصة
                form.reset();
                document.getElementById("fileName").style.display = "none";
                document.querySelector(".checkbox")?.classList.remove("checked");
            } else {
                throw new Error(result.message || "حدث خطأ غير معروف من الخادم.");
            }

        } catch (error) {
            console.error("Error:", error);
            alert(`عذراً، حدث خطأ أثناء إرسال البيانات: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    };

    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function() {
            fileData = reader.result.split(","); // [0] is mime type, [1] is base64 content
            sendForm();
        };

        reader.onerror = function() {
            alert("عذراً، حدث خطأ أثناء قراءة الملف. يرجى المحاولة مرة أخرى.");
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        };
    } else {
        sendForm();
    }
});

// إنشاء رسالة النجاح المخصصة
function createSuccessModal() {
    const modalHTML = `
        <div id="successModal" class="success-modal">
            <div class="success-modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>تم الإرسال بنجاح!</h3>
                <p>شكراً لك على تقديم طلب التوظيف</p>
                <p>سيتم مراجعة بياناتك والتواصل معك قريباً</p>
                <button onclick="hideCustomSuccessMessage()" class="success-btn">
                    <i class="fas fa-thumbs-up"></i> ممتاز
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // إضافة CSS للرسالة المخصصة - مع الحفاظ على لمعة الموقع الأصلية
    const modalStyles = `
        <style id="success-modal-styles">
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .success-modal.show {
            opacity: 1;
        }
        
        .success-modal-content {
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .success-modal.show .success-modal-content {
            transform: scale(1);
        }
        
        /* تأثير shimmer خاص برسالة النجاح فقط - لا يؤثر على باقي الموقع */
        .success-modal-content::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: successModalShimmer 2s infinite;
            pointer-events: none;
        }
        
        /* تسمية مختلفة للـ keyframes لتجنب التداخل مع shimmer الأصلي */
        @keyframes successModalShimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: successBounce 0.6s ease-out;
        }
        
        @keyframes successBounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }
        
        .success-modal-content h3 {
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
            font-weight: 700;
        }
        
        .success-modal-content p {
            margin: 0.5rem 0;
            opacity: 0.9;
            font-size: 1rem;
        }
        
        .success-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            padding: 0.8rem 2rem;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1.5rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .success-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
        
        body.dark-mode .success-modal-content {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
}

// دالة لعرض رسالة النجاح المخصصة
function showCustomSuccessMessage() {
    const successModal = document.getElementById("successModal");
    if (successModal) {
        successModal.style.display = "flex";
        setTimeout(() => {
            successModal.classList.add("show");
        }, 10);
    }
}

// دالة لإخفاء رسالة النجاح المخصصة
function hideCustomSuccessMessage() {
    const successModal = document.getElementById("successModal");
    if (successModal) {
        successModal.classList.remove("show");
        setTimeout(() => {
            successModal.style.display = "none";
        }, 300);
    }
}

// إضافة العناصر العائمة (Floating Elements)
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

// تأثير الجزيئات المتوهجة عند التفاعل مع حقول الإدخال
function setupParticleEffect() {
    // إنشاء دالة لإنتاج الجزيئات
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

    // إضافة CSS للحركة إذا لم تكن موجودة
    if (!document.getElementById("particle-styles")) {
        const particleStyle = document.createElement("style");
        particleStyle.id = "particle-styles";
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
    }

    // إضافة مستمعي الأحداث لحقول الإدخال
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

        // إضافة تأثير عند النقر أيضاً
        input.addEventListener("click", (e) => {
            const rect = e.target.getBoundingClientRect();
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createParticle(
                        rect.left + Math.random() * rect.width,
                        rect.top + Math.random() * rect.height
                    );
                }, i * 50);
            }
        });
    });
}

