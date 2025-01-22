

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize smooth scroll
const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
    wheelMultiplier: 1
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Connect GSAP ScrollTrigger and Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Create main timeline for section2
const mainTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.section2',
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 2
    }
});

// Add accordion collapse animation with fade effect
function addAccordionAnimation() {
    // Only select first 3 cards
    const cards = document.querySelectorAll('.card1, .card2, .card3');
    const expandedWidth = 700; // Width when expanded
    const collapsedWidth = 80; // Reduced from 150 to 80 for smaller collapsed state

    cards.forEach((card, index) => {
        mainTimeline.to(card, {
            width: collapsedWidth,
            duration: 1,
            onUpdate: function() {
                const progress = this.progress();
                animateCardCollapse(index + 1, progress);
            }
        }, index * 0.2); // Stagger the animations
    });

    // Add a 1-second delay after all animations
    mainTimeline.to({}, { duration: 0.2 }); // Empty tween for delay
}

// Function to handle card collapse animation
function animateCardCollapse(cardNumber, progress) {
    const card = document.querySelector(`.card${cardNumber}`);
    const text = card.querySelector('.card-text');
    const image = card.querySelector('.card-image');
    const heading = card.querySelector('.card-heading');
    const numberDiv = card.querySelector('.card-number');
    const cardTop = card.querySelector('.card-top');
    
    // Fade out content (excluding the number)
    const opacity = 1 - (progress * 2); // Fade out faster than the collapse
    gsap.to([text, image], {
        opacity: opacity,
        duration: 0
    });

    // Handle border-bottom fade out
    const borderOpacity = 1 - progress * 2; // Start fading border early
    cardTop.style.borderBottom = `1px solid rgba(0, 0, 0, ${Math.max(0, borderOpacity * 0.1)})`;

    // Calculate heading position
    const headingHeight = heading.offsetHeight;
    const cardHeight = card.offsetHeight;
    const bottomPadding = 20; // Pixels from bottom
    
    // Calculate font properties
    const initialFontSize = 1.5; // Starting size in rem
    const finalFontSize = 1; // End size in rem
    const initialFontWeight = 600;
    const finalFontWeight = 400;
    
    const fontSize = initialFontSize - ((initialFontSize - finalFontSize) * progress);
    const fontWeight = initialFontWeight - ((initialFontWeight - finalFontWeight) * progress);
    
    // Calculate x position - move heading left as card collapses
    const initialX = 0;
    const finalX = -35; // Adjusted to account for left padding
    const xPosition = initialX + ((finalX - initialX) * progress);
    
    // Move heading from top to bottom while rotating and changing font properties
    gsap.to(heading, {
        rotation: -90 * progress,
        y: (cardHeight - headingHeight - bottomPadding) * progress,
        x: xPosition,
        fontSize: `${fontSize}rem`,
        fontWeight: fontWeight,
        opacity: 1, // Keep heading visible
        duration: 0,
        ease: 'none'
    });

    // Handle number to checkmark transition
    if (progress > 0.9) { // Start transition at 90% of the animation
        numberDiv.classList.add('completed');
    } else {
        numberDiv.classList.remove('completed');
    }
}

// Initialize animations
addAccordionAnimation();

// Parallax effect for section1
gsap.fromTo('.section1', {
    y: '0'
}, {
    scrollTrigger: {
        trigger: '.section1',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: '30%',
    ease: 'none'
});

// Parallax effect for section3
gsap.to('.section3', {
    scrollTrigger: {
        trigger: '.section3',
        start: 'top bottom',
        end: 'top top',
        scrub: 1
    },
    y: 0,
    ease: 'power2.inOut'
});


