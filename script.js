document.addEventListener('DOMContentLoaded', function () {

  var header = document.getElementById('header');
  var backTop = document.getElementById('backTop');

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY > 30;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 400);
  });

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var menuToggle = document.getElementById('menuToggle');
  var closeMenu = document.getElementById('closeMenu');
  var sideMenu = document.getElementById('sideMenu');
  var overlay = document.getElementById('overlay');

  function openSideMenu() {
    sideMenu.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSideMenu() {
    sideMenu.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openSideMenu);
  if (closeMenu) closeMenu.addEventListener('click', closeSideMenu);
  if (overlay) overlay.addEventListener('click', closeSideMenu);
  document.querySelectorAll('.side-link').forEach(function (link) {
    link.addEventListener('click', closeSideMenu);
  });

  var allNavLinks = document.querySelectorAll('.nav-link, .side-link');
  var sections = document.querySelectorAll('main section[id]');

  function setActiveLink(id) {
    allNavLinks.forEach(function (link) {
      var isMatch = link.getAttribute('data-target') === id;
      link.classList.toggle('active', isMatch);
    });
  }

  if (sections.length && allNavLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (visible.length > 0) {
        visible.sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });
        setActiveLink(visible[0].target.getAttribute('id'));
      }
    }, {
      root: null,
      rootMargin: '-35% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(function (sec) { sectionObserver.observe(sec); });
  }

  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  function animateCounterGroup(elements) {
    elements.forEach(function (counter) {
      if (counter.dataset.done === 'true') return;
      counter.dataset.done = 'true';
      var target = parseInt(counter.getAttribute('data-count'), 10);
      var current = 0;
      var step = Math.max(target / 60, 1);
      var timer = setInterval(function () {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
      }, 25);
    });
  }

  function watchCounters(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;
    var counters = container.querySelectorAll('.num, .a-num');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounterGroup(counters);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(container);
  }

  watchCounters('.hero-stats');
  watchCounters('#about');

  var heroSvg = document.getElementById('heroSvg');
  var heroSection = document.querySelector('.hero');
  if (heroSvg && heroSection && window.matchMedia('(pointer:fine)').matches) {
    heroSection.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 20;
      var y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroSvg.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    heroSection.addEventListener('mouseleave', function () {
      heroSvg.style.transform = 'translate(0,0)';
    });
  }

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var formNote = document.getElementById('formNote');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (formNote) {
        formNote.textContent = 'تم استلام طلبك بنجاح، سيتواصل معك فريقنا في أقرب وقت';
        setTimeout(function () { formNote.textContent = ''; }, 5000);
      }
      contactForm.reset();
    });
  }

  var yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

});