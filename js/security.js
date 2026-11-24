/**
 * AgriTrace Frontend Security Utilities
 * XSS prevention, input sanitization, and secure DOM manipulation.
 */

(function(window) {
  'use strict';

  var AgriSecurity = {
    /**
     * Escape HTML entities to prevent XSS
     */
    escapeHtml: function(str) {
      if (typeof str !== 'string') return String(str || '');
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    },

    /**
     * Sanitize user input - strip dangerous patterns
     */
    sanitizeInput: function(input) {
      if (typeof input !== 'string') return String(input || '');
      return input
        .replace(/[<>]/g, '')
        .replace(/javascript\s*:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/\0/g, '')
        .trim();
    },

    /**
     * Create a text node safely (no HTML interpretation)
     */
    createTextNode: function(text) {
      return document.createTextNode(text || '');
    },

    /**
     * Sanitize a URL — only allow http(s), mailto, tel protocols
     */
    sanitizeUrl: function(url) {
      if (!url || typeof url !== 'string') return '#';
      var trimmed = url.trim();
      if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) return trimmed;
      return '#';
    },

    /**
     * Set innerHTML with basic sanitization of user-supplied parts
     */
    safeInnerHTML: function(element, html) {
      if (!element) return;
      var cleaned = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '')
        .replace(/\bon\w+\s*=\s*[^\s>]+/gi, '');
      element.innerHTML = cleaned;
    },

    /**
     * Validate email format
     */
    isValidEmail: function(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    },

    /**
     * Validate that a value is a safe alphanumeric ID
     */
    isSafeId: function(id) {
      return /^[a-zA-Z0-9_-]+$/.test(id || '');
    },

    /**
     * Rate limit function calls (for form submissions)
     */
    throttle: function(fn, delay) {
      delay = delay || 1000;
      var lastCall = 0;
      return function() {
        var now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          return fn.apply(this, arguments);
        }
      };
    },

    /**
     * Mask sensitive data for display
     */
    maskSensitive: function(str, visibleChars) {
      visibleChars = visibleChars || 4;
      if (!str || str.length <= visibleChars) return '****';
      var masked = '';
      for (var i = 0; i < str.length - visibleChars; i++) masked += '*';
      return masked + str.slice(-visibleChars);
    }
  };

  Object.freeze(AgriSecurity);
  window.AgriSecurity = AgriSecurity;

})(window);
