/* --------------------------------------
   Dark Mode Toggle
   -------------------------------------- */
(function () {
    const STORAGE_KEY = 'travelua-theme';

    const MOON_SVG = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <path d="M14.5 11.5A6 6 0 0 1 6.5 3.5a6 6 0 1 0 8 8z"/>
    </svg>`;

    const SUN_SVG = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
        <circle cx="9" cy="9" r="3"/>
        <line x1="9" y1="1.5" x2="9" y2="3"/>
        <line x1="9" y1="15" x2="9" y2="16.5"/>
        <line x1="1.5" y1="9" x2="3" y2="9"/>
        <line x1="15" y1="9" x2="16.5" y2="9"/>
        <line x1="3.7" y1="3.7" x2="4.8" y2="4.8"/>
        <line x1="13.2" y1="13.2" x2="14.3" y2="14.3"/>
        <line x1="3.7" y1="14.3" x2="4.8" y2="13.2"/>
        <line x1="13.2" y1="4.8" x2="14.3" y2="3.7"/>
    </svg>`;

    // ????????? ???? ? localStorage ??????
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;

        const icon = btn.querySelector('.theme-icon');

        function setIcon(theme) {
            icon.innerHTML = theme === 'dark' ? SUN_SVG : MOON_SVG;
        }

        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(STORAGE_KEY, theme);

            // ????????: ????????? ? ????? ?????? ? ??????????
            icon.classList.add('icon-out');
            setTimeout(() => {
                setIcon(theme);
                icon.classList.remove('icon-out');
            }, 180);
        }

        // ?????????? ?????? ?????????? ?? ???????? ???? (??? ????????)
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        setIcon(current);

        btn.addEventListener('click', function () {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        });
    });
})();

/* --------------------------------------
   Hamburger Menu (???????? ?????????)
   -------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    const topPanel = document.querySelector('.top-panel');
    const navbar   = document.querySelector('.navbar');
    const themeBtn = document.getElementById('themeToggle');
    if (!topPanel || !navbar || !themeBtn) return;

    // ????????? ??????-??????
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', '???????? ????');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    topPanel.insertBefore(hamburger, themeBtn);

    function openNav() {
        navbar.classList.add('nav-open');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', '??????? ????');
        document.addEventListener('click', outsideClick);
    }

    function closeNav() {
        navbar.classList.remove('nav-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', '???????? ????');
        document.removeEventListener('click', outsideClick);
    }

    function outsideClick(e) {
        if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
            closeNav();
        }
    }

    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        navbar.classList.contains('nav-open') ? closeNav() : openNav();
    });

    // ??????? ??? ????? ?? ????? ????
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // ??????? ??? ?????????? ????? ?? ????????
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) closeNav();
    });
});

/* --------------------------------------
   Scroll Reveal
   -------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    // ??????????: ???????? '.stat' — ???? .stats ??? ??? ?????? CSS-???????? fadeInUp.
    // ????????? .reveal ?? .stat ????????? ????????: ?????? ?????????? ????? CSS ?????????
    // ??? ??????, ? ???? ?????? IntersectionObserver ? ????????? "????????" ???? ?????.
    const targets = document.querySelectorAll(
        '.card, .stats, .block, .team-card, .values li, .faq-item, .faq-list li'
    );

    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
});

/* --------------------------------------
   Image fallback (??????? ??????????)
   -------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (this.dataset.errored) return; // ???????? ?????
            this.dataset.errored = '1';
            // SVG-??????????? ? ???????? ????? ?????
            const name = this.alt || this.src.split('/').pop();
            const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'
                viewBox='0 0 400 260'>
                <rect width='400' height='260' fill='#f3f4f6'/>
                <text x='200' y='115' text-anchor='middle' font-family='sans-serif'
                    font-size='36' fill='#d1d5db'>???</text>
                <text x='200' y='150' text-anchor='middle' font-family='sans-serif'
                    font-size='13' fill='#9ca3af'>${name}</text>
                <text x='200' y='170' text-anchor='middle' font-family='sans-serif'
                    font-size='11' fill='#d1d5db'>?????????? ????????</text>
            </svg>`;
            this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        });
    });
});