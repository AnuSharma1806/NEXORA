/* =====================================================
   NEXORA — MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   LOADER
===================================================== */

window.addEventListener("load", function () {

    const loader = document.getElementById("loader");

    if (!loader) {
        console.log("NEXORA: loader element not found");
        return;
    }

    setTimeout(function () {

        loader.classList.add("hidden");
        document.body.classList.remove("loading");

        // Let the loader finish its fade before any scroll/reveal motion begins.
        setTimeout(function () {
            if (typeof revealElements === "function") revealElements();
        }, 180);

        console.log("NEXORA: SYSTEM ONLINE");

    }, 1200);

});


/* =====================================================
   CUSTOM CURSOR
===================================================== */

const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

if (cursorDot && cursorRing) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left = mouseX + "px";
        cursorDot.style.top = mouseY + "px";

    });


    function animateCursor() {

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        cursorRing.style.left = ringX + "px";
        cursorRing.style.top = ringY + "px";

        requestAnimationFrame(animateCursor);

    }

    animateCursor();


    const interactiveElements =
        document.querySelectorAll("a, button");


    interactiveElements.forEach((element) => {

        element.addEventListener("mouseenter", () => {

            cursorRing.style.width = "48px";
            cursorRing.style.height = "48px";

        });


        element.addEventListener("mouseleave", () => {

            cursorRing.style.width = "30px";
            cursorRing.style.height = "30px";

        });

    });

}


/* =====================================================
   SCROLL REVEAL
===================================================== */

function revealElements() {

    const elements =
        document.querySelectorAll(".reveal");


    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    elements.forEach((element, index) => {

        element.style.transitionDelay =
            `${index * 0.06}s`;

        observer.observe(element);

    });

}


/* =====================================================
   NAVBAR SCROLL EFFECT
===================================================== */

const navbar =
    document.querySelector(".navbar");


window.addEventListener("scroll", () => {

    if (!navbar) return;


    if (window.scrollY > 40) {

        navbar.style.background =
            "rgba(5,6,5,0.92)";

        navbar.style.borderBottomColor =
            "rgba(199,255,61,0.12)";

    } else {

        navbar.style.background =
            "rgba(5,6,5,0.72)";

        navbar.style.borderBottomColor =
            "rgba(255,255,255,0.06)";

    }

});


/* =====================================================
   MOBILE MENU
===================================================== */

const mobileMenu =
    document.getElementById("mobileMenu");


const navLinks =
    document.querySelector(".nav-links");


if (mobileMenu) {

    mobileMenu.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("mobile-open");


        if (isOpen) {

            navLinks.style.display = "flex";

            navLinks.style.position = "absolute";

            navLinks.style.top = "72px";

            navLinks.style.left = "0";

            navLinks.style.width = "100%";

            navLinks.style.padding = "25px";

            navLinks.style.background =
                "rgba(5,6,5,0.98)";

            navLinks.style.flexDirection = "column";

            navLinks.style.gap = "25px";

        } else {

            navLinks.removeAttribute("style");

        }

    });

}


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll("section[id]");


const navigationLinks =
    document.querySelectorAll(".nav-links a");


window.addEventListener("scroll", () => {

    let currentSection = "";


    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 150;


        if (window.scrollY >= sectionTop) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navigationLinks.forEach((link) => {

        link.classList.remove("active");


        const href =
            link.getAttribute("href");


        if (href === `#${currentSection}`) {

            link.classList.add("active");

        }

    });

});


/* =====================================================
   SMOOTH ANCHOR NAVIGATION
===================================================== */

document.querySelectorAll('a[href^="#"]')
    .forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");


            if (targetId === "#") return;


            const target =
                document.querySelector(targetId);


            if (!target) return;


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


/* =====================================================
   AI CORE INTERACTION
===================================================== */

const aiCore =
    document.querySelector(".ai-core");


if (aiCore) {

    aiCore.addEventListener("mouseenter", () => {

        aiCore.style.transform =
            "scale(1.08)";

        aiCore.style.transition =
            "transform 0.4s ease";

    });


    aiCore.addEventListener("mouseleave", () => {

        aiCore.style.transform =
            "scale(1)";

    });

}


/* =====================================================
   CAREER CARD TILT
===================================================== */

const careerCards =
    document.querySelectorAll(".career-card");


careerCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        const rect =
            card.getBoundingClientRect();


        const x =
            event.clientX - rect.left;


        const y =
            event.clientY - rect.top;


        const centerX =
            rect.width / 2;


        const centerY =
            rect.height / 2;


        const rotateX =
            ((y - centerY) / centerY) * -2;


        const rotateY =
            ((x - centerX) / centerX) * 2;


        card.style.transform =
            `perspective(700px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-5px)`;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


/* =====================================================
   CONSOLE BRANDING
===================================================== */

console.log(
`
╔══════════════════════════════════╗
║                                  ║
║          N E X O R A             ║
║                                  ║
║     AI CAREER INTELLIGENCE       ║
║                                  ║
║       SYSTEM ONLINE              ║
║                                  ║
╚══════════════════════════════════╝
`
);
/* Safety: reveal elements even when the loader is absent. */
document.addEventListener("DOMContentLoaded",()=>{if(typeof revealElements==="function")revealElements();});
