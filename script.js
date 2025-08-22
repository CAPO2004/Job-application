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
    
    // Add click listener to upload-area to trigger file input
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
        // Check file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert("حجم الملف كبير جداً. الحد الأقصى هو 5MB.");
            e.target.value = ""; // Reset file input
            fileNameSpan.style.display = "none";
            return;
        }
        fileNameSpan.textContent = `تم اختيار الملف: ${file.name}`;
        fileNameSpan.style.display = "block";
    } else {
        fileNameSpan.style.display = "none";
    }
});

// Form validation and submission
document.getElementById("employmentForm").addEventListener("submit", async function(e) {
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

    // --- Prepare Data ---
    const formDataObject = {
        action: "submitData", // Action for Apps Script
        name: form.elements["name"].value,
        position: form.elements["position"].value,
        phone: form.elements["phone"].value,
        birth_date: form.elements["birth_date"].value,
        education: form.elements["education"].value,
        experience: form.elements["experience"].value,
        last_salary: form.elements["last_salary"].value,
        expected_salary: form.elements["expected_salary"].value,
        is_available: document.querySelector(".checkbox").classList.contains("checked") ? "نعم" : "لا",
    };

    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz7MS49ZilzCbf7lUPQ-Zak7DKZhQbndCeMdyY-2yef5fYY40e6Af0DzS2_xlBqMFA/exec";

    try {
        // --- Step 1: Submit text data and get the row number ---
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formDataObject ),
            redirect: "follow"
        });

        const result = await response.json();

        if (result.status !== "success") {
            throw new Error(result.message || "فشل تسجيل البيانات النصية.");
        }

        // --- Quick Success Message for User ---
        alert("تم استلام بياناتك بنجاح! يتم الآن رفع السيرة الذاتية في الخلفية.");
        
        const rowNumber = result.row; // Get the row number from the response

        // --- Step 2: Upload the file in the background ---
        const file = cvFile.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const fileData = reader.result.split(',');
            const fileUploadObject = {
                action: "uploadFile", // Different action for Apps Script
                rowNumber: rowNumber,
                fileContent: fileData[1],
                mimeType: file.type,
                fileName: file.name
            };

            // Use `fetch` again to upload the file and update the sheet
            fetch(WEB_APP_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fileUploadObject)
            }).then(res => res.json()).then(fileResult => {
                if (fileResult.status === "success") {
                    console.log("File uploaded and link added successfully:", fileResult.fileLink);
                } else {
                    console.error("File upload failed:", fileResult.message);
                }
            }).catch(err => {
                console.error("Error during file upload:", err);
            });
        };

        reader.onerror = () => {
            console.error("Could not read the file for upload.");
        };

        // --- Reset Form ---
        form.reset();
        document.getElementById("fileName").style.display = "none";
        const checkbox = document.querySelector(".checkbox");
        if (checkbox) checkbox.classList.remove("checked");

    } catch (error) {
        console.error("Error:", error);
        alert(`عذراً، حدث خطأ أثناء إرسال البيانات: ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});
