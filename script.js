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
    
    const uploadArea = document.querySelector(".upload-area");
    const cvFileInput = document.getElementById("cvFile");
    if (uploadArea && cvFileInput) {
        uploadArea.addEventListener("click", () => cvFileInput.click());
    }
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

    if (!cvFile.files.length) {
        isValid = false;
        alert("يرجى اختيار ملف السيرة الذاتية.");
    }

    if (!isValid) {
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "<i class='fas fa-spinner fa-spin'></i> جاري الإرسال...";

    const file = cvFile.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async function() {
        const fileData = reader.result.split(','); // [0] is mime type, [1] is base64 content

        const payload = {
            name: form.elements["name"].value,
            position: form.elements["position"].value,
            phone: form.elements["phone"].value,
            birth_date: form.elements["birth_date"].value,
            education: form.elements["education"].value,
            experience: form.elements["experience"].value,
            last_salary: form.elements["last_salary"].value,
            expected_salary: form.elements["expected_salary"].value,
            is_available: document.querySelector(".checkbox").classList.contains("checked") ? "نعم" : "لا",
            fileContent: fileData[1],
            mimeType: file.type,
            fileName: file.name
        };

        try {
            const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzfS855Qm_WH6s-4baV0IlT1zUWFhxUZKZD7UZC8r2glkAXBjWwullb9MNDwGFw9Nik/exec";

            const response = await fetch(WEB_APP_URL, {
                method: "POST",
                body: JSON.stringify(payload ),
                // Important: Set content type to text/plain for Apps Script to handle it
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            });

            const result = await response.json();

            if (result.status === "success") {
                alert("تم استلام بياناتك والسيرة الذاتية بنجاح!");
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

    reader.onerror = function() {
        alert("عذراً، حدث خطأ أثناء قراءة الملف. يرجى المحاولة مرة أخرى.");
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    };
});
