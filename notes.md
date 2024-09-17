# Landing Page Notes
## To Do
- Update typed text script to match Hugo site
    - Security updates important to this script
    - This script doesn't work for icons currently
    - This script doesn't remove its spans after completion currently
- Add fallback or inline svg with modernizrJS styling to replace or improve FA Icons 
    - Very large file when internet is slow
- Add links to portfolio when ready
    - Want to animate a ::before or ::after style to send people to correct area on click.
- Add fun konami code
    - All falls down?
    - Game to be played with characters on screen?
    - Zerg rush?
    - Terminal style thing?
- Video logo fallback script
    - If the user changes tab then the video stops, this is fine though
        - Currently we have a check when the video becomes visible again. This works currently but not perfect
        - Would be better to add a window state variable so that we can change behaviour if the window is not visible and so the video should have paused.