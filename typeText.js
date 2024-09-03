document.addEventListener("DOMContentLoaded", function() {
    function typeEffect(element, speed, callback) {
        let text = element.textContent;
        element.textContent = "";
        element.classList.add('cursor'); // Add cursor class at the start
        element.classList.add('type-animation-started'); // Add type-animation-started class
        let i = 0;

        function typing() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else {
                //element.classList.remove('cursor'); // Remove cursor class
                //element.classList.add('no-cursor'); // Add no-cursor class
                if (callback) {
                    setTimeout(callback, 500); // Delay before starting the next line
                }
            }
        }
        
        typing();
    }

    const servicesList = document.querySelectorAll("#services-text li");
    const emailText = document.querySelector(".email a");
    const contactText = document.getElementById("contact-text");

    // Initially hide the elements
    servicesList.forEach(item => item.style.visibility = "hidden");
    emailText.style.visibility = "hidden";
    contactText.style.visibility = "hidden";

    // Function to handle typing each <li> item sequentially
    function typeListItems(items, index, speed, callback) {
        if (index < items.length) {
            items[index].style.visibility = "visible";
            typeEffect(items[index], speed, function() {
                typeListItems(items, index + 1, speed, callback);
            });
        } else if (callback) {
            callback();
        }
    }

    // Function to reveal elements within a specific div one by one
    function revealElementsSequentially(selector, interval) {
        const parentElement = document.querySelector(selector);
        if (parentElement) {
            const childElements = parentElement.children;
            let index = 0;

            function revealNextElement() {
                if (index < childElements.length) {
                    childElements[index].style.visibility = "visible";
                    childElements[index].classList.add('fade-in-animation');
                    index++;
                    setTimeout(revealNextElement, interval);
                }
            }

            revealNextElement();
        }
    }

    function addClassToSelector(selector, className) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add(className);
        } else {
            console.warn(`Element with selector "${selector}" not found.`);
        }
    }

    // Start typing the list items, then move to the email and contact text
    setTimeout(() => {
        typeListItems(servicesList, 0, 80, function() {
            contactText.style.visibility = "visible";
            typeEffect(contactText, 80, function() {
                emailText.style.visibility = "visible";
                typeEffect(emailText, 80, function() {
                    revealElementsSequentially(".social-icons", 500, function() {
                        addClassToSelector(".highlight", "animated-highlight");
                    });
                });
            });
        });
    }, 2000);
});
