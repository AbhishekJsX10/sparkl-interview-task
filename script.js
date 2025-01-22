

// Initialized GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialized smooth scroll
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

// Connected GSAP ScrollTrigger and Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Created main timeline for section2
const mainTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.section2',
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 2
    }
});

// Accordion collapse animation with fade effect
function addAccordionAnimation() {
    // Only select first 3 cards
    const cards = document.querySelectorAll('.card1, .card2, .card3');
    const expandedWidth = 700; 
    const collapsedWidth = 80; 

    cards.forEach((card, index) => {
        mainTimeline.to(card, {
            width: collapsedWidth,
            duration: 1,
            onUpdate: function() {
                const progress = this.progress();
                animateCardCollapse(index + 1, progress);
            }
        }, index * 0.2);
    });

    mainTimeline.to({}, { duration: 0.2 }); 
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
    const opacity = 1 - (progress * 2);
    gsap.to([text, image], {
        opacity: opacity,
        duration: 0
    });

    // Handle border-bottom fade out
    const borderOpacity = 1 - progress * 2; 
    cardTop.style.borderBottom = `1px solid rgba(0, 0, 0, ${Math.max(0, borderOpacity * 0.1)})`;

    // Calculate heading position
    const headingHeight = heading.offsetHeight;
    const cardHeight = card.offsetHeight;
    const bottomPadding = 20; 
    
    // Calculate font properties
    const initialFontSize = 1.5; 
    const finalFontSize = 1; 
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
        opacity: 1, 
        duration: 0,
        ease: 'none'
    });

    // Handle number to checkmark transition
    if (progress > 0.9) { 
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


