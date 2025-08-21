document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleMode');
  const body = document.body;

  toggleButton.addEventListener('click', () => {
    if (body.classList.contains('light')) {
      body.classList.remove('light');
      body.classList.add('dark');
      toggleButton.textContent = 'الوضع النهاري';
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
      toggleButton.textContent = 'الوضع الليلي';
    }
  });
});
