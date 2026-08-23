// 1. Roles Ticker
let r = 0;
setInterval(() => {
  r = (r + 1) % 5;
  document.getElementById('roles').style.transform = `translateY(-${r * 60}px)`;
}, 2400);

// 2. Hero Lens Physics
const heroSec = document.getElementById('hero-sec');
const lens = document.getElementById('hero-lens');

let mouseX = 0, mouseY = 0, lensX = 0, lensY = 0;

heroSec.addEventListener('mousemove', (e) => {
  const rect = heroSec.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});
heroSec.addEventListener('mouseenter', () => { lens.style.opacity = '1'; });
heroSec.addEventListener('mouseleave', () => { lens.style.opacity = '0'; });

function animateLens() {
  lensX += (mouseX - lensX) * 0.15;
  lensY += (mouseY - lensY) * 0.15;
  lens.style.transform = `translate(-50%, -50%) translate3d(${lensX}px, ${lensY}px, 0)`;
  requestAnimationFrame(animateLens);
}
animateLens();


// 3. The Ultimate Topological Mesh Globe (Zero Lag Architecture)
function initGlobe() {
  const container = document.getElementById('globe-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;
  container.innerHTML = ''; 
  container.style.position = 'relative';

  // --- 1. SETUP CANVAS ---
  const dpr = window.devicePixelRatio || 1;
  const canvas = document.createElement('canvas');
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.cursor = 'grab';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  container.appendChild(canvas);

  const context = canvas.getContext('2d');
  context.scale(dpr, dpr);

  // --- 2. SETUP CSS PULSE OVERLAY ---
  const style = document.createElement('style');
  style.innerHTML = `
    .map-pulse-dot { position: absolute; width: 4px; height: 4px; background: #ff4500; border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 10; display: none; }
    .map-pulse-ring { position: absolute; width: 30px; height: 30px; border: 1.5px solid #ff4500; border-radius: 50%; transform: translate(-50%, -50%); animation: mapPulseAnim 2s cubic-bezier(0.16, 1, 0.3, 1) infinite; pointer-events: none; z-index: 9; display: none; }
    @keyframes mapPulseAnim { 0% { width: 4px; height: 4px; opacity: 1; border-width: 1.5px; } 100% { width: 30px; height: 30px; opacity: 0; border-width: 0.1px; } }
  `;
  document.head.appendChild(style);

  const pulseRing = document.createElement('div');
  pulseRing.className = 'map-pulse-ring';
  container.appendChild(pulseRing);

  const pulseDot = document.createElement('div');
  pulseDot.className = 'map-pulse-dot';
  container.appendChild(pulseDot);

  // --- 3. D3 MATH SETUP ---
  const coords = [72.5714, 23.0225]; 

  const projection = d3.geoOrthographic()
    .rotate([-coords[0], -coords[1]]) 
    .scale(height * 0.75) 
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection).context(context);
  const visibilityPath = d3.geoPath().projection(projection);

  // Fetch the 110m map and the 142KB Official Composite Map
  Promise.all([
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'),
    d3.json('https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson')
  ]).then(([worldTopo, indiaGeo]) => {
    
    const curedWorldMesh = topojson.mesh(worldTopo, worldTopo.objects.countries, (a, b) => {
      return String(a.id) !== "356" && String(b.id) !== "356";
    });

    // Prepare Official India Data
    const accurateIndiaFeature = indiaGeo.features ? indiaGeo.features[0] : indiaGeo;
    accurateIndiaFeature.id = "356"; 
    
    let isIndiaSelected = d3.geoContains(accurateIndiaFeature, coords);
    if (!isIndiaSelected && coords[0] === 72.5714) isIndiaSelected = true;

    // --- 4. THE RENDER FUNCTION ---
    function render() {
      context.clearRect(0, 0, width, height);

      // 1. Draw Ocean (Sphere)
      context.beginPath();
      path({type: "Sphere"});
      context.fillStyle = "rgba(39, 39, 42, 0.15)";
      context.fill();
      context.strokeStyle = "rgba(139, 139, 153, 0.2)";
      context.lineWidth = 1;
      context.stroke();

      // 2. Draw the Cured World Mesh
      context.beginPath();
      path(curedWorldMesh);
      context.strokeStyle = "rgba(139, 139, 153, 0.4)";
      context.lineWidth = 0.5;
      context.stroke();

      // 3. Draw Official India
      context.beginPath();
      path(accurateIndiaFeature);
      context.fillStyle = isIndiaSelected ? "rgba(255, 69, 0, 0.05)" : "transparent";
      context.fill();
      context.strokeStyle = isIndiaSelected ? "#ff4500" : "rgba(139, 139, 153, 0.4)";
      context.lineWidth = isIndiaSelected ? 1 : 0.5;
      context.stroke();

      // Update CSS Pulse Position
      if (visibilityPath({type: "Point", coordinates: coords})) {
        const [x, y] = projection(coords);
        pulseDot.style.left = `${x}px`;
        pulseDot.style.top = `${y}px`;
        pulseDot.style.display = 'block';
        pulseRing.style.left = `${x}px`;
        pulseRing.style.top = `${y}px`;
        pulseRing.style.display = 'block';
      } else {
        pulseDot.style.display = 'none';
        pulseRing.style.display = 'none';
      }
    }

    render();

    // --- 5. DRAG LOGIC ---
    let r0, p0;
    let ticking = false;

    const drag = d3.drag()
      .on('start', (event) => {
        r0 = projection.rotate();
        p0 = [event.x, event.y];
        canvas.style.cursor = 'grabbing';
      })
      .on('drag', (event) => {
        if (!ticking) {
          requestAnimationFrame(() => {
            projection.rotate([r0[0] + (event.x - p0[0]) * 0.4, r0[1] - (event.y - p0[1]) * 0.4]);
            render(); 
            ticking = false;
          });
          ticking = true;
        }
      })
      .on('end', () => {
        canvas.style.cursor = 'grab';
      });

    d3.select(canvas).call(drag);

  }).catch(err => console.error("Global map failed to load.", err));
}
setTimeout(initGlobe, 100);

// --- DATA RENDERING ---
function renderContent() {
  // 1. Render Experiences
  const track = document.getElementById('timeline-track');
  let expHTML = '';
  
  portfolioData.experiences.forEach(exp => {
    expHTML += `
      <div class="timeline-card" draggable="false">
        <div class="timeline-top">
          <div>
            <h3 class="timeline-role thick">${exp.role}</h3>
            <p class="timeline-company">${exp.company}</p>
          </div>
          <p class="timeline-date">${exp.date}</p>
        </div>
        <p class="timeline-desc">${exp.description}</p>
      </div>
    `;
  });
  
  // Add the transparent placeholder at the end to allow scrolling past the last card
  expHTML += `<div class="timeline-card placeholder"></div>`;
  track.innerHTML = expHTML;

  // 2. Render Projects
  const viewport = document.getElementById('projects-viewport');
  let projHTML = '';
  
  portfolioData.projects.forEach((proj, index) => {
    projHTML += `
      <div class="slide next-hidden" id="slide-${index}" data-index="${index}">
        <div class="slide-bg" style="background-image: url('${proj.coverImage}')"></div>
        <div class="slide-gradient"></div>
        <h2 class="thick">${proj.title}</h2>
      </div>
    `;
  });
  viewport.innerHTML = projHTML;
}

// Call the render function immediately
renderContent();

// 4. RESTORED EXPERIENCE DRAG PHYSICS
const slider = document.getElementById('timeline-wrapper');
const cards = document.querySelectorAll('.timeline-card:not(.placeholder)');
const dotsContainer = document.getElementById('timeline-dots');

let isDown = false;
let startX = 0;
let startScrollLeft = 0;
let dragWalk = 0;
let currentCardIndex = 0;
let snapTimeout;

cards.forEach((card, i) => {
  const dot = document.createElement('div');
  dot.classList.add('timeline-dot');
  
  dot.addEventListener('click', () => {
    scrollToCard(i);
  });
  dotsContainer.appendChild(dot);

  card.addEventListener('click', (e) => {
    if (Math.abs(dragWalk) > 5) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    scrollToCard(i);
  });
});

const dots = document.querySelectorAll('.timeline-dot');

function updatePagination(activeIndex) {
  const N = dots.length;
  if (N === 0) return;
  
  let C = activeIndex;
  if (N >= 3) {
    C = Math.max(1, Math.min(activeIndex, N - 2));
  }
  
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'main', 'faded', 'hidden');
    
    if (i === activeIndex) {
      dot.classList.add('active', 'main');
    } else if (i >= C - 1 && i <= C + 1) {
      dot.classList.add('main');
    } else if (i === C - 2 || i === C + 2) {
      dot.classList.add('faded');
    } else {
      dot.classList.add('hidden');
    }
  });
}

function scrollToCard(index) {
  if (index < 0) index = 0;
  if (index >= cards.length) index = cards.length - 1;
  currentCardIndex = index;

  const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
  const targetLeft = index * step;

  slider.style.scrollSnapType = 'none';
  slider.style.scrollBehavior = 'smooth';
  
  slider.scrollTo({ left: targetLeft });
  updatePagination(index);

  clearTimeout(snapTimeout);
  snapTimeout = setTimeout(() => {
    if (!isDown) {
      slider.style.scrollBehavior = 'auto';
      slider.style.scrollSnapType = 'x mandatory';
    }
  }, 500); 
}

slider.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return; 
  isDown = true;
  dragWalk = 0;
  startX = e.pageX;
  startScrollLeft = slider.scrollLeft;
  
  clearTimeout(snapTimeout);
  
  slider.classList.add('dragging'); 
  slider.style.scrollSnapType = 'none'; 
  slider.style.scrollBehavior = 'auto';
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault(); 
  
  dragWalk = e.pageX - startX;
  slider.scrollLeft = startScrollLeft - dragWalk; 
});

const endDrag = () => {
  if (!isDown) return;
  isDown = false;
  slider.classList.remove('dragging'); 
  
  let targetIndex = currentCardIndex;
  
  if (Math.abs(dragWalk) > 30) {
    if (dragWalk < 0 && currentCardIndex < cards.length - 1) {
      targetIndex++;
    } else if (dragWalk > 0 && currentCardIndex > 0) {
      targetIndex--;
    }
  }

  scrollToCard(targetIndex);
  
  setTimeout(() => { dragWalk = 0; }, 50);
};

slider.addEventListener('mouseup', endDrag);
slider.addEventListener('mouseleave', endDrag);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !isDown && Math.abs(dragWalk) <= 5) {
      const index = Array.from(cards).indexOf(entry.target);
      if(index !== -1) {
        currentCardIndex = index;
        updatePagination(index);
      }
    }
  });
}, {
  root: slider,
  rootMargin: '0px -49% 0px -49%', 
  threshold: 0 
});

cards.forEach(card => observer.observe(card));


// 5. Expertise Hover Logic
const indexItems = document.querySelectorAll('.index-item');
const detailCards = document.querySelectorAll('.detail-card');

indexItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    indexItems.forEach(i => i.classList.remove('active'));
    detailCards.forEach(c => c.classList.remove('active'));
    
    item.classList.add('active');
    const targetId = item.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});

// 6. Projects Carousel & Modal Logic
let current = 0;
const slidesProject = document.querySelectorAll('.slide');

window.move = function(dir) {
  current = (current + dir + slidesProject.length) % slidesProject.length;

  slidesProject.forEach((slide, index) => {
    if (index === current) {
      slide.className = 'slide active';
    } 
    else if (index === (current - 1 + slidesProject.length) % slidesProject.length) {
      if (dir === -1) {
        slide.style.transition = 'none';
        slide.className = 'slide prev-hidden';
        void slide.offsetWidth; 
        slide.style.transition = '';
      }
      slide.className = 'slide prev'; 
    } 
    else {
      if (dir === 1) {
        slide.style.transition = 'none';
        slide.className = 'slide next-hidden';
        void slide.offsetWidth; 
        slide.style.transition = '';
      }
      slide.className = 'slide next'; 
    }
  });
};

// Open Modal Logic
const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');

function openModal(index) {
  const data = portfolioData.projects[index];
  
  // Populate Text
  document.getElementById('modal-title').innerText = data.title;

  // Map through the array and wrap each string in <p> tags
  const descContainer = document.getElementById('modal-desc');
  if (Array.isArray(data.description)) {
    descContainer.innerHTML = data.description.map(para => `<p>${para}</p>`).join('');
  } else {
    // Fallback just in case you forget to format one as an array
    descContainer.innerHTML = `<p>${data.description}</p>`;
  }
  
  // Populate Links (Hide if missing)
  const ghLink = document.getElementById('modal-github');
  const liveLink = document.getElementById('modal-live');
  
  if (data.github) { ghLink.href = data.github; ghLink.classList.remove('disabled'); } 
  else ghLink.classList.add('disabled');
  
  if (data.live) { liveLink.href = data.live; liveLink.classList.remove('disabled'); } 
  else liveLink.classList.add('disabled');

  // Populate Image Gallery
  const gallery = document.getElementById('modal-gallery');
  let imagesHTML = '';
  if (data.screenshots) {
    data.screenshots.forEach(src => {
      imagesHTML += `<img src="${src}" alt="Screenshot of ${data.title}">`;
    });
  }
  gallery.innerHTML = imagesHTML;

  // Show Modal & Lock Body Scroll
  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('visible');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

// Register Click Logic on Slides
slidesProject.forEach(slide => {
  slide.addEventListener('click', function() {
    if (this.classList.contains('prev')) move(-1);
    else if (this.classList.contains('next')) move(1);
    else if (this.classList.contains('active')) {
      const idx = parseInt(this.getAttribute('data-index'));
      openModal(idx);
    }
  });
});

// --- SMART KEYBOARD NAVIGATION ---
// Track which section is currently on screen
let activeSection = '';

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Store the class name of the section currently in view
      activeSection = entry.target.className;
    }
  });
}, { threshold: 0.5 }); // Section must be 50% visible to become "active"

sectionObserver.observe(document.querySelector('.experience-section'));
sectionObserver.observe(document.querySelector('.projects'));

// Handle all keyboard inputs
document.addEventListener('keydown', function(event) {
  
  // 1. Close Modal on Escape
  if (event.key === 'Escape' && modal.classList.contains('visible')) {
    closeModal();
    return; // Stop running the rest of the function
  }

  // If the project modal is open, disable background slider navigation
  if (modal.classList.contains('visible')) return;

  // 2. Right Arrow Key (Next)
  if (event.key === 'ArrowRight') {
    if (activeSection.includes('experience-section')) {
      scrollToCard(currentCardIndex + 1);
    } else if (activeSection.includes('projects')) {
      move(1);
    }
  } 
  
  // 3. Left Arrow Key (Previous)
  else if (event.key === 'ArrowLeft') {
    if (activeSection.includes('experience-section')) {
      scrollToCard(currentCardIndex - 1);
    } else if (activeSection.includes('projects')) {
      move(-1);
    }
  }
});

// Initialize the first project slide
move(0);