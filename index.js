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

    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }

    if (mapCard) {
        mapCard.addEventListener('click', () => {
            const address = encodeURIComponent('Rua Luiz Fávero, 410 Bom Jardim Juiz de Fora MG');
            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        });
    }

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
