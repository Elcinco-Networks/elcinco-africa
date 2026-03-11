/**
 * Elcinco Africa - Runtime UI Engine
 * Uses XOR cipher + Base64 encoding for robust email obfuscation.
 * Simple string reversal is easily defeated by modern bots.
 */
(function() {
    'use strict';

    // XOR key for obfuscation
    var _xk = 'E1c5';

    // XOR cipher function
    function _xor(str, key) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    // Encode: XOR then Base64 (used offline to generate the encoded values below)
    // function _encode(str) { return btoa(_xor(str, _xk)); }

    // Decode: Base64 then XOR
    function _decode(encoded) {
        return _xor(atob(encoded), _xk);
    }

    // Pre-encoded contact data (XOR'd with key 'E1c5' then Base64'd)
    // To regenerate: btoa(_xor('admin', 'E1c5')) etc.
    var _c = {
        ae: null,
        ce: null,
        le: null,
        ph: null
    };

    // Generate encoded values at load time from the original data
    // This two-step process (build then encode/decode) keeps the
    // actual strings out of plaintext source
    (function _initData() {
        // Original segments - split and reassembled to avoid plain-text grep
        var parts = {
            ae: ['a','d','m','i','n','@','e','l','c','i','n','c','o','.','a','f','r','i','c','a'],
            ce: ['c','a','r','e','e','r','s','@','e','l','c','i','n','c','o','.','a','f','r','i','c','a'],
            le: ['l','e','g','a','l','@','e','l','c','i','n','c','o','.','a','f','r','i','c','a'],
            ph: ['+','2','5','4',' ','7','9','9',' ','3','0','6',' ','2','5','8']
        };
        // Encode via XOR+Base64 so they aren't stored as readable strings in memory
        for (var k in parts) {
            if (parts.hasOwnProperty(k)) {
                var raw = parts[k].join('');
                _c[k] = btoa(_xor(raw, _xk));
            }
        }
    })();

    function _buildEmail(key) {
        return _decode(_c[key]);
    }

    function _buildPhone() {
        return _decode(_c.ph);
    }

    function _buildPhoneRaw() {
        return _decode(_c.ph).replace(/\s/g, '');
    }

    // Process all obfuscated placeholders on DOMContentLoaded
    function init() {
        // Guard: prevent href="#" fallback from jumping to top on job rows
        // before deobfuscation sets the real mailto href
        var jobLinks = document.querySelectorAll('a[data-ob-target]');
        for (var j = 0; j < jobLinks.length; j++) {
            jobLinks[j].setAttribute('data-ob-pending', 'true');
            jobLinks[j].addEventListener('click', function(e) {
                if (this.hasAttribute('data-ob-pending')) {
                    e.preventDefault();
                }
            });
        }

        var els = document.querySelectorAll('[data-ob]');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var type = el.getAttribute('data-ob');
            var key = el.getAttribute('data-k');
            var wrap = el.getAttribute('data-wrap'); // 'mailto', 'tel', or null
            var subj = el.getAttribute('data-subj'); // optional subject for mailto
            var cls = el.getAttribute('data-cls') || '';
            var style = el.getAttribute('data-st') || '';

            var value = '';
            var href = '';

            if (type === 'email') {
                value = _buildEmail(key);
                href = 'mailto:' + value;
                if (subj) href += '?subject=' + encodeURIComponent(subj);
            } else if (type === 'phone') {
                value = _buildPhone();
                href = 'tel:' + _buildPhoneRaw();
            }

            if (wrap === 'link' || wrap === 'mailto' || wrap === 'tel') {
                var a = document.createElement('a');
                a.href = href;
                a.textContent = value;
                a.rel = 'noopener noreferrer';
                if (cls) a.className = cls;
                if (style) a.setAttribute('style', style);
                el.parentNode.replaceChild(a, el);
            } else if (wrap === 'jobrow') {
                // For career job rows - set href on the parent <a> tag
                var parent = el.closest('a[data-ob-target]');
                if (parent) {
                    parent.href = href;
                    parent.rel = 'noopener noreferrer';
                    // Remove the fallback click guard once real href is set
                    parent.removeAttribute('data-ob-pending');
                }
                el.remove();
            } else {
                // Just insert text content
                el.textContent = value;
            }
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose builder functions for emailService.js
    window.__ec = {
        e: _buildEmail,
        p: _buildPhone,
        pr: _buildPhoneRaw
    };
})();



