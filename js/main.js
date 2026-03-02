// ===== DISCOVER PAKISTAN — ENHANCED MAIN JS =====
// Three.js 3D Hero | Particle Cursor Trail | Lenis Smooth Scroll
// GSAP ScrollTrigger | D3.js Map | Magnetic Buttons

(function() {
  'use strict';

  // Make body visible immediately
  document.body.style.opacity = '1';
  document.body.classList.add('visible');

  // Init AOS
  if (typeof AOS !== 'undefined') {
    try { AOS.init({ duration: 1000, easing: 'ease-out-cubic', once: true, offset: 100 }); } catch(e) {}
  }

  // Init everything
  initSmoothScroll();
  initLoader();
  initCursorSystem();
  initNavigation();
  initScrollProgress();
  initRevealAnimations();
  initGSAPAnimations();
  initCounterAnimations();
  initMarquee();
  initMagneticButtons();
  initPakistanMap();
  init3DHero();

  // ===== SMOOTH SCROLL (LENIS) =====
  var lenisInstance = null;
  function initSmoothScroll() {
    try {
      if (typeof Lenis !== 'undefined') {
        lenisInstance = new Lenis({
          duration: 1.4,
          easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
          orientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 2,
        });
        function raf(time) { lenisInstance.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          lenisInstance.on('scroll', ScrollTrigger.update);
          gsap.ticker.add(function(time) { lenisInstance.raf(time * 1000); });
          gsap.ticker.lagSmoothing(0);
        }
      }
    } catch(e) { console.log('Lenis not available, using native scroll'); }
  }

  // ===== LOADER =====
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;
    var progress = loader.querySelector('.loader-progress');
    var pct = 0;
    var iv = setInterval(function() {
      pct += Math.random() * 15 + 5;
      if (pct >= 100) { pct = 100; clearInterval(iv); }
      if (progress) progress.style.width = pct + '%';
      if (pct >= 100) {
        setTimeout(function() {
          loader.style.opacity = '0';
          loader.style.pointerEvents = 'none';
          setTimeout(function() { loader.remove(); }, 600);
        }, 400);
      }
    }, 120);
  }

  // ===== ENHANCED CURSOR WITH PARTICLE TRAIL =====
  function initCursorSystem() {
    if (window.innerWidth < 769) return;

    var cursor = document.querySelector('.cursor');
    var follower = document.querySelector('.cursor-follower');
    var dot = document.querySelector('.cursor-dot');
    var trailCanvas = document.getElementById('cursor-trail');

    if (!cursor || !follower || !dot) return;

    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;
    var followerX = 0, followerY = 0;

    // Particle trail system
    var particles = [];
    var ctx = null;
    if (trailCanvas) {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
      ctx = trailCanvas.getContext('2d');
      window.addEventListener('resize', function() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
      });
    }

    function Particle(x, y, burst) {
      this.x = x;
      this.y = y;
      this.size = burst ? Math.random() * 4 + 1 : Math.random() * 2.5 + 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.03 + 0.015;
      this.vx = burst ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 0.8;
      this.vy = burst ? (Math.random() - 0.5) * 3 : (Math.random() - 0.5) * 0.8;
      this.gold = Math.random() > 0.5;
    }
    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.size *= 0.98;
    };
    Particle.prototype.draw = function(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle = this.gold ? '#C9A84C' : '#5ABF8F';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Mouse tracking
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (ctx && Math.random() > 0.5) {
        particles.push(new Particle(mouseX, mouseY, false));
        if (particles.length > 60) particles.shift();
      }
    });

    document.addEventListener('mousedown', function() {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
      follower.style.transform = 'translate(-50%, -50%) scale(0.6)';
      if (ctx) {
        for (var i = 0; i < 12; i++) {
          particles.push(new Particle(mouseX, mouseY, true));
        }
      }
    });

    document.addEventListener('mouseup', function() {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Hover detection
    var hoverTargets = 'a, button, .city-card, .exp-card, .place-card, .season-card, .tip-item, .province, .number-card, .testimonial-card, .adventure-card, .cuisine-card, .magnetic';
    document.querySelectorAll(hoverTargets).forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', function() {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });

    // Animation loop
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';

      if (ctx) {
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        for (var i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw(ctx);
          if (particles[i].life <= 0) particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // ===== NAVIGATION =====
  function initNavigation() {
    var nav = document.querySelector('nav');
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    var lastScroll = 0;

    window.addEventListener('scroll', function() {
      var st = window.pageYOffset;
      if (nav) {
        if (st > 80) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
        if (st > lastScroll && st > 400) nav.style.transform = 'translateY(-100%)';
        else nav.style.transform = 'translateY(0)';
      }
      lastScroll = st;
    });

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          if (lenisInstance) lenisInstance.scrollTo(target, { offset: -80, duration: 1.5 });
          else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (navLinks) navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('active');
      });
    });
  }

  // ===== SCROLL PROGRESS =====
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', function() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) bar.style.width = (window.pageYOffset / h * 100) + '%';
    });
  }

  // ===== REVEAL ANIMATIONS =====
  function initRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-clip');
    if (!reveals.length) return;
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(function(el) { obs.observe(el); });
  }

  // ===== GSAP SCROLL ANIMATIONS (decorative only — no opacity hiding!) =====
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax - multi-layer left layout
    gsap.to('.hero-content', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: 100, opacity: 0
    });
    gsap.to('.hero-right', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: 150, opacity: 0
    });
    gsap.to('.hero-bg-front', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: -60, scale: 1.15
    });
    gsap.to('.hero-bg-back', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: -30
    });
    gsap.to('.hero-frame', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      opacity: 0, scale: 0.95
    });
    gsap.to('.hero-vertical-text', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: -80, opacity: 0
    });
    gsap.to('.hero-orb', {
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      y: -100, scale: 0.5, opacity: 0
    });

    // Background text parallax (decorative only)
    if (document.querySelector('.numbers-bg-text')) {
      gsap.to('.numbers-bg-text', {
        scrollTrigger: { trigger: '#by-numbers', start: 'top bottom', end: 'bottom top', scrub: true },
        x: 100, ease: 'none'
      });
    }
  }

  // Card visibility now handled by AOS library (data-aos attributes in HTML)

  // ===== COUNTER ANIMATIONS =====
  function initCounterAnimations() {
    function setupCounter(container, selector) {
      if (!container) return;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(selector).forEach(function(num) {
              animateCounter(num, parseInt(num.dataset.val) || 0, num.dataset.suffix || '');
            });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      obs.observe(container);
    }

    setupCounter(document.querySelector('.intro-stats'), '.stat-number');
    setupCounter(document.getElementById('by-numbers'), '.number-value');
  }

  function animateCounter(el, target, suffix) {
    if (!el || target <= 0) return;
    var current = 0;
    var frames = 80;
    var increment = target / frames;
    var timer = setInterval(function() {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 20);
  }

  // ===== MARQUEE =====
  function initMarquee() {
    var track = document.querySelector('.marquee-track');
    if (track) {
      track.innerHTML += track.innerHTML;
    }
  }

  // ===== MAGNETIC BUTTONS =====
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ===== THREE.JS 3D HERO — PARTICLE MOUNTAIN =====
  function init3DHero() {
    if (typeof THREE === 'undefined') return;
    var canvas = document.getElementById('hero-3d');
    if (!canvas) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);
    camera.fov = 45;
    camera.updateProjectionMatrix();

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ethereal floating particles (subtle, complement the photo)
    var particleCount = 3000;
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);
    var sizes = new Float32Array(particleCount);

    var goldColor = new THREE.Color('#C9A84C');
    var emeraldColor = new THREE.Color('#2D8F6A');
    var creamColor = new THREE.Color('#F5EDD8');

    for (var i = 0; i < particleCount; i++) {
      var i3 = i * 3;
      var x = (Math.random() - 0.5) * 20;
      var z = (Math.random() - 0.5) * 20;
      // Spread particles as floating dust/light motes
      var y = (Math.random() - 0.5) * 8;

      positions[i3] = x;
      positions[i3 + 1] = y - 1;
      positions[i3 + 2] = z;

      // Mostly gold with some cream dust motes
      var color = Math.random() > 0.3 ? goldColor : creamColor;
      var finalColor = color.clone();
      colors[i3] = finalColor.r;
      colors[i3 + 1] = finalColor.g;
      colors[i3 + 2] = finalColor.b;

      sizes[i] = Math.random() * 2 + 0.3;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: [
        'attribute float size;',
        'varying vec3 vColor;',
        'uniform float uTime;',
        'uniform vec2 uMouse;',
        'void main() {',
        '  vColor = color;',
        '  vec3 pos = position;',
        '  pos.y += sin(pos.x * 0.5 + uTime * 0.3) * 0.08;',
        '  pos.y += cos(pos.z * 0.4 + uTime * 0.2) * 0.06;',
        '  float mouseInfluence = smoothstep(3.0, 0.0, length(pos.xz - uMouse * 5.0));',
        '  pos.y += mouseInfluence * 0.3;',
        '  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);',
        '  gl_PointSize = size * (4.0 / -mvPosition.z);',
        '  gl_Position = projectionMatrix * mvPosition;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vColor;',
        'void main() {',
        '  float dist = length(gl_PointCoord - vec2(0.5));',
        '  if (dist > 0.5) discard;',
        '  float alpha = 1.0 - smoothstep(0.1, 0.5, dist);',
        '  gl_FragColor = vec4(vColor, alpha * 0.75);',
        '}'
      ].join('\n'),
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    var mountainParticles = new THREE.Points(geometry, material);
    scene.add(mountainParticles);

    // Floating ambient particles
    var ambientCount = 800;
    var ambPositions = new Float32Array(ambientCount * 3);
    var ambColors = new Float32Array(ambientCount * 3);
    for (var j = 0; j < ambientCount; j++) {
      ambPositions[j * 3] = (Math.random() - 0.5) * 25;
      ambPositions[j * 3 + 1] = Math.random() * 8 - 2;
      ambPositions[j * 3 + 2] = (Math.random() - 0.5) * 25;
      var c = Math.random() > 0.6 ? goldColor : emeraldColor;
      ambColors[j * 3] = c.r;
      ambColors[j * 3 + 1] = c.g;
      ambColors[j * 3 + 2] = c.b;
    }
    var ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPositions, 3));
    ambGeo.setAttribute('color', new THREE.BufferAttribute(ambColors, 3));
    var ambMat = new THREE.PointsMaterial({
      size: 1.5, vertexColors: true, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    var ambientParticles = new THREE.Points(ambGeo, ambMat);
    scene.add(ambientParticles);

    // Mouse tracking for 3D
    var mouseNorm = { x: 0, y: 0 };
    document.addEventListener('mousemove', function(e) {
      mouseNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Only animate when hero is visible
    var heroVisible = true;
    var heroSection = document.getElementById('hero');
    if (heroSection) {
      var heroObs = new IntersectionObserver(function(entries) {
        heroVisible = entries[0].isIntersecting;
      }, { threshold: 0.1 });
      heroObs.observe(heroSection);
    }

    var clock = new THREE.Clock();
    function animate3D() {
      requestAnimationFrame(animate3D);
      if (!heroVisible) return;
      var elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.set(mouseNorm.x, mouseNorm.y);
      mountainParticles.rotation.y = elapsed * 0.03 + mouseNorm.x * 0.15;
      mountainParticles.rotation.x = mouseNorm.y * 0.05;
      ambientParticles.rotation.y = elapsed * 0.01;
      renderer.render(scene, camera);
    }
    animate3D();
  }

  // ===== PAKISTAN MAP (D3.js) =====
  function initPakistanMap() {
    if (typeof d3 === 'undefined' || typeof PAK_GEOJSON === 'undefined') return;

    var colorMap = {
      "AzadKashmir": "#7ACF9F",
      "Balochistan": "#1A5C45",
      "FederallyAdministeredTribalAr": "#2A7D5A",
      "Gilgit-Baltistan": "#5ABF8F",
      "Islamabad": "#C9A84C",
      "Khyber-Pakhtunkhwa": "#3DA87A",
      "Punjab": "#C9A84C",
      "Sindh": "#2D8F6A"
    };

    var nameMap = {
      "AzadKashmir": "Azad\nKashmir",
      "Balochistan": "Balochistan",
      "FederallyAdministeredTribalAr": "FATA",
      "Gilgit-Baltistan": "Gilgit-\nBaltistan",
      "Islamabad": "ISB",
      "Khyber-Pakhtunkhwa": "Khyber\nPakhtunkhwa",
      "Punjab": "Punjab",
      "Sindh": "Sindh"
    };

    var fullNames = {
      "AzadKashmir": "Azad Kashmir",
      "Balochistan": "Balochistan",
      "FederallyAdministeredTribalAr": "FATA (merged into KPK)",
      "Gilgit-Baltistan": "Gilgit-Baltistan",
      "Islamabad": "Islamabad Capital Territory",
      "Khyber-Pakhtunkhwa": "Khyber Pakhtunkhwa",
      "Punjab": "Punjab",
      "Sindh": "Sindh"
    };

    var fontSizes = {
      "AzadKashmir": 8, "Balochistan": 14, "FederallyAdministeredTribalAr": 7,
      "Gilgit-Baltistan": 10, "Islamabad": 6, "Khyber-Pakhtunkhwa": 10,
      "Punjab": 14, "Sindh": 13
    };

    var labelOffsets = {
      "AzadKashmir": [15, 0], "Balochistan": [0, 0], "FederallyAdministeredTribalAr": [-15, 0],
      "Gilgit-Baltistan": [0, 0], "Islamabad": [15, 5], "Khyber-Pakhtunkhwa": [0, -5],
      "Punjab": [0, 0], "Sindh": [0, 0]
    };

    var width = 650, height = 750;
    var svg = d3.select("#pakistan-svg-map")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMidYMid meet");

    var projection = d3.geoMercator()
      .fitSize([width - 40, height - 40], PAK_GEOJSON)
      .translate([width / 2, height / 2]);

    var pathGen = d3.geoPath().projection(projection);
    var bounds = pathGen.bounds(PAK_GEOJSON);
    var tx = (width - (bounds[1][0] + bounds[0][0])) / 2;
    var ty = (height - (bounds[1][1] + bounds[0][1])) / 2;
    projection.translate([projection.translate()[0] + tx, projection.translate()[1] + ty]);
    pathGen = d3.geoPath().projection(projection);

    var tooltip = document.getElementById("map-tooltip");

    // Draw provinces with staggered entrance
    svg.selectAll("path")
      .data(PAK_GEOJSON.features).enter()
      .append("path")
      .attr("class", "province")
      .attr("d", pathGen)
      .attr("fill", function(d) { return colorMap[d.properties.NAME_1] || "#4caf50"; })
      .style("opacity", 0)
      .transition().duration(600)
      .delay(function(d, i) { return i * 100; })
      .style("opacity", 1);

    // Add interactivity after entrance animation
    var entranceTime = PAK_GEOJSON.features.length * 100 + 600;
    setTimeout(function() {
      svg.selectAll(".province")
        .on("mouseenter", function(event, d) {
          var name = d.properties.NAME_1;
          if (tooltip) { tooltip.textContent = fullNames[name] || name; tooltip.style.opacity = "1"; }
          d3.select(this).raise();
          svg.selectAll(".label-group").raise();
        })
        .on("mousemove", function(event) {
          if (tooltip) { tooltip.style.left = (event.clientX + 14) + "px"; tooltip.style.top = (event.clientY - 35) + "px"; }
        })
        .on("mouseleave", function() { if (tooltip) tooltip.style.opacity = "0"; });
    }, entranceTime);

    // Draw labels
    setTimeout(function() {
      PAK_GEOJSON.features.forEach(function(d) {
        var name = d.properties.NAME_1;
        var displayName = nameMap[name] || name;
        var fontSize = fontSizes[name] || 10;
        var offset = labelOffsets[name] || [0, 0];
        var centroid = pathGen.centroid(d);
        if (!centroid || isNaN(centroid[0])) return;

        var lines = displayName.split("\n");
        var lineHeight = fontSize * 1.2;
        var startY = centroid[1] + offset[1] - ((lines.length - 1) * lineHeight) / 2;
        var g = svg.append("g").attr("class", "label-group").style("opacity", 0);

        lines.forEach(function(line, idx) {
          g.append("text")
            .attr("x", centroid[0] + offset[0])
            .attr("y", startY + idx * lineHeight)
            .attr("class", "label")
            .attr("font-size", fontSize + "px")
            .text(line);
        });
        g.transition().duration(400).style("opacity", 1);
      });
    }, entranceTime - 300);
  }

})();
