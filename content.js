function calculateTotalDuration() {
    const durationElements = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer span');
    let totalSeconds = 0;

    durationElements.forEach(element => {
        const timeText = element.innerText.trim();
        const timeParts = timeText.split(':').reverse();
        let seconds = 0;

        if (timeParts.length >= 1) seconds += parseInt(timeParts[0]); 
        if (timeParts.length >= 2) seconds += parseInt(timeParts[1]) * 60; 
        if (timeParts.length >= 3) seconds += parseInt(timeParts[2]) * 3600; 

        totalSeconds += seconds;
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

function observePlaylistChanges() {
    const playlistContainer = document.querySelector('ytd-playlist-video-list-renderer');

    if (!playlistContainer) return;

    const observer = new MutationObserver(() => {
        const totalDuration = calculateTotalDuration();
        chrome.runtime.sendMessage({ action: "updateDuration", duration: totalDuration });
    });

    observer.observe(playlistContainer, { childList: true, subtree: true });
}

// Run observer when the page loads
window.addEventListener('load', () => {
    observePlaylistChanges();
});
