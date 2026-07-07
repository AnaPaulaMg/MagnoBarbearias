if (typeof document === 'undefined') {
    // Running under Node.js — provide safe fallbacks and export data for tests
    console.log('Running under Node: skipping browser-only DOM operations.');
    const year = new Date().getFullYear();
    console.log('Current year:', year);

    const address = 'Rua Luiz Fávero, 410 Bom Jardim Juiz de Fora MG';
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    console.log('Map URL:', mapUrl);

    module.exports = { year, mapUrl };

} else {
    const yearElement = document.getElementById('year');
    const mapCard = document.querySelector('.map-card');
    const navLinks = document.querySelectorAll('.nav a');
    const hero = document.querySelector('.hero');
    const heroCopy = document.querySelector('.hero__copy');
    const heroHighlights = document.querySelector('.hero__highlights');
    const heroStage = document.querySelector('.hero__stage');
    const heroPortraitCard = document.querySelector('.hero__portrait-card');
    const siteHeader = document.querySelector('.site-header');
    const hoursStatus = document.getElementById('hours-status');

    const updateHoursStatus = () => {
        const now = new Date();
        const day = now.getDay();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentMinutes = hours * 60 + minutes;

        const schedules = {
            0: [],
            1: [],
            2: [{ start: 9 * 60 + 30, end: 19 * 60 + 30 }],
            3: [{ start: 9 * 60 + 30, end: 18 * 60 + 30 }],
            4: [{ start: 9 * 60 + 30, end: 19 * 60 + 30 }],
            5: [{ start: 9 * 60, end: 19 * 60 + 30 }],
            6: [{ start: 9 * 60, end: 18 * 60 }],
        };

        const todaySchedule = schedules[day] || [];
        const isOpen = todaySchedule.some(({ start, end }) => currentMinutes >= start && currentMinutes < end);

        if (hoursStatus) {
            hoursStatus.textContent = isOpen ? 'Aberto' : 'Fechado';
            hoursStatus.classList.toggle('is-open', isOpen);
            hoursStatus.classList.toggle('is-closed', !isOpen);
        }
    };

    updateHoursStatus();

    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }

    if (mapCard) {
        mapCard.addEventListener('click', () => {
            const address = encodeURIComponent('Rua Luiz Fávero, 410 Bom Jardim Juiz de Fora MG');
            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        });
    }

    const revealElements = document.querySelectorAll('.section, .card, .highlight-card, .hours-card, .location-card, .cta-card, .gallery-item, .team-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((element) => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });

    const resetHeroMotion = () => {
        if (heroCopy) heroCopy.style.transform = '';
        if (heroHighlights) heroHighlights.style.transform = '';
        if (heroStage) heroStage.style.transform = '';
        if (heroPortraitCard) heroPortraitCard.style.transform = '';
    };

    if (hero && heroCopy && heroHighlights) {
        hero.addEventListener('pointermove', (event) => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            heroCopy.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
            heroHighlights.style.transform = `translate3d(${x * -12}px, ${y * 10}px, 0)`;
            if (heroStage) {
                heroStage.style.transform = `translate3d(${x * -10}px, ${y * -8}px, 0)`;
            }
            if (heroPortraitCard) {
                heroPortraitCard.style.transform = `translate3d(${x * 8}px, ${y * 6}px, 0)`;
            }
        });

        hero.addEventListener('pointerleave', resetHeroMotion);
    }

    const updateScrollEffects = () => {
        const scrollY = window.scrollY;
        document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
        document.documentElement.style.setProperty('--scroll-progress', `${Math.min(scrollY / 260, 1)}`);
        siteHeader?.classList.toggle('is-scrolled', scrollY > 24);
    };

    updateScrollEffects();
    window.addEventListener('scroll', updateScrollEffects, { passive: true });

    if (navLinks.length > 0) {
        const sections = Array.from(navLinks)
            .map(link => document.querySelector(link.hash))
            .filter(Boolean);

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const link = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
                    if (link) {
                        link.classList.toggle('active', entry.isIntersecting);
                    }
                });
            },
            { rootMargin: '-55% 0px -40% 0px', threshold: 0 }
        );

        sections.forEach(section => observer.observe(section));
    }
}
