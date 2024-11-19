// Add console.log for debugging
console.log("Content script is running");

// Add null check for password field
const passwordField = document.querySelector('input[type="password"]');
if (!passwordField) {
    console.error("Password field not found");
    return;
}

// Create buttons with proper event handling
const togglePasswordButton = document.createElement('button');
togglePasswordButton.innerText = 'Peek';
togglePasswordButton.style.marginLeft = '10px';
passwordField.insertAdjacentElement('afterend', togglePasswordButton);

togglePasswordButton.addEventListener('click', (event) => {
    event.preventDefault();
    const type = passwordField.getAttribute('type');
    passwordField.setAttribute('type', type === 'password' ? 'text' : 'password');
    togglePasswordButton.innerText = type === 'password' ? 'Hide' : 'Peek';
});

const copyButton = document.createElement('button');
copyButton.innerText = 'Copy';
copyButton.style.marginLeft = '10px';
togglePasswordButton.insertAdjacentElement('afterend', copyButton);

copyButton.addEventListener('click', (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(passwordField.value)
        .then(() => console.log('Password copied to clipboard.'))
        .catch((error) => console.error('Failed to copy password: ', error));
});