function updateNameFormat() {
    const nameElement = document.getElementById('hover-name');
    const nameContainer = document.getElementById('name-container');
    const nameFormatDetails = document.querySelector('.name-format-details');

    if (nameElement && nameFormatDetails) {
        let names = [];
        let currentNameIndex = 0;

        try {
            // names stored in data attribute to keep HTML clean
            names = JSON.parse(nameElement.getAttribute('data-names'));
        }
        catch (e) {
            console.error("Could not parse names data attribute:", e);
            names = [nameElement.textContent]; // fallback to visible text if data attribute is malformed
        }

        if (names.length > 1) {
            // format labels mapping
            const formatLabels = {
                0: "// Format: First Name, Last Name",   // English
                1: "// 中文: 姓名",                   // Chinese (Mandarin)
                2: "// Tiếng Việt: Họ, Tên",         // Vietnamese
                3: "// 廣東話: 姓名"                   // Cantonese
            };
            
            const updateDisplay = () => {
                nameElement.textContent = names[currentNameIndex];
                const formatSpan = nameContainer.querySelector('.name-format');
                if (formatSpan) {
                    formatSpan.textContent = formatLabels[currentNameIndex] || formatLabels[0];
                    nameFormatDetails.style.display = "none";
                }
            };
            
            // combined event handler for both hover and click
            const cycleNameFormat = (e) => {
                if (e.type === 'click') e.preventDefault(); // prevent default for clicks
                currentNameIndex = (currentNameIndex + 1) % names.length;
                updateDisplay();
            };
            
            // add hover functionality for desktop
            nameElement.addEventListener('mouseover', cycleNameFormat);
            // add click functionality for mobile (and desktop)
            nameElement.addEventListener('click', cycleNameFormat);
            
            // visual cue
            nameElement.style.cursor = 'pointer';
        }
    }
}

function updateDynamicYear() {
    const now = new Date();
    const dynamicYearElement = document.getElementById('dynamic-year');
    if (dynamicYearElement) {
        const year = now.getFullYear();
        dynamicYearElement.textContent = `© ${year} Michael Tran`;
    }
}

function setupProjectImages() {
    const projectImages = document.querySelectorAll('.project-image img');

    projectImages.forEach(img => {
        img.addEventListener('click', function () {
            this.classList.toggle('expanded');

            if (this.classList.contains('expanded')) {
                // using modal instead of lightbox for better mobile experience
                const modal = document.createElement('div');
                modal.className = 'image-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <img src="${this.src}" alt="${this.alt}">
                    </div>
                `;

                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden'; // prevent background scrolling for better focus

                // handle both close events with a single function
                const closeModal = () => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                };

                // multiple close options for better UX
                modal.querySelector('.close-modal').addEventListener('click', closeModal);
                modal.addEventListener('click', function (e) {
                    if (e.target === modal) closeModal();
                });
            }
        });
    });
}

function setupTechIconTooltips() {
    const techIcons = document.querySelectorAll('.tech-icons i, .tech-icon-ts');
    // single reusable tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'icon-tooltip';
    document.body.appendChild(tooltip);

    techIcons.forEach(icon => {
        const title = icon.getAttribute('title');
        if (title) {
            icon.addEventListener('mouseenter', function () {
                tooltip.textContent = title;
                const rect = icon.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = (rect.bottom + 5) + 'px';
                tooltip.classList.add('visible');
            });

            icon.addEventListener('mouseleave', function () {
                tooltip.classList.remove('visible');
            });
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const yinYangBg = document.getElementById('yin-yang-background');
    const landingSection = document.getElementById('landing');

    let lastScrollY = window.scrollY;
    let currentRotation = 0;

    function handleScroll() {
        const scrollY = window.scrollY;
        const landingHeight = landingSection.offsetHeight;
    
        // make yin yang completely disappear if past landing
        if (scrollY >= landingHeight) {
            yinYangBg.style.opacity = '0';
            return;
        }
        
        // calculate rotation and fade based on scroll within landing section
        const scrollProgress = scrollY / landingHeight;
        currentRotation = scrollProgress * 360; // one full rotation within landing section
        
        // fade out and scale
        const opacityValue = Math.max(0, 1 - scrollProgress * 2.0);
        const scaleAmount = 1 + Math.min(1.5, scrollProgress * 2.0);
    
        // applying transforms in one operation for better performance
        yinYangBg.style.transform = `scale(${scaleAmount}) rotate(${currentRotation}deg)`;
        yinYangBg.style.opacity = opacityValue;
    }

    window.addEventListener('scroll', handleScroll, {passive: true}); // passive for smoother scrolling

    // terminal cursor effect for tech theme
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const text = block.innerHTML;
        block.innerHTML = text + '<span class="cursor">_</span>';
    });

    // blinking effect at human-readable rate (~ natural blink rate)
    setInterval(() => {
        document.querySelectorAll('.cursor').forEach(cursor => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        });
    }, 500);

    // dynamic year to avoid manual updates
    const copyrightYearElement = document.getElementById('copyright-year');
    if (copyrightYearElement) {
        const currentYear = new Date().getFullYear();
        copyrightYearElement.innerHTML = `<em>© ${currentYear} Michael Tran</em>`;
    }

    updateNameFormat();
    updateDynamicYear();
    handleScroll(); // initial call for proper positioning on page load

    setupProjectImages();
    setupTechIconTooltips();
});