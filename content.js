// Log to confirm the script is running
console.log("Content script is running");

// Get the password input field
const passwordField = document.querySelector('input[type="password"]');

if (passwordField) {
  // Get the toggle password button
  const togglePasswordButton = document.createElement('button');
  togglePasswordButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;
  togglePasswordButton.style.marginLeft = '10px';
  togglePasswordButton.style.border = 'none';
  togglePasswordButton.style.background = 'none';
  togglePasswordButton.style.cursor = 'pointer';
  togglePasswordButton.style.padding = '5px';

  // Insert the toggle button after the password input field
  passwordField.insertAdjacentElement('afterend', togglePasswordButton);

  // Copy button with icon
  const copyButton = document.createElement('button');
  copyButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>`;
  copyButton.style.marginLeft = '10px';
  copyButton.style.border = 'none';
  copyButton.style.background = 'none';
  copyButton.style.cursor = 'pointer';
  copyButton.style.padding = '5px';

  // Insert the copy button after the toggle button
  togglePasswordButton.insertAdjacentElement('afterend', copyButton);

  // Create notification span
  const notificationSpan = document.createElement('span');
  notificationSpan.style.marginLeft = '5px';
  notificationSpan.style.color = '#4CAF50';
  notificationSpan.style.fontSize = '12px';
  notificationSpan.style.opacity = '0';
  notificationSpan.style.transition = 'opacity 0.3s ease';
  copyButton.insertAdjacentElement('afterend', notificationSpan);

  // Add click event listener for copy button
  copyButton.addEventListener('click', (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(passwordField.value)
      .then(() => {
        notificationSpan.textContent = 'Copied!';
        notificationSpan.style.opacity = '1';
        
        setTimeout(() => {
          notificationSpan.style.opacity = '0';
        }, 2000);
      })
      .catch((error) => {
        notificationSpan.textContent = 'Failed to copy';
        notificationSpan.style.color = '#F44336';
        notificationSpan.style.opacity = '1';
        
        setTimeout(() => {
          notificationSpan.style.opacity = '0';
        }, 2000);
      });
  });

  // Mouse events for peek functionality
  togglePasswordButton.addEventListener('mousedown', (event) => {
    event.preventDefault();
    passwordField.setAttribute('type', 'text');
    togglePasswordButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>`;
  });

  togglePasswordButton.addEventListener('mouseup', (event) => {
    event.preventDefault();
    passwordField.setAttribute('type', 'password');
    togglePasswordButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`;
  });

  togglePasswordButton.addEventListener('mouseout', (event) => {
    event.preventDefault();
    passwordField.setAttribute('type', 'password');
    togglePasswordButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`;
  });
} else {
  console.error("Password field not found");
}