window.onload = function (){
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
        history.go(1);
        alert("⚠️ Cannot go back! Please close the tab instead.");
    };
    
    window.onbeforeunload = function(e) {
        e.preventDefault();
        e.returnValue = 'If you reload or close, you cannot return to this page!';
        return e.returnValue;
    };
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
            e.preventDefault();
            alert("Refresh not allowed! Please close the tab.");
        }
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const friendName = urlParams.get('name') ? decodeURIComponent(urlParams.get('name')) : 'Friend';
    
    // DOM Elements
    const friendNameDisplay = document.getElementById('friendNameDisplay');
    const countdownDisplay = document.getElementById('countdown');
    const secondsDisplay = document.getElementById('seconds');
    const stopBtn = document.getElementById('stopBtn');
    const countdownSection = document.getElementById('countdownSection');
    const surpriseContent = document.getElementById('surpriseContent');
    const surpriseMessage = document.getElementById('surpriseMessage');
    const cancelledSection = document.getElementById('cancelledSection');
    const musicStatus = document.getElementById('musicStatus');
    
    
    const surpriseAudio = document.getElementById('surpriseAudio');
    
    friendNameDisplay.textContent = friendName;
    
    let countdown = 5;
    let countdownInterval;
    let isCancelled = false;
    let audioStarted = false;
    
   
    function unlockAudioAutoplay() {
        
        const silentAudio = new Audio();
        silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
        silentAudio.volume = 0.001;
        
        
        silentAudio.play().then(() => {
            silentAudio.pause();
            console.log("Audio autoplay unlocked!");
        }).catch(e => {
            console.log("Could not unlock audio:", e);
        });
    }
    
    
    unlockAudioAutoplay();
    
    
    document.addEventListener('click', unlockAudioAutoplay, { once: true });
    document.addEventListener('keydown', unlockAudioAutoplay, { once: true });
    document.addEventListener('touchstart', unlockAudioAutoplay, { once: true });
    
    
    function updateCountdown() {
        countdownDisplay.textContent = countdown;
        secondsDisplay.textContent = countdown;
        
        countdownDisplay.style.animation = 'none';
        setTimeout(() => {
            countdownDisplay.style.animation = 'countdownPulse 0.5s ease';
        }, 10);
    }
    
    
    function startCountdown() {
        updateCountdown();
        
        countdownInterval = setInterval(() => {
            countdown--;
            updateCountdown();
            
            if (countdown <= 0 && !isCancelled) {
                clearInterval(countdownInterval);
                showSurprise();
            }
        }, 1000);
    }
    
    
    function playAudioAtFullVolume() {
        if (audioStarted) return;
        
        try {
            
            surpriseAudio.volume = 1.0;
            surpriseAudio.currentTime = 0;
            
            console.log("Attempting to play audio at full volume...");
            
            
            const playPromise = surpriseAudio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Audio playing successfully at full volume!");
                    audioStarted = true;
                    musicStatus.innerHTML = '<i class="fas fa-volume-up"></i> Music playing at FULL VOLUME! 🔊';
                    musicStatus.style.color = '#4CAF50';
                    musicStatus.style.fontWeight = 'bold';
                }).catch(error => {
                    console.log("Autoplay failed, trying workaround:", error);
                    
                    
                    setTimeout(() => {
                        surpriseAudio.play().then(() => {
                            audioStarted = true;
                            musicStatus.innerHTML = '<i class="fas fa-volume-up"></i> Music playing at FULL VOLUME! 🔊';
                            musicStatus.style.color = '#4CAF50';
                            musicStatus.style.fontWeight = 'bold';
                        }).catch(e => {
                            console.log("Second attempt failed:", e);
                            musicStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Enable autoplay in browser settings';
                            musicStatus.style.color = '#ff9800';
                        });
                    }, 100);
                });
            }
        } catch (error) {
            console.log("Audio play error:", error);
            musicStatus.innerHTML = '<i class="fas fa-times-circle"></i> Music failed to load';
            musicStatus.style.color = '#f44336';
        }
    }
    
    
    function showSurprise() {
        countdownSection.style.display = 'none';
        
        
        surpriseMessage.textContent = `SURPRISE, ${friendName.toUpperCase()}! 🎉`;
        
        
        surpriseContent.classList.remove('hidden');
        surpriseContent.style.display = 'block';
        
        
        playAudioAtFullVolume();
        
       
        createConfetti();
    }
    
    
    function stopSurprise() {
        isCancelled = true;
        clearInterval(countdownInterval);
        
        countdownSection.style.display = 'none';
        
        cancelledSection.classList.remove('hidden');
        cancelledSection.style.display = 'block';
        
       
        surpriseAudio.pause();
        surpriseAudio.currentTime = 0;
        audioStarted = false;
    }
    
    
    function createConfetti() {
        const colors = ['#ff6b9d', '#6a11cb', '#2575fc', '#ff8e53', '#4CAF50'];
        const confettiCount = 150;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { top: '-10px', transform: 'rotate(0deg)' },
                { top: '100vh', transform: `rotate(${Math.random() * 720}deg)` }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }
    
    
    stopBtn.addEventListener('click', stopSurprise);
    
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isCancelled) {
            stopSurprise();
        }
    });
    
    
    startCountdown();
    
    
    const emojis = ['🎁', '🎉', '🤫', '🤔', '👀', '🔥', '💥', '✨'];
    let emojiIndex = 0;
    
    const emojiInterval = setInterval(() => {
        const emojiEl = document.querySelector('.emoji-large');
        if (emojiEl && countdownSection.style.display !== 'none') {
            emojiEl.textContent = emojis[emojiIndex];
            emojiIndex = (emojiIndex + 1) % emojis.length;
        } else {
            clearInterval(emojiInterval);
        }
    }, 800);
});