document.getElementById("getDuration").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: fetchPlaylistDuration,
        }, (results) => {
            if (results && results[0] && results[0].result) {
                document.getElementById("duration").innerText = `Total Duration: ${results[0].result}`;
            } else {
                document.getElementById("duration").innerText = "No playlist detected.";
            }
        });
    });
});

function fetchPlaylistDuration() {
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
