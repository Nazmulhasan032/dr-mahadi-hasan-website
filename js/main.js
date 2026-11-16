(function () {
  'use strict';

  var WHATSAPP_NUMBER = '8801934440025';

  // ---------- Mobile menu ----------
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন');
    };
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    nav.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
    });
  }

  // ---------- YouTube: thumbnail first, player on click ----------
  document.querySelectorAll('.video__play').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-video-id');
      if (!id) return;
      var frame = document.createElement('div');
      frame.className = 'video__frame';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&playsinline=1';
      iframe.title = btn.getAttribute('aria-label') || 'YouTube ভিডিও';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      btn.replaceWith(frame);
      iframe.focus();
    });
  });

  // ---------- Branch location tags -> Google Maps ----------
  document.querySelectorAll('.branch').forEach(function (br) {
    var tag = br.querySelector('.branch__city');
    var name = br.querySelector('strong');
    var addr = br.querySelector('strong + span');
    if (!tag || !name) return;
    var district = tag.textContent.split('·')[0].trim();
    var query = [name.textContent, addr ? addr.textContent : '', district, 'Bangladesh'].join(', ');
    var link = document.createElement('a');
    link.className = tag.className;
    link.textContent = tag.textContent;
    link.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', name.textContent + ': গুগল ম্যাপে লোকেশন দেখুন');
    link.title = 'গুগল ম্যাপে দেখুন';
    tag.replaceWith(link);
  });

  // ---------- Branch filter ----------
  var filters = document.querySelectorAll('.filter');
  var branches = document.querySelectorAll('.branch');
  var showCity = function (f) {
    var city = f.getAttribute('data-city');
    filters.forEach(function (b) {
      var on = b === f;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    branches.forEach(function (br) {
      br.hidden = br.getAttribute('data-city') !== city;
    });
  };
  filters.forEach(function (f) {
    f.addEventListener('click', function () { showCity(f); });
  });
  var initial = document.querySelector('.filter.is-active') || filters[0];
  if (initial) showCity(initial);

  // ---------- Booking form -> WhatsApp ----------
  var form = document.getElementById('booking-form');
  var errorBox = document.getElementById('form-error');
  if (form) {
    var today = new Date();
    var iso = function (d) {
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      return d.getFullYear() + '-' + m + '-' + day;
    };
    var dob = form.querySelector('#f-dob');
    var date = form.querySelector('#f-date');
    if (dob) dob.max = iso(today);
    if (date) date.min = iso(today);

    var labels = {
      name: 'অভিভাবকের নাম',
      phone: 'সঠিক হোয়াটসঅ্যাপ নম্বর (যেমন 01XXXXXXXXX)',
      branch: 'সেন্টার',
      dob: 'বাচ্চার জন্ম তারিখ',
      date: 'খৎনার তারিখ'
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = [];
      var firstBad = null;
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name) return;
        var ok = el.checkValidity();
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) {
          missing.push(labels[el.name] || el.name);
          if (!firstBad) firstBad = el;
        }
      });

      if (missing.length) {
        errorBox.textContent = 'অনুগ্রহ করে পূরণ করুন: ' + missing.join(', ');
        errorBox.hidden = false;
        firstBad.focus();
        return;
      }
      errorBox.hidden = true;

      var d = new FormData(form);
      var text = [
        'আসসালামু আলাইকুম, আমি খৎনার সিরিয়াল নিতে চাই।',
        'নাম: ' + d.get('name'),
        'হোয়াটসঅ্যাপ: ' + d.get('phone'),
        'সেন্টার: ' + d.get('branch'),
        'বাচ্চার জন্ম তারিখ: ' + d.get('dob'),
        'পছন্দের তারিখ: ' + d.get('date')
      ].join('\n');

      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) {
        e.target.setAttribute('aria-invalid', 'false');
      }
    });
  }

  // ---------- Footer year (Bangla digits) ----------
  var year = document.getElementById('year');
  if (year) {
    var bn = '০১২৩৪৫৬৭৮৯';
    year.textContent = String(new Date().getFullYear()).replace(/\d/g, function (c) { return bn[c]; });
  }
})();
