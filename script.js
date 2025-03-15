const skillsElement = document.getElementById("skills");

let skills = ["Passionate Website Developer", "Expert in Shopify & WordPress","Dedicated & Professional Freelancer", ];
let currentSkillIndex = 0;
let textIndex = 0;
let erase = false;

function animateText() {
    if (erase) {
        eraseText();
    } else {
        writeText();
    }
}

function writeText() {
    if (textIndex < skills[currentSkillIndex].length) {
        textIndex++;
        skillsElement.textContent = skills[currentSkillIndex].substring(0, textIndex);
        setTimeout(writeText, 50);
    } else {
        erase = true;
        setTimeout(() => {
            // Pause for 2 seconds before erasing
            setTimeout(eraseText, 2500);
        }, 0);
    }
}

function eraseText() {
    if (textIndex > 0) {
        textIndex--;
        skillsElement.textContent = skills[currentSkillIndex].substring(0, textIndex);
        setTimeout(eraseText, 40);
    } else {
        erase = false;
        currentSkillIndex = (currentSkillIndex + 1) % skills.length;
        textIndex = 0;
        setTimeout(writeText, 500);
    }
}

animateText();

// Get all nav links
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");
    const navbarHeight = document.querySelector('.navbar').offsetHeight; // Get navbar height

    function removeActiveClasses() {
        navLinks.forEach(link => link.classList.remove("active"));
    }

    function setActiveLink(link) {
        removeActiveClasses();
        link.classList.add("active");
        localStorage.setItem("activeNavLink", link.getAttribute("href"));
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const sectionId = link.getAttribute("href");
            document.querySelector(sectionId).scrollIntoView({ behavior: "smooth" });
            setActiveLink(link);
        });
    });

    function setActiveLinkOnScroll() {
        let currentActive = null;
        const scrollPosition = window.scrollY;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - navbarHeight; // Use navbar height instead of fixed 100px
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentActive = document.querySelector(`.nav-link[href="#${section.id}"]`);
            }
        });

        if (currentActive) {
            removeActiveClasses();
            currentActive.classList.add("active");
        }
    }

    const savedActiveLink = localStorage.getItem("activeNavLink");
    if (savedActiveLink) {
        const activeNavLink = document.querySelector(`.nav-link[href="${savedActiveLink}"]`);
        if (activeNavLink) {
            setActiveLink(activeNavLink);
        }
    }

    window.addEventListener("scroll", setActiveLinkOnScroll);
});


window.addEventListener("scroll", function () {
  const profilePic = document.querySelector(".profile-pic");
  const leftSection = document.querySelector(".left-section");

  if (window.scrollY >= leftSection.offsetTop) {
    profilePic.classList.add("sticky");
  } else {
    profilePic.classList.remove("sticky");
  }
});

document.addEventListener("DOMContentLoaded", function () {
    function updateTitle(sectionElement) {
        if (sectionElement) {
            document.title = sectionElement.id; // Set title to section ID
        }
    }

    function scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                updateTitle(targetSection);
            }, 300); // Small delay ensures scrolling works correctly
        }
    }

    // ✅ FIX: Ensure correct section scrolling when the page loads
        function handleInitialLoad() {
        const sectionId = window.location.hash.substring(1);
        if (sectionId) {
            setTimeout(() => scrollToSection(sectionId), 500);
        }
    }

    setTimeout(handleInitialLoad, 500);



    // ✅ FIX: Handle clicks inside `services.html`
    document.querySelectorAll("nav a").forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const sectionId = this.getAttribute("href").replace("#", "");
            window.location.hash = sectionId; // Update URL hash
            scrollToSection(sectionId);
        });
    });

    // ✅ FIX: Ensure scrolling works after full page load
    setTimeout(handleInitialLoad, 500); // Small delay ensures hash detection

    // ✅ FIX: Update title dynamically when scrolling
    window.addEventListener("scroll", function () {
        let scrollMiddle = window.scrollY + window.innerHeight / 2;
        let activeSection = null;
        let minDistance = Infinity;

        document.querySelectorAll("section").forEach((section) => {
            const sectionMiddle = section.offsetTop + section.offsetHeight / 2;
            let distance = Math.abs(scrollMiddle - sectionMiddle);

            if (distance < minDistance) {
                minDistance = distance;
                activeSection = section;
            }
        });

        if (activeSection) {
            updateTitle(activeSection);
        }
    });
});


// Get all links in the menu bar
const links = document.querySelectorAll('nav ul li a');

// Function to update the title
const updateTitle = (sectionId) => {
    const link = document.querySelector(`nav ul li a[href="${sectionId}"]`);
    if (link) {
        document.title = link.textContent;
        history.pushState({}, '', sectionId);
    }
};

// Add click event listener to each link
links.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        const sectionId = link.getAttribute('href'); // Get the section ID
        document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' }); // Smooth scroll
        updateTitle(sectionId); // Update title
    });
});

// Use Intersection Observer to detect scrolling into sections
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                updateTitle(`#${entry.target.id}`);
            }
        });
    },
    { threshold: 0.5 } // Adjust threshold as needed
);
// Observe each section
sections.forEach((section) => observer.observe(section));


/*Contact form */
(function () {
    emailjs.init('dS_QAic3P_mWeoWUH'); // Replace with your User ID

    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const form = this;
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        const messageDiv = document.getElementById('formMessage');

        clearErrors();

        let isValid = true;
        const userEmail = emailField.value.trim();  // Ensure we store the email correctly
        const userName = nameField.value.trim();   // Ensure we store the name correctly

        if (!userName) {
            showError(nameField, 'Please Enter Your Name');
            isValid = false;
        }
        if (!userEmail) {
            showError(emailField, 'Please Enter Your Email');
            isValid = false;
        } else if (!validateEmail(userEmail)) {
            showError(emailField, 'Invalid email format');
            isValid = false;
        }
        if (!messageField.value.trim()) {
            showError(messageField, 'Please Write Your Message');
            isValid = false;
        }

        if (!isValid) return;

        // Show message immediately
        showMessage('Message sent successfully!', 'success');

        // Send the message to your email
        emailjs.send("service_zt8nhch", "template_5fnpwy1", {
            from_name: userName,
            from_email: userEmail,
            message: messageField.value.trim(),
            to_email: 'myasirdeveloper01@gmail.com' // Your email
        }).then(() => {
            form.reset();

            console.log("Calling sendAutoReply with:", userEmail, userName);

            // Ensure the email is passed correctly before calling sendAutoReply
            if (userEmail) {
                setTimeout(() => sendAutoReply(userEmail, userName), 2000);
            } else {
                console.error("Auto-reply not sent: userEmail is empty.");
            }
        }, (error) => {
            showMessage('Something went wrong. Please try again.', 'danger');
            console.error(error);
        });
    });

    function sendAutoReply(userEmail, userName) {
        if (!userEmail) {
            console.error('Auto-reply error: Recipient email is empty.');
            return;
        }

        console.log("Auto-reply function triggered.");
        console.log("Sending auto-reply to:", userEmail);

        emailjs.send("service_zt8nhch", "template_iehym76", {
            user_name: userName,
            to_email: userEmail,
            from_email: "myasirdeveloper01@gmail.com",
            reply_to: "myasirdeveloper01@gmail.com"
        }).then(() => {
            console.log('Auto-reply sent successfully to:', userEmail);
        }, (error) => {
            console.error('Auto-reply failed:', error);
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(inputField, message) {
        let errorDiv = document.createElement('div');
        errorDiv.className = 'text-danger small mt-1 error-message';
        errorDiv.textContent = message;
        inputField.parentNode.appendChild(errorDiv);
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => error.remove());
    }

    function showMessage(text, type) {
        const messageDiv = document.getElementById('formMessage');

        // Create a progress bar
        messageDiv.innerHTML = `<span>${text}</span>`;

        messageDiv.className = `message alert alert-${type} show-message`;

        // Trigger animation
        setTimeout(() => {
            messageDiv.classList.add('fade-out'); // Start fading out
        }, 4500); // Duration before fade starts

        // Hide message after animation
        setTimeout(() => {
            messageDiv.className = 'message'; // Reset classes
            messageDiv.innerHTML = ''; // Clear content
        }, 3000);
    }

})();


   

  /* Toggle menu bar */

  function toggleMenu() {
    let menuButton = document.querySelector(".hamburger");
    let menu = document.querySelector(".navbar ul");
    let divider = document.querySelector(".menu-divider");

    divider.classList.toggle("show"); // Toggle hr visibility

    if (menu.classList.contains("show")) {
        divider.style.opacity = "0"; 
        divider.style.transform = "scaleX(0)";
        menu.classList.remove("show");
        menu.classList.add("hide");
        menuButton.textContent = "☰";
        menuButton.style.color = "red";
setTimeout(() => { menu.classList.remove("hide");  }, 500);

    } else {
        menu.classList.add("show");
        divider.style.opacity = "1";   // Show hr
        divider.style.transform = "scaleX(1)";
        menuButton.textContent = "✖";
        menuButton.style.color = "yellow";
    }
}

   /* Dark Mode */

  $(document).ready(function () {
    // Check if dark mode was previously enabled
    if (localStorage.getItem('theme') === 'dark') {
        $('body').addClass('dark-mode');
    }

    // Toggle dark mode on button click
    $('#darkModeToggle').click(function () {
        $('body').toggleClass('dark-mode');

        // Save user preference
        if ($('body').hasClass('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
