window.onload = function() {
    // Define variables
    const html = document.documentElement;
    const video = document.getElementById('logo-video');
    let videoState = 'loading'; // Can be 'loading', 'playing', 'stopped'
    let fallbackTimeout;
    let checkInterval;
    let checkDuration = 1000; // Start with frequent checks (1 second)
    let totalCheckTime = 0; // Keep track of the total time we have been checking
    const maxCheckTime = 30000; // Stop checking after 30 seconds
    const videoMaxPlayDurationMultiplier = 3; // 4x video duration to ensure stability
    const debug = true;

    if (debug) console.log('Video fallback script loaded.');

    // Function to show fallback image
    function showFallback() {
        if (debug) console.log('Showing fallback image.');
        html.classList.remove('video');
        html.classList.add('no-video');
        clearTimeout(fallbackTimeout); // Stop any pending timeouts
    }

    // Function to show video again
    function showVideo() {
        console.log('Showing video.');
        html.classList.remove('no-video');
        html.classList.add('video');
        clearTimeout(fallbackTimeout); // Stop fallback timeout if video starts
    }

    // Function to monitor video playback
    function monitorVideoPlayback() {
        let lastTime = video.currentTime;
        let durationKnown = !isNaN(video.duration) && video.duration > 0;
        let videoDuration = video.duration;
        let stablePlayTime = 0;

        checkInterval = setInterval(() => {
            totalCheckTime += checkDuration;
            
            if (totalCheckTime >= maxCheckTime) {
                if (debug) console.log('Max time reached.');
                if (videoState !== 'playing') {
                    if (debug) console.log('Showing fallback due to maximum check time reached.');
                    showFallback();
                }
                if (debug) console.log('Exiting checks.');
                clearInterval(checkInterval);
                return;
            }

            const currentTime = video.currentTime;
            if (debug) console.log('Checking video playback... Current time:', currentTime);

            // If we know the duration, adjust checks with an offset
            if (durationKnown) {
                if (debug) console.log('Video duration is known:', videoDuration);

                // If the video hasn't moved, it might be stuck
                if (currentTime === lastTime) {
                    if (debug) console.log('Video appears to be stuck.');
                    if (videoState !== 'stopped') {
                        videoState = 'stopped';
                        showFallback();
                    }
                } else {
                    lastTime = currentTime;

                    // If the video was stopped and now is playing, restore it
                    if (videoState === 'stopped' || videoState === 'loading') {
                        if (debug) console.log('Video has started playing after being stopped.');
                        videoState = 'playing';
                        showVideo();
                    }

                    // If the video has been playing for 4x duration, stop checking
                    stablePlayTime += checkDuration;
                    if (stablePlayTime >= videoDuration * 1000 * videoMaxPlayDurationMultiplier) {
                        if (debug) console.log('Video has played continuously for multiple times its duration. Exiting checks.');
                        clearInterval(checkInterval);
                    }
                }
            } else {
                if (debug) console.log('Video duration is still unknown. Checking again...');
                durationKnown = !isNaN(video.duration) && video.duration > 0;
                videoDuration = video.duration;

                if (!durationKnown && totalCheckTime >= 5000) { // 5 seconds to get duration
                    if (debug) console.log('Video duration not determined in time. Setting state to loading.');
                    videoState = 'loading';
                    showFallback();
                }
            }

            // After the first 10 seconds, slow down the check interval to every 3 seconds
            if (totalCheckTime >= 10000) {
                clearInterval(checkInterval);
                checkDuration = 3000; // Slow down to 3 seconds
                monitorVideoPlayback(); // Restart checks with slower interval
            }

        }, checkDuration);
    }

    // Start monitoring the video when the page loads
    fallbackTimeout = setTimeout(() => {
        if (videoState === 'loading') {
            if (debug) console.log('Video did not start in time. Showing fallback.');
            showFallback();
        }
    }, 3000); // If video does not play within 3 seconds, show fallback

    // Function to check video duration and start monitoring playback
    function startVideoChecks() {
        if (debug) console.log('Checking if video duration is available...');
        const durationCheckInterval = setInterval(() => {
            if (!isNaN(video.duration) && video.duration > 0) {
                if (debug) console.log('Video duration found:', video.duration);
                clearInterval(durationCheckInterval);
                monitorVideoPlayback(); // Start playback monitoring once we know the duration
            } else {
                if (debug) console.log('Still waiting for video duration...');
            }
        }, 500); // Check every half second for video duration
    }

    startVideoChecks();

    // Add visibility change event listener
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // User has returned to the page
            if (debug) console.log('Page is visible again.');
            if (video.paused && videoState === 'stopped') {
                if (debug) console.log('Trying to play the video again...');
                totalCheckTime = 0; // Reset check time
                startVideoChecks();
            }
        }
    });
};

// get html5 video state
function getVideoState() {
    return document.getElementById('logo-video').paused ? 'paused' : 'playing';
}
