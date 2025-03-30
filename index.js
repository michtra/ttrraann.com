// updates time elements to show current time without seconds for cleaner UI
function updateDynamicDates() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    // zero-padding for consistent width
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedDate = `${month} ${day} ${hours}:${minutes}`;

    document.querySelectorAll('.dynamic-date').forEach(element => {
        element.textContent = formattedDate;
    });

    // separate year update for copyright to avoid unnecessary DOM searches
    const dynamicYearElement = document.getElementById('dynamic-year');
    if (dynamicYearElement) {
        const year = now.getFullYear();
        dynamicYearElement.textContent = `© ${year} Michael Tran`;
    }
}

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
            nameElement.addEventListener('mouseover', () => {
                currentNameIndex = (currentNameIndex + 1) % names.length;
                nameElement.textContent = names[currentNameIndex];

                const formatSpan = nameContainer.querySelector('.name-format');

                if (currentNameIndex === 0) { // English
                    formatSpan.textContent = "// Format: First Name, Last Name";
                    nameFormatDetails.style.display = "none";
                }
                else if (currentNameIndex === 1) { // Chinese (Mandarin)
                    formatSpan.textContent = "// 中文: 姓名";
                    nameFormatDetails.style.display = "none";
                }
                else if (currentNameIndex === 2) { // Vietnamese
                    formatSpan.textContent = "// Tiếng Việt: Họ, Tên";
                    nameFormatDetails.style.display = "none";
                }
                else if (currentNameIndex === 3) { // Cantonese
                    formatSpan.textContent = "// 廣東話: 姓名";
                    nameFormatDetails.style.display = "none";
                }
            });
        }
    }
}

function setupProjectImages() {
    const projectImages = document.querySelectorAll('.project-image img');

    projectImages.forEach(img => {
        img.addEventListener('click', function () {
            this.classList.toggle('expanded');

            if (this.classList.contains('expanded')) {
                // store original dimensions to restore them later
                this.dataset.originalWidth = this.style.width || '';
                this.dataset.originalMaxWidth = this.style.maxWidth || '';

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

                // multiple close options for better UX
                modal.querySelector('.close-modal').addEventListener('click', function () {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                });

                modal.addEventListener('click', function (e) {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    });
}

function setupTechIconTooltips() {
    const techIcons = document.querySelectorAll('.tech-icons i, .tech-icon-ts');

    techIcons.forEach(icon => {
        const title = icon.getAttribute('title');
        if (title) {
            // creating tooltips dynamically to keep HTML cleaner
            const tooltip = document.createElement('div');
            tooltip.className = 'icon-tooltip';
            tooltip.textContent = title;

            icon.addEventListener('mouseenter', function () {
                // adding to body instead of parent for better positioning
                document.body.appendChild(tooltip);
                const rect = icon.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = (rect.bottom + 5) + 'px';
                tooltip.classList.add('visible');
            });

            icon.addEventListener('mouseleave', function () {
                tooltip.classList.remove('visible');
                if (tooltip.parentNode) {
                    document.body.removeChild(tooltip);
                }
            });
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {

    const yinYangBg = document.getElementById('yin-yang-background');
    const nameElement = document.getElementById('hover-name');
    const landingSection = document.getElementById('landing');
    const animateElements = document.querySelectorAll('.animate-text');

    let lastScrollY = window.scrollY;
    let currentRotation = 0;
     // lower values make rotation more subtle
    let names = [];
    let currentNameIndex = 0;

    function handleScroll() {
        const scrollY = window.scrollY;

        const landingHeight = landingSection.offsetHeight;

        // using document height to ensure rotation resets when scrolling back up
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / docHeight;

        // multiplying by 2 to complete two full rotations for more visual interest
        currentRotation = scrollProgress * 360 * 2;

        // blur and scale effects start after user begins scrolling
        const startEffectScrollY = 0;
        let blurAmount = 0;
        let scaleAmount = 1;

        if (scrollY > startEffectScrollY) {
            const effectProgress = (scrollY - startEffectScrollY) / (document.body.scrollHeight - landingHeight - startEffectScrollY + 1);
            blurAmount = Math.min(5, effectProgress * 20); // capping blur for performance
            scaleAmount = 1 + Math.min(2.5, effectProgress * 4.0); // limiting scale to prevent extreme distortion
        }

        // applying transforms in one operation for better performance
        yinYangBg.style.transform = `scale(${scaleAmount}) rotate(${currentRotation}deg)`;
        yinYangBg.style.filter = `blur(${blurAmount}px)`;

        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleScroll, {passive: true}); // passive for smoother scrolling

    // name translation on hover for multilingual experience
    if (nameElement) {
        try {
            names = JSON.parse(nameElement.getAttribute('data-names'));
        }
        catch (e) {
            console.error("Could not parse names data attribute:", e);
            names = [nameElement.textContent]; // safety fallback
        }

        if (names.length > 1) {
            nameElement.addEventListener('mouseover', () => {
                currentNameIndex = (currentNameIndex + 1) % names.length;
                nameElement.textContent = names[currentNameIndex];
            });
        }
    }

    // using intersection observer for typing effect to improve performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // small delay creates a cascade effect for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('typing-text');
                }, 150);

                observer.unobserve(entry.target); // cleanup to prevent unnecessary checks
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // triggering when just 10% visible for earlier animation
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });

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
        copyrightYearElement.innerHTML = `<em>© ${currentYear} Your Name</em>`;
    }

    updateNameFormat();
    updateDynamicDates();
    handleScroll(); // initial call for proper positioning on page load

    setupProjectImages();
    setupTechIconTooltips();
});