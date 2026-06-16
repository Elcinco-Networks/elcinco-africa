(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const themes = ['light', 'dark', 'beige', 'burgundy', 'coffee', 'orange', 'skyblue'];

    function injectTypewriterStyles() {
        if (document.getElementById('elcinco-effects-style')) return;
        const style = document.createElement('style');
        style.id = 'elcinco-effects-style';
        style.textContent = `
            .typewriter-live::after {
                content: "";
                display: inline-block;
                width: 0.08em;
                height: 0.9em;
                margin-left: 0.08em;
                background: var(--accent, #d8e70a);
                animation: elcincoCursorBlink 0.8s steps(1) infinite;
                vertical-align: -0.08em;
            }
            @keyframes elcincoCursorBlink { 50% { opacity: 0; } }
            .scroll-text-reveal {
                opacity: 0;
                transform: translateY(18px);
                filter: blur(6px);
                transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s cubic-bezier(0.16, 1, 0.3, 1);
                transition-delay: var(--reveal-delay, 0ms);
            }
            .scroll-text-reveal.in-view {
                opacity: 1;
                transform: translateY(0);
                filter: blur(0);
            }
        `;
        document.head.appendChild(style);
    }

    function typeText(target, text, speed, doneClass) {
        target.textContent = '';
        target.classList.add('typewriter-live');
        let cursor = 0;
        const tick = window.setInterval(() => {
            target.textContent = text.slice(0, cursor);
            cursor += 1;

            if (cursor > text.length) {
                window.clearInterval(tick);
                target.classList.remove('typewriter-live');
                if (doneClass) target.classList.add(doneClass);
            }
        }, speed);
    }

    function injectThemeStyles() {
        if (document.getElementById('elcinco-theme-style')) return;
        const style = document.createElement('style');
        style.id = 'elcinco-theme-style';
        style.textContent = `
            html {
                scrollbar-width: thin;
                scrollbar-color: var(--accent, #d8e70a) var(--bg-deep, #050505);
            }
            ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            ::-webkit-scrollbar-track {
                background: color-mix(in srgb, var(--bg-deep, #050505) 88%, #000 12%);
                border-left: 1px solid var(--surface-line, rgba(255,255,255,0.1));
            }
            ::-webkit-scrollbar-thumb {
                border: 3px solid color-mix(in srgb, var(--bg-deep, #050505) 88%, #000 12%);
                border-radius: 999px;
                background: linear-gradient(180deg, var(--accent, #d8e70a), #ffb3c3 48%, #d5a56b);
            }
            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #fbfcf5, var(--accent, #d8e70a) 42%, #ffb3c3 78%);
            }
            body[data-theme="light"] {
                --bg-deep: #f7f8f2;
                --bg-glass: rgba(5, 5, 5, 0.035);
                --bg-card: rgba(255, 255, 255, 0.76);
                --text-main: #161712;
                --text-muted: #575b51;
                --accent: #667900;
                --accent-dim: rgba(102, 121, 0, 0.14);
                --surface-soft: rgba(0, 0, 0, 0.05);
                --surface-line: rgba(0, 0, 0, 0.12);
                --theme-chip: #f8faf1;
                --border-tech: 1px solid rgba(0, 0, 0, 0.12);
            }
            body[data-theme="dark"] {
                --bg-deep: #050505;
                --bg-glass: rgba(255, 255, 255, 0.02);
                --bg-card: rgba(20, 20, 20, 0.6);
                --text-main: #ECECEC;
                --text-muted: #888;
                --accent: #d8e70a;
                --accent-dim: rgba(216, 231, 10, 0.1);
                --surface-soft: rgba(255, 255, 255, 0.05);
                --surface-line: rgba(255, 255, 255, 0.1);
                --theme-chip: #d8e70a;
            }
            body[data-theme="beige"] {
                --bg-deep: #e8dcc7;
                --bg-glass: rgba(95, 72, 45, 0.07);
                --bg-card: rgba(255, 250, 239, 0.68);
                --text-main: #2d261d;
                --text-muted: #6c5c49;
                --accent: #776000;
                --accent-dim: rgba(119, 96, 0, 0.16);
                --surface-soft: rgba(255, 255, 255, 0.3);
                --surface-line: rgba(74, 50, 24, 0.18);
                --theme-chip: #d8b982;
                --border-tech: 1px solid rgba(74, 50, 24, 0.18);
            }
            body[data-theme="burgundy"] {
                --bg-deep: #16070d;
                --bg-glass: rgba(255, 238, 242, 0.045);
                --bg-card: rgba(44, 13, 26, 0.68);
                --text-main: #fff2f4;
                --text-muted: #c9a2ab;
                --accent: #ffb3c3;
                --accent-dim: rgba(255, 179, 195, 0.14);
                --surface-soft: rgba(255, 238, 242, 0.07);
                --surface-line: rgba(255, 238, 242, 0.14);
                --theme-chip: #7b1738;
                --border-tech: 1px solid rgba(255, 238, 242, 0.14);
            }
            body[data-theme="coffee"] {
                --bg-deep: #120b07;
                --bg-glass: rgba(245, 218, 186, 0.05);
                --bg-card: rgba(42, 26, 17, 0.72);
                --text-main: #f6eadc;
                --text-muted: #b99678;
                --accent: #d5a56b;
                --accent-dim: rgba(213, 165, 107, 0.16);
                --surface-soft: rgba(245, 218, 186, 0.07);
                --surface-line: rgba(245, 218, 186, 0.14);
                --theme-chip: #6f4427;
                --border-tech: 1px solid rgba(245, 218, 186, 0.14);
            }
            body[data-theme="orange"] {
                --bg-deep: #0f0a07;
                --bg-glass: rgba(255, 244, 230, 0.04);
                --bg-card: rgba(36, 18, 8, 0.64);
                --text-main: #fff6ef;
                --text-muted: #e6c6a8;
                --accent: #ff8a00;
                --accent-dim: rgba(255, 138, 0, 0.12);
                --surface-soft: rgba(255, 244, 230, 0.06);
                --surface-line: rgba(255, 244, 230, 0.12);
                --theme-chip: #ffb981;
                --border-tech: 1px solid rgba(255, 244, 230, 0.12);
            }
            body[data-theme="skyblue"] {
                --bg-deep: #071a26;
                --bg-glass: rgba(220, 244, 255, 0.04);
                --bg-card: rgba(10, 28, 38, 0.64);
                --text-main: #eaf6fb;
                --text-muted: #b7d7e6;
                --accent: #4fc3f7;
                --accent-dim: rgba(79, 195, 247, 0.12);
                --surface-soft: rgba(220, 244, 255, 0.06);
                --surface-line: rgba(220, 244, 255, 0.12);
                --theme-chip: #a6e6fb;
                --border-tech: 1px solid rgba(220, 244, 255, 0.12);
            }
            .theme-switcher,
            .elcinco-theme-dock {
                display: flex;
                align-items: center;
                gap: 0.42rem;
                position: relative;
                padding: 0.35rem;
                border: 1px solid var(--surface-line);
                border-radius: 999px;
                background: color-mix(in srgb, var(--bg-deep) 78%, transparent);
                backdrop-filter: blur(18px) saturate(160%);
                -webkit-backdrop-filter: blur(18px) saturate(160%);
                box-shadow: 0 18px 55px rgba(0,0,0,0.26);
            }
            .elcinco-theme-dock {
                position: fixed;
                right: 1rem;
                bottom: 1rem;
                z-index: 2000;
            }
            .theme-settings-btn {
                width: 2.15rem;
                height: 2.15rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                border: 1px solid var(--surface-line);
                border-radius: 50%;
                color: var(--text-main);
                background: var(--surface-soft);
                cursor: pointer;
                padding: 0;
                transition: transform 0.35s var(--easing, cubic-bezier(0.16, 1, 0.3, 1)), border-color 0.25s, color 0.25s, background 0.25s;
            }
            .theme-settings-btn:hover,
            .theme-switcher.is-open .theme-settings-btn,
            .elcinco-theme-dock.is-open .theme-settings-btn {
                color: var(--accent);
                border-color: var(--accent);
                background: var(--accent-dim);
            }
            .theme-settings-btn svg {
                width: 1rem;
                height: 1rem;
                transition: transform 0.45s var(--easing, cubic-bezier(0.16, 1, 0.3, 1));
            }
            .theme-switcher.is-open .theme-settings-btn svg,
            .elcinco-theme-dock.is-open .theme-settings-btn svg {
                transform: rotate(135deg);
            }
            .theme-panel {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.28rem;
                position: absolute;
                top: calc(100% + 0.6rem);
                right: 0;
                width: max-content;
                min-width: 12.5rem;
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                pointer-events: none;
                padding: 0;
                visibility: hidden;
                border: 1px solid transparent;
                border-radius: 8px;
                background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
                backdrop-filter: blur(18px) saturate(160%);
                -webkit-backdrop-filter: blur(18px) saturate(160%);
                box-shadow: 0 18px 55px rgba(0,0,0,0.26);
                transition: max-height 0.35s var(--easing, cubic-bezier(0.16, 1, 0.3, 1)), opacity 0.2s ease, padding 0.25s ease, visibility 0s linear 0.35s, border-color 0.2s ease;
            }
            .elcinco-theme-dock .theme-panel {
                top: auto;
                bottom: calc(100% + 0.6rem);
            }
            .theme-switcher.is-open .theme-panel,
            .elcinco-theme-dock.is-open .theme-panel {
                max-height: 18rem;
                opacity: 1;
                pointer-events: auto;
                visibility: visible;
                padding: 0.45rem;
                border-color: var(--surface-line);
                transition-delay: 0s;
            }
            .theme-switcher .theme-dot,
            .elcinco-theme-dock .theme-dot {
                width: 100%;
                min-height: 2.35rem;
                display: grid;
                grid-template-columns: 1.05rem 1fr 1rem;
                align-items: center;
                gap: 0.65rem;
                border-radius: 4px;
                border: 1px solid transparent;
                color: var(--text-main);
                background: transparent;
                cursor: pointer;
                padding: 0.45rem 0.6rem;
                font-family: var(--font-display, sans-serif);
                font-size: 0.74rem;
                font-weight: 700;
                letter-spacing: 0.8px;
                text-align: left;
                text-transform: uppercase;
                transition: transform 0.25s var(--easing, cubic-bezier(0.16, 1, 0.3, 1)), box-shadow 0.25s, border-color 0.25s, background 0.25s, color 0.25s;
            }
            .theme-switcher:not(.is-open) .theme-panel,
            .elcinco-theme-dock:not(.is-open) .theme-panel {
                pointer-events: none;
            }
            .theme-dot:hover,
            .theme-dot.active {
                transform: translateX(-2px);
                border-color: var(--surface-line);
                background: var(--surface-soft);
                box-shadow: 0 0 20px var(--accent-dim);
            }
            .theme-dot.active {
                color: var(--accent);
                border-color: var(--accent);
            }
            .theme-swatch {
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                border: 1px solid rgba(255,255,255,0.34);
            }
            .theme-label {
                white-space: nowrap;
            }
            .theme-check {
                color: var(--accent);
                opacity: 0;
                text-align: right;
            }
            .theme-dot.active .theme-check {
                opacity: 1;
            }
            .theme-dot[data-theme-option="light"] .theme-swatch { background: linear-gradient(135deg, #fbfcf5, #cfd7b3); }
            .theme-dot[data-theme-option="dark"] .theme-swatch { background: linear-gradient(135deg, #050505, #d8e70a); }
            .theme-dot[data-theme-option="beige"] .theme-swatch { background: linear-gradient(135deg, #efe2c7, #b89054); }
            .theme-dot[data-theme-option="burgundy"] .theme-swatch { background: linear-gradient(135deg, #220912, #ff9db4); }
            .theme-dot[data-theme-option="coffee"] .theme-swatch { background: linear-gradient(135deg, #160c07, #c58b52); }
            body:not([data-theme="dark"]) .nav-bar,
            body:not([data-theme="dark"]) header {
                background-color: color-mix(in srgb, var(--bg-deep) 88%, transparent);
            }
            body:not([data-theme="dark"]) .brand-mark span:last-child,
            body:not([data-theme="dark"]) .logo-text span:last-child,
            body:not([data-theme="dark"]) .nav-links a:not(.active):not(:hover),
            body:not([data-theme="dark"]) nav.desktop-nav a:not(.active):not(:hover),
            body:not([data-theme="dark"]) h1,
            body:not([data-theme="dark"]) .section-header h2,
            body:not([data-theme="dark"]) .product-title,
            body:not([data-theme="dark"]) .build-step strong,
            body:not([data-theme="dark"]) .media-label,
            body:not([data-theme="dark"]) .product-video-label {
                color: var(--text-main) !important;
            }
            body:not([data-theme="dark"]) .product-story,
            body:not([data-theme="dark"]) .build-strip,
            body:not([data-theme="dark"]) .hero-media,
            body:not([data-theme="dark"]) .escape-link {
                background: color-mix(in srgb, var(--bg-deep) 82%, white 18%);
                border-color: var(--surface-line);
            }
            body:not([data-theme="dark"]) .product-meta span {
                color: var(--text-muted);
                border-color: var(--surface-line);
            }
            body:not([data-theme="dark"]) .product-link,
            body:not([data-theme="dark"]) .escape-link {
                color: var(--text-main);
                border-color: var(--text-main);
            }
            body:not([data-theme="dark"]) .product-link:hover,
            body:not([data-theme="dark"]) .escape-link:hover,
            body:not([data-theme="dark"]) .cta a:hover {
                color: var(--bg-deep);
                border-color: var(--accent);
            }
            .service-pricing {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 3rem 6rem;
                font-family: var(--font-body, var(--font-tech, 'Space Grotesk', sans-serif));
            }
            .service-pricing-header {
                display: flex;
                align-items: end;
                justify-content: space-between;
                gap: 2rem;
                border-top: var(--border-tech, 1px solid rgba(255,255,255,0.15));
                padding-top: 3rem;
                margin-bottom: 2rem;
            }
            .service-pricing-kicker {
                color: var(--accent, #d8e70a);
                font-family: var(--font-code, var(--font-body, var(--font-tech, monospace)));
                font-size: 0.72rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                display: block;
                margin-bottom: 0.8rem;
            }
            .service-pricing-title {
                margin: 0;
                color: var(--text-main, #fff);
                font-family: var(--font-display, sans-serif);
                font-size: clamp(2rem, 5vw, 3.5rem);
                line-height: 1;
                text-transform: uppercase;
            }
            .service-pricing-note {
                max-width: 420px;
                margin: 0;
                color: var(--text-muted, #888);
                font-family: var(--font-body, var(--font-tech, 'Space Grotesk', sans-serif));
                line-height: 1.6;
            }
            .pricing-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 1px;
                background: rgba(255,255,255,0.12);
                border: var(--border-tech, 1px solid rgba(255,255,255,0.15));
            }
            .pricing-card {
                position: relative;
                min-width: 0;
                padding: 2rem;
                background: color-mix(in srgb, var(--bg-deep, #050505) 92%, white 8%);
                font-family: var(--font-body, var(--font-tech, 'Space Grotesk', sans-serif));
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
            }
            .pricing-badge {
                position: absolute;
                top: 1rem;
                right: 1rem;
                color: var(--text-muted, #666);
                font-family: var(--font-body, var(--font-tech, 'Space Grotesk', sans-serif));
                font-size: 0.68rem;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .pricing-badge.is-accent {
                color: var(--accent, #d8e70a);
            }
            .pricing-card h3 {
                margin: 0 0 1rem;
                color: var(--text-main, #fff);
                font-family: var(--font-display, sans-serif);
                font-size: 1.5rem;
                text-transform: uppercase;
            }
            .pricing-card.is-featured h3 {
                color: var(--accent, #d8e70a);
            }
            .pricing-price {
                color: var(--text-main, #fff);
                font-family: var(--font-body, var(--font-tech, 'Space Grotesk', sans-serif));
                font-size: clamp(1.08rem, 2.5vw, 1.35rem);
                font-weight: 600;
                line-height: 1.35;
                margin-bottom: 1rem;
            }
            .pricing-prefix {
                display: block;
                margin-bottom: 0.2rem;
                color: var(--text-muted, #888);
                font-family: var(--font-body, var(--font-tech, 'Space Grotesk', sans-serif));
                font-size: 0.95rem;
                font-weight: 400;
                letter-spacing: 0;
                text-transform: none;
            }
            .pricing-price > span:not(.pricing-prefix) {
                color: var(--text-muted, #666);
                font-size: 1rem;
            }
            .pricing-desc {
                color: var(--text-muted, #888);
                font-family: var(--font-body, var(--font-tech, 'Space Grotesk', sans-serif));
                margin: 0 0 1.5rem;
            }
            .pricing-card hr {
                border: 0;
                border-top: 1px solid rgba(255,255,255,0.12);
                margin: 1.5rem 0;
            }
            .pricing-card ul {
                list-style: none;
                padding: 0;
                margin: 0 0 2rem;
            }
            .pricing-card li {
                color: var(--text-muted, #aaa);
                font-family: var(--font-body, var(--font-tech, 'Space Grotesk', sans-serif));
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.06);
            }
            .pricing-card li span {
                color: var(--accent, #d8e70a);
                margin-right: 0.55rem;
            }
            .pricing-action {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                min-height: 44px;
                padding: 0.72rem 1rem;
                border: 1px solid var(--text-main, #fff);
                color: var(--text-main, #fff);
                background: transparent;
                font-family: var(--font-display, sans-serif);
                font-size: 0.8rem;
                font-weight: 700;
                letter-spacing: 1px;
                text-decoration: none;
                text-transform: uppercase;
                transition: background 0.3s, color 0.3s, border-color 0.3s, transform 0.3s;
            }
            .pricing-action:hover {
                background: var(--accent, #d8e70a);
                color: var(--bg-deep, #000);
                border-color: var(--accent, #d8e70a);
                transform: translateY(-3px);
            }
            .btn-primary,
            .btn-secondary,
            .btn-glitch,
            .btn-outline,
            .btn-solid,
            .cta-btn,
            .magnetic-btn,
            .submit-btn,
            .submit-button,
            .product-link,
            .escape-link,
            .back-link {
                box-sizing: border-box;
            }
            *,
            *::before,
            *::after {
                overflow-wrap: break-word;
            }
            input,
            textarea,
            select,
            button {
                max-width: 100%;
            }
            input,
            textarea {
                min-width: 0;
            }
            .btn-primary,
            .btn-secondary,
            .btn-glitch,
            .btn-outline,
            .btn-solid,
            .cta-btn,
            .submit-btn,
            .submit-button,
            .product-link {
                min-height: 44px;
                padding: 0.78rem 1.35rem;
                font-size: clamp(0.78rem, 1.8vw, 0.95rem);
                line-height: 1.15;
            }
            .magnetic-btn {
                min-height: 44px;
                padding: 0.78rem 1.35rem;
                font-size: clamp(0.78rem, 1.8vw, 0.95rem);
                line-height: 1.15;
            }
            .btn-primary:hover,
            .btn-secondary:hover,
            .btn-glitch:hover,
            .btn-outline:hover,
            .btn-solid:hover,
            .cta-btn:hover,
            .submit-btn:hover,
            .submit-button:hover,
            .product-link:hover,
            .pricing-action:hover {
                box-shadow: 0 12px 30px color-mix(in srgb, var(--accent, #d8e70a) 18%, transparent);
            }
            .pipeline-step,
            .content-matrix,
            .case-studies,
            .services-grid,
            .mission-control,
            .mission-grid,
            .footer-links,
            .brand-console {
                min-width: 0;
            }
            .step-detail,
            .service-desc,
            .pricing-desc,
            .subtitle,
            .tagline,
            .input-field,
            .data-value,
            .footer-nav a {
                overflow-wrap: anywhere;
            }
            @media (max-width: 900px) {
                html,
                body {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden;
                }
                img,
                video,
                canvas,
                iframe {
                    max-width: 100%;
                }
                main,
                section,
                .hero,
                .hero-container,
                .section,
                .container {
                    max-width: 100%;
                }
                h1,
                h2,
                .display-title,
                .section-header h2,
                .product-title,
                .culture-title,
                .card-title {
                    overflow-wrap: anywhere;
                }
                .theme-panel {
                    min-width: min(12.5rem, calc(100vw - 2rem));
                    max-width: calc(100vw - 2rem);
                }
                .service-pricing {
                    padding: 0 1rem 4rem;
                }
                .service-pricing-header {
                    display: block;
                    padding-top: 2.5rem;
                }
                .service-pricing-note {
                    margin-top: 1rem;
                }
                .pricing-grid {
                    grid-template-columns: 1fr;
                }
                .pricing-card {
                    padding: 2rem 1.25rem;
                }
                .back-link,
                .escape-link,
                .cta-btn,
                .magnetic-btn,
                .submit-btn,
                .submit-button,
                .product-link,
                .btn-primary,
                .btn-secondary {
                    max-width: 100%;
                    white-space: normal;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function gearIcon() {
        return `
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path>
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.08V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.08-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.08V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.16.38.38.72.6 1 .28.27.66.42 1.08.4H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z"></path>
            </svg>
        `;
    }

    function normalizeThemeSwitcher(switcher) {
        if (!switcher || switcher.dataset.themeReady === 'true') return;
        const dots = Array.from(switcher.querySelectorAll('[data-theme-option]'));
        const panel = document.createElement('div');
        panel.className = 'theme-panel';
        panel.setAttribute('aria-label', 'Color themes');
        dots.forEach(dot => {
            const label = dot.dataset.themeOption || 'theme';
            dot.innerHTML = `<span class="theme-swatch" aria-hidden="true"></span><span class="theme-label">${label}</span><span class="theme-check" aria-hidden="true">✓</span>`;
            panel.appendChild(dot);
        });

        const button = document.createElement('button');
        button.className = 'theme-settings-btn';
        button.type = 'button';
        button.setAttribute('aria-label', 'Open color settings');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = gearIcon();

        switcher.textContent = '';
        switcher.append(button, panel);
        switcher.dataset.themeReady = 'true';

        button.addEventListener('click', () => {
            const isOpen = switcher.classList.toggle('is-open');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            button.setAttribute('aria-label', isOpen ? 'Close color settings' : 'Open color settings');
        });
    }

    function applyTheme(theme) {
        const selectedTheme = themes.includes(theme) ? theme : 'dark';
        document.body.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('elcinco_theme', selectedTheme);
        document.querySelectorAll('[data-theme-option]').forEach(dot => {
            const isActive = dot.dataset.themeOption === selectedTheme;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function autoThemeForDay() {
        // Map Sunday(0) .. Saturday(6) to a theme choice
        const map = {
            0: 'dark',    // Sunday
            1: 'light',   // Monday
            2: 'beige',   // Tuesday
            3: 'orange',  // Wednesday
            4: 'skyblue', // Thursday
            5: 'burgundy',// Friday
            6: 'coffee'   // Saturday
        };
        try {
            const d = new Date();
            return map[d.getDay()] || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    function setupThemes() {
        injectThemeStyles();
        if (!document.querySelector('.theme-switcher')) {
            const dock = document.createElement('div');
            dock.className = 'elcinco-theme-dock theme-switcher';
            dock.setAttribute('aria-label', 'Theme settings');
            dock.innerHTML = themes.map(theme => `<button class="theme-dot" type="button" data-theme-option="${theme}" aria-label="${theme} theme"></button>`).join('');
            document.body.appendChild(dock);
        }

        document.querySelectorAll('.theme-switcher, .elcinco-theme-dock').forEach(normalizeThemeSwitcher);
        // Decide initial theme: prefer manual selection; otherwise use auto picker per weekday
        const manual = localStorage.getItem('elcinco_theme_manual') === 'true';
        if (manual) {
            applyTheme(localStorage.getItem('elcinco_theme') || document.body.dataset.theme || 'dark');
        } else {
            const auto = autoThemeForDay();
            applyTheme(localStorage.getItem('elcinco_theme') || auto || document.body.dataset.theme || 'dark');
        }

        document.querySelectorAll('[data-theme-option]').forEach(dot => {
            dot.addEventListener('click', () => {
                // mark manual override so auto-picker won't replace user's choice
                localStorage.setItem('elcinco_theme_manual', 'true');
                applyTheme(dot.dataset.themeOption);
                const switcher = dot.closest('.theme-switcher, .elcinco-theme-dock');
                const button = switcher ? switcher.querySelector('.theme-settings-btn') : null;
                if (switcher) switcher.classList.remove('is-open');
                if (button) {
                    button.setAttribute('aria-expanded', 'false');
                    button.setAttribute('aria-label', 'Open color settings');
                }
            });
        });
    }

    function runTypewriter() {
        if (prefersReducedMotion) return;
        injectTypewriterStyles();

        const targets = document.querySelectorAll('[data-typewriter]');
        targets.forEach((target, index) => {
            const text = target.getAttribute('data-typewriter') || target.textContent.trim();
            const speed = Number(target.getAttribute('data-typewriter-speed')) || 34;
            const startDelay = Number(target.getAttribute('data-typewriter-delay')) || index * 120;

            setTimeout(() => {
                typeText(target, text, speed, 'typewriter-done');
            }, startDelay);
        });
    }

    function setupScrollTextAnimations() {
        if (prefersReducedMotion) return;
        injectTypewriterStyles();

        const revealTargets = document.querySelectorAll([
            '.section-header small',
            '.section-header h2',
            '.section-header p',
            '.case-study-category',
            '.case-study-title',
            '.case-study-link',
            '.mission-control',
            '.mission-card',
            '.mission-status',
            '[data-scroll-reveal]'
        ].join(','));

        revealTargets.forEach((target, index) => {
            if (target.closest('.hero')) return;
            target.classList.add('scroll-text-reveal');
            target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 45}ms`);
        });

        const scrollTypeTargets = Array.from(document.querySelectorAll('[data-scroll-typewriter]'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const target = entry.target;
                target.classList.add('in-view');

                if (target.hasAttribute('data-scroll-typewriter') && !target.dataset.typed) {
                    target.dataset.typed = 'true';
                    const text = target.getAttribute('data-scroll-typewriter') || target.textContent.trim();
                    const speed = Number(target.getAttribute('data-scroll-typewriter-speed')) || 22;
                    typeText(target, text, speed, 'typewriter-done');
                }

                observer.unobserve(target);
            });
        }, { threshold: 0.28, rootMargin: '0px 0px -8% 0px' });

        revealTargets.forEach(target => observer.observe(target));
        scrollTypeTargets.forEach(target => {
            target.classList.add('scroll-text-reveal');
            observer.observe(target);
        });
    }

    function startTypewriterWhenVisible() {
        if (document.getElementById('preloader') && !document.body.classList.contains('loaded')) {
            const observer = new MutationObserver(() => {
                if (document.body.classList.contains('loaded')) {
                    observer.disconnect();
                    runTypewriter();
                }
            });
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            return;
        }

        runTypewriter();
    }

    const SoundDesign = {
        ctx: null,
        enabled: false,
        lastScrollSound: 0,

        init() {
            if (this.ctx) return;
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            this.ctx = new AudioContext();
        },

        unlock() {
            this.init();
            if (!this.ctx) return;
            this.ctx.resume();
            this.enabled = true;
        },

        playButton() {
            if (!this.enabled || !this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        },

        playWhoosh() {
            if (!this.enabled || !this.ctx) return;
            const timestamp = performance.now();
            if (timestamp - this.lastScrollSound < 650) return;
            this.lastScrollSound = timestamp;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(52, now + 0.24);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, now);
            filter.frequency.exponentialRampToValueAtTime(260, now + 0.24);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.045, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.28);
        }
    };

    function setupProductSlides() {
        if (prefersReducedMotion) return;

        document.querySelectorAll('[data-slideshow]').forEach((slideshow) => {
            const images = Array.from(slideshow.querySelectorAll('img'));
            const dots = Array.from(slideshow.querySelectorAll('.product-dot'));
            if (!images.length) return;

            let activeIndex = images.findIndex((img) => img.classList.contains('is-active'));
            if (activeIndex < 0) activeIndex = 0;

            const setActive = (index) => {
                index = (index + images.length) % images.length;
                images.forEach((image, idx) => image.classList.toggle('is-active', idx === index));
                dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === index));
                activeIndex = index;
            };

            let intervalId;
            const nextSlide = () => setActive(activeIndex + 1);
            const startAutoplay = () => {
                intervalId = window.setInterval(nextSlide, 4200);
            };
            const stopAutoplay = () => {
                if (intervalId) {
                    window.clearInterval(intervalId);
                    intervalId = null;
                }
            };

            dots.forEach((dot, idx) => {
                dot.addEventListener('click', () => {
                    setActive(idx);
                    stopAutoplay();
                    startAutoplay();
                });
            });

            slideshow.addEventListener('pointerenter', stopAutoplay, { passive: true });
            slideshow.addEventListener('pointerleave', startAutoplay, { passive: true });

            setActive(activeIndex);
            startAutoplay();
        });
    }

    function bindFeedback() {
        const interactive = 'button, a, input[type="submit"], .btn-primary, .btn-secondary, .btn-glitch, .magnetic-btn, .cta-btn, .submit-button';

        document.addEventListener('pointerdown', () => SoundDesign.unlock(), { once: true });
        document.addEventListener('click', (event) => {
            if (event.target.closest(interactive)) {
                SoundDesign.playButton();
                if (navigator.vibrate) navigator.vibrate(18);
            }
        });

        window.addEventListener('wheel', () => SoundDesign.playWhoosh(), { passive: true });
        window.addEventListener('touchmove', () => SoundDesign.playWhoosh(), { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupThemes();
            startTypewriterWhenVisible();
            setupScrollTextAnimations();
            setupProductSlides();
            bindFeedback();
        });
    } else {
        setupThemes();
        startTypewriterWhenVisible();
        setupScrollTextAnimations();
        setupProductSlides();
        bindFeedback();
    }
})();
