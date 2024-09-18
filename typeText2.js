document.addEventListener("DOMContentLoaded", function() {
    // Helper function to escape special characters in the text to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML; // This ensures any special characters are escaped
    }
    
    // Function to type out an element with letters wrapped in spans and animate opacity or visibility (for text elements)
    function typeEffect(element, speed, maintainSpace, callback) {
        let text = element.textContent;
        element.textContent = ""; // Clear text content

        // Wrap each letter in a span
        let htmlWithSpans = "";
        for (let char of text) {
            htmlWithSpans += `<span>${escapeHtml(char)}</span>`;
        }
        element.innerHTML = htmlWithSpans; // Set the element's HTML with spans

        // Make the element visible
        element.style.visibility = "visible";

        let i = 0;
        const spans = element.querySelectorAll('span'); // Select all the span-wrapped characters

        element.classList.add('type-animation-started'); // Add type-animation-started class if needed for styling
        if (maintainSpace) {
            // Maintain space using opacity
            spans.forEach(span => {
                span.style.opacity = 0; // Initially make all letters invisible
                span.style.transition = `opacity ${speed / 1000}s`; // Set opacity transition
            });
        } else {
            element.classList.add('cursor'); // Add cursor class only if we're not maintaining space
            spans.forEach(span => {
                span.style.display = 'none'; // Initially hide all letters
            });
        }

        // Typing effect
        function typing() {
            if (i < spans.length) {
                if (maintainSpace) {
                    spans[i].style.opacity = 1; // Make the letter visible by changing opacity
                } else {
                    spans[i].style.display = 'inline'; // Show the letter by changing display
                }
                
                i++;
                setTimeout(typing, speed); // Continue typing with faster speed
            } else {
                // Remove cursor class when typing is complete
                element.classList.remove('cursor');

                // Restore original text content by removing the spans if desired
                element.textContent = text;

                if (callback) {
                    callback(); // Move to the next element immediately
                }
            }
        }
        typing();
    }

    // Function to fade in non-text elements
    function fadeEffect(element, speed, callback) {
        element.style.visibility = "visible";
        element.style.opacity = 0; // Set initial opacity to 0
        element.style.transition = `opacity ${speed / 1000}s`; // Set transition speed
        element.style.opacity = 1; // Fade in the element

        setTimeout(function() {
            if (callback) callback();
        }, speed);
    }

    // Function to handle typing each text element from a list of elements
    function typeListItems(items, index, speed, maintainSpace, callback) {
        if (index < items.length) {
            typeEffect(items[index], speed, maintainSpace, function() {
                typeListItems(items, index + 1, speed, maintainSpace, callback);
            });
        } else if (callback) {
            callback(); // Callback when all elements are finished
        }
    }

    // Function to handle fading in each non-text element from a list of elements
    function fadeListItems(items, index, speed, callback) {
        if (index < items.length) {
            fadeEffect(items[index], speed, function() {
                fadeListItems(items, index + 1, speed, callback);
            });
        } else if (callback) {
            callback(); // Callback when all elements are finished
        }
    }

    // Function to handle typing text elements in sequence
    function typeElementsInSequence(selectors, speed, maintainSpace, callback) {
        function processNextSelector(index) {
            if (index < selectors.length) {
                const elements = document.querySelectorAll(selectors[index]);
                typeListItems(elements, 0, speed, maintainSpace, function() {
                    processNextSelector(index + 1);
                });
            } else if (callback) {
                callback(); // When done, execute the callback
            }
        }

        processNextSelector(0); // Start with the first selector
    }

    // Function to handle fading in non-text elements in sequence
    function fadeElementsInSequence(selectors, speed, callback) {
        function processNextSelector(index) {
            if (index < selectors.length) {
                const elements = document.querySelectorAll(selectors[index]);
                fadeListItems(elements, 0, speed, function() {
                    processNextSelector(index + 1);
                });
            } else if (callback) {
                callback(); // When done, execute the callback
            }
        }

        processNextSelector(0); // Start with the first selector
    }

    // List of selectors to be animated in order
    const selectorsToAnimateA = [".services ul li, .contact, .email a"];  // Text elements
    const selectorsToAnimateB = [".social-icons a"];  // Non-text elements (like icons)

    // Immediately hide all elements on load
    [selectorsToAnimateA, selectorsToAnimateB].forEach(selectors => {
        const elements = document.querySelectorAll(selectors);
        elements.forEach(item => {
            item.style.visibility = "hidden"; // Hide all elements immediately
        });
    });

    // Start typing animations for text elements (change true/false for maintainSpace parameter)
    setTimeout(() => {
        typeElementsInSequence(selectorsToAnimateA, 60, false, function() {
            // After typing animation finishes, start fading animations for non-text elements
            fadeElementsInSequence(selectorsToAnimateB, 400);
        });
    });
});
