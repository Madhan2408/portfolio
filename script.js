// script.js — small progressive enhancements for the portfolio page
document.addEventListener('DOMContentLoaded', function () {

    // 1) Smooth scrolling for in-page nav links
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = link.getAttribute('href').slice(1);
            var targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                var headerOffset = document.getElementById('header').offsetHeight + 10;
                var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // 2) Highlight the current section's nav link while scrolling
    var sections = Array.from(document.querySelectorAll('main section[id]'));
    if (sections.length && 'IntersectionObserver' in window) {
        var linkById = {};
        navLinks.forEach(function (link) {
            linkById[link.getAttribute('href').slice(1)] = link;
        });

        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var id = entry.target.getAttribute('id');
                var link = linkById[id];
                if (!link) return;
                if (entry.isIntersecting) {
                    navLinks.forEach(function (l) { l.classList.remove('active-link'); });
                    link.classList.add('active-link');
                }
            });
        }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

        sections.forEach(function (section) { navObserver.observe(section); });
    }

    // 3) Reveal cards as they scroll into view (adds a little life to the page)
    var cards = document.querySelectorAll('.card');
    if ('IntersectionObserver' in window) {
        cards.forEach(function (card) { card.classList.add('reveal-init'); });

        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(function (card) { revealObserver.observe(card); });
    }

    // 4) Simple back-to-top button
    var backToTop = document.createElement('button');
    backToTop.textContent = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.id = 'backToTop';
    Object.assign(backToTop.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: 'none',
        background: 'var(--accent-emerald, #059669)',
        color: '#fff',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        display: 'none',
        zIndex: '999',
        transition: 'opacity 0.3s ease'
    });
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    var track = document.getElementById('coverflowGallery');
    if (!track) return;

    var slides = Array.from(track.querySelectorAll('.coverflow-slide'));
    var total = slides.length;
    var current = 0;
    var timer = null;

    slides.forEach(function (slide) {
        var img = slide.getAttribute('data-img');
        var fallback = slide.getAttribute('data-fallback');
        var tester = new Image();
        tester.onload = function () { slide.style.backgroundImage = "url('" + img + "')"; };
        tester.onerror = function () { slide.style.backgroundImage = "url('" + fallback + "')"; };
        tester.src = img;

        slide.addEventListener('click', function () {
            current = slides.indexOf(slide);
            render();
            restartTimer();
        });
    });

    function render() {
        slides.forEach(function (slide, i) {
            var offset = i - current;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            if (offset === 0) slide.setAttribute('data-pos', '0');
            else if (offset === 1) slide.setAttribute('data-pos', '1');
            else if (offset === -1) slide.setAttribute('data-pos', '-1');
            else if (offset === 2) slide.setAttribute('data-pos', '2');
            else if (offset === -2) slide.setAttribute('data-pos', '-2');
            else slide.setAttribute('data-pos', 'hidden');
        });
    }

    function next() {
        current = (current + 1) % total;
        render();
    }

    function startTimer() { timer = setInterval(next, 2000); }
    function restartTimer() { clearInterval(timer); startTimer(); }

    track.addEventListener('mouseenter', function () { clearInterval(timer); });
    track.addEventListener('mouseleave', function () { startTimer(); });

    render();
    startTimer();
});
