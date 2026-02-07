document.addEventListener('DOMContentLoaded', function() {
    const friendNameInput = document.getElementById('friendName');
    const generateBtn = document.getElementById('generateBtn');
    const resultSection = document.getElementById('resultSection');
    const generatedLink = document.getElementById('generatedLink');
    const copyBtn = document.getElementById('copyBtn');
    const previewLink = document.getElementById('previewLink');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');

    function generateRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    generateBtn.addEventListener('click', function() {
        const friendName = friendNameInput.value.trim();
        
        if (!friendName) {
            showNotification("Please enter your friend's name!", "error");
            friendNameInput.focus();
            return;
        }
        
        const surpriseId = generateRandomId();
        const encodedName = encodeURIComponent(friendName);
        const baseUrl = window.location.href.replace('index.html', '');
        const surpriseUrl = `${baseUrl}surprise.html?id=${surpriseId}&name=${encodedName}`;
        
        generatedLink.textContent = surpriseUrl;
        previewLink.href = surpriseUrl;
        
        resultSection.classList.remove('hidden');
        resultSection.style.opacity = '0';
        resultSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultSection.style.transition = 'all 0.5s ease';
            resultSection.style.opacity = '1';
            resultSection.style.transform = 'translateY(0)';
        }, 10);
        
        localStorage.setItem(`surprise_${surpriseId}`, JSON.stringify({
            name: friendName,
            createdAt: new Date().toISOString()
        }));
        
        showNotification("Surprise link generated successfully! 🎉");
    });

    copyBtn.addEventListener('click', function() {
        const linkText = generatedLink.textContent;
        
        navigator.clipboard.writeText(linkText).then(() => {
            showNotification("Link copied to clipboard! 📋");
            
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Link';
                copyBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showNotification("Failed to copy link. Please try again.", "error");
        });
    });

    function showNotification(message, type = "success") {
        notificationText.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');
        
        if (type === "error") {
            notification.style.background = "#f44336";
        } else {
            notification.style.background = "#4CAF50";
        }
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    friendNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    friendNameInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    friendNameInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });

    const placeholders = [
        "Enter your friend's name...",
        "Type your homie's name...",
        "Who's getting surprised? 👀",
        "Enter name for the big reveal!",
        "Your friend's name goes here..."
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
        friendNameInput.placeholder = placeholders[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);
});