document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    messageDiv.className = 'message';
    messageDiv.style.display = 'none';

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value
    };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = result.message;
            messageDiv.classList.add('success');
            document.getElementById('registrationForm').reset();
        } else {
            messageDiv.textContent = result.error || 'Registration failed.';
            messageDiv.classList.add('error');
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred. Please try again later.';
        messageDiv.classList.add('error');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Student';
    }
});
