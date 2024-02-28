    document.addEventListener('DOMContentLoaded', function () {
    const shortenForm = document.querySelector('form');
    const shortUrlContainer = document.getElementById('shortUrlContainer');
    shortenForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const originalUrl = document.getElementById('originalurl').value;

        try {
            const response = await fetch('/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originalurl: originalUrl })
            });

            if (response.ok) {
                const data = await response.text();
                shortUrlContainer.innerHTML = data;
            } else {
                console.error('Failed to shorten URL:', response.statusText);
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
        }
    });
});

// async function copyUrl() {
//     const shortUrlValue = document.getElementById('shortUrlValue').innerText;
//     try {
//         await navigator.clipboard.writeText(shortUrlValue);
//     } catch (error) {
//         console.error('Error copying URL to clipboard:', error);
//         alert('Failed to copy URL to clipboard.');
//     }
// }
async function copyUrl() {
    const shortUrlValue = document.getElementById('shortUrlValue').innerText;
    try {
        await navigator.clipboard.writeText(shortUrlValue);
        displayCopiedMessage();
    } catch (error) {
        console.error('Error copying URL to clipboard:', error);
        alert('Failed to copy URL to clipboard.');
    }
}

function displayCopiedMessage() {
    // Create a new element for the message
    const messageElement = document.createElement('div');
    messageElement.textContent = 'URL copied to clipboard!';
    messageElement.classList.add('copied-message');

    // Style the message element
    messageElement.style.position = 'fixed';
    messageElement.style.width = '40%';
    messageElement.style.top = '10px'; // Adjust as needed
    messageElement.style.left = '60%'; // Adjust as needed
    messageElement.style.backgroundColor = '#4caf50'; // Green background color
    messageElement.style.color = 'white';
    messageElement.style.padding = '10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '9999'; // Ensure it's above other content

    // Append the message element to the body
    document.body.appendChild(messageElement);

    // Remove the message after a delay
    setTimeout(() => {
        messageElement.remove();
    }, 3000); // Remove the message after 3 seconds (adjust as needed)
}
