// Get the password input field
const passwordField = document.querySelector('input[type="password"]');

// Get the toggle password button
const togglePasswordButton = document.createElement('button');
togglePasswordButton.innerText = 'Peek';
togglePasswordButton.style.marginLeft = '10px';

// Insert the button after the password input field
passwordField.insertAdjacentElement('afterend', togglePasswordButton);

// Add a click event listener to the button
togglePasswordButton.addEventListener('click', () => {
  event.preventDefault();
  // Get the current type of the password field
  const type = passwordField.getAttribute('type');

  // Toggle the password field between type "password" and type "text"
  if (type === 'password') {
    passwordField.setAttribute('type', 'text');
    togglePasswordButton.innerText = 'Hide';
  } else {
    passwordField.setAttribute('type', 'password');
    togglePasswordButton.innerText = 'Peek';
  }
});


// Get the copy button
const copyButton = document.createElement('button');
copyButton.innerText = 'Copy';
copyButton.style.marginLeft = '10px';

// Insert the button after the password input field
passwordField.insertAdjacentElement('afterend', copyButton);

// Add a click event listener to the button
copyButton.addEventListener('click', () => {
  event.preventDefault();
  // Copy the value of the password field to the clipboard
  navigator.clipboard.writeText(passwordField.value)
    .then(() => {
    })
    .catch((error) => {
      console.error('Failed to copy password: ', error);
    });
});