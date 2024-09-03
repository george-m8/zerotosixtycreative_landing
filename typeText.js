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

    // Start typing the list items, then move to the email and contact text
    setTimeout(() => {
        typeListItems(servicesList, 0, 100, function() {
            contactText.style.visibility = "visible";
            typeEffect(contactText, 100, function() {
                emailText.style.visibility = "visible";
                typeEffect(emailText, 100);
            });
        });
    }, 2000);
});
