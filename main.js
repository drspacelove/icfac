// Load JSON data
const loadJSON = async (file) => {
  try {
    const res = await fetch(`data/${file}`);
    if (!res.ok) {
      throw new Error(`Failed to load ${file}: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const isPage = (name) => window.location.pathname.includes(name);

const fillTable = (tableId, rows) => {
  const table = document.getElementById(tableId);
  if (!table) {
    return;
  }
  table.innerHTML = rows;
};

const asRows = (data, candidates) => {
  if (!data) {
    return [];
  }
  for (const key of candidates) {
    if (Array.isArray(data[key])) {
      return data[key];
    }
  }
  return [];
};

const applyConfigLinks = (data) => {
  if (!data) {
    return;
  }
  document.querySelectorAll('[data-config-link]').forEach(link => {
    const key = link.getAttribute('data-config-link');
    if (!key) {
      return;
    }
    const value = (data.links && data.links[key]) || data[key];
    if (value) {
      link.setAttribute('href', value);
    }
  });
};

// Load global config links
loadJSON('config.json').then(data => {
  applyConfigLinks(data);
});

// Global floating quick actions (all pages)
if (!document.querySelector('.home-fab')) {
  const fab = document.createElement('div');
  fab.className = 'home-fab';
  fab.setAttribute('aria-label', 'Quick Actions');

  const galleryHref = isPage('index') ? '#gallery' : 'index.html#gallery';
  fab.innerHTML = `
    <a href="assets/Brochure_2026.pdf" data-config-link="brochureUrl" class="home-fab-link" target="_blank" aria-label="View Brochure" title="View Brochure">
      <img src="assets/icons/book.svg" alt="" aria-hidden="true">
    </a>
    <a href="${galleryHref}" class="home-fab-link" aria-label="See Gallery" title="See Gallery">
      <img src="assets/icons/gallery.svg" alt="" aria-hidden="true">
    </a>
  `;
  document.body.appendChild(fab);

  loadJSON('config.json').then(data => {
    applyConfigLinks(data);
  });
}

// Load gallery
if (document.getElementById('galleryGrid')) {
  loadJSON('gallery.json').then(data => {
    if (!data) {
      return;
    }
    document.getElementById('galleryYear').textContent = data.year;
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = data.images.map((img, i) => 
      `<img src="${data.basePath}/thumb/${img}" alt="Gallery ${i+1}" loading="lazy" class="${i >= data.initialVisible ? 'gallery-hidden' : ''}">`
    ).join('');

    const toggleBtn = document.getElementById('galleryToggle');
    if (toggleBtn && data.images.length <= data.initialVisible) {
      toggleBtn.style.display = 'none';
    }
  });
}

// Random hero gallery slideshow
const hero = document.querySelector('.page-hero');
if (hero) {
  loadJSON('gallery.json').then(data => {
    if (!data || !data.totalImages) {
      return;
    }
    let current = true;
    const changeImage = () => {
      const num = Math.floor(Math.random() * data.totalImages) + 1;
      const imgUrl = `${data.basePath}/org/gallery-${String(num).padStart(2, '0')}.webp`;
      const img = new Image();
      img.onload = () => {
        const url = `url('${imgUrl}')`;
        if (current) {
          hero.style.setProperty('--hero-bg-next', url);
          hero.classList.remove('show-before');
          hero.classList.add('show-after');
        } else {
          hero.style.setProperty('--hero-bg', url);
          hero.classList.remove('show-after');
          hero.classList.add('show-before');
        }
        current = !current;
      };
      img.src = imgUrl;
    };
    hero.classList.add('show-before');
    changeImage();
    setInterval(changeImage, 3000);
  });
}

// Gallery show more toggle
const toggleBtn = document.getElementById('galleryToggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const hidden = document.querySelectorAll('.gallery-hidden');
    hidden.forEach(img => img.classList.remove('gallery-hidden'));
    toggleBtn.style.display = 'none';
  });
}

// Thrust areas show more toggle
const thrustGrid = document.getElementById('thrustGrid');
const thrustToggle = document.getElementById('thrustToggle');
if (thrustGrid && thrustToggle) {
  const cards = Array.from(thrustGrid.querySelectorAll('.theme-card'));
  cards.forEach((card, index) => {
    if (index >= 4) {
      card.classList.add('thrust-hidden');
    }
  });

  if (cards.length <= 4) {
    thrustToggle.style.display = 'none';
  }

  thrustToggle.addEventListener('click', () => {
    const hiddenCards = thrustGrid.querySelectorAll('.thrust-hidden');
    hiddenCards.forEach(card => card.classList.remove('thrust-hidden'));
    thrustToggle.style.display = 'none';
  });
}

// Load contacts
if (document.querySelector('.contact-grid')) {
  loadJSON('contacts.json').then(data => {
    if (!data) {
      return;
    }
    const grid = document.querySelector('.contact-grid');
    grid.innerHTML = data.organizers.map(org => `
      <div class="contact-card">
        <img src="${(org.image || '').trim()}" alt="${org.name || ''}">
        <div class="role">${org.role}</div>
        <h3>${org.name}</h3>
        <p>${org.title}${org.subtitle ? '<br>' + org.subtitle : ''}<br>${org.institution}${org.location ? '<br>' + org.location : ''}</p>
        ${org.email ? `<p style="margin-top: 8px; color: var(--color-blue); font-weight: 600;"><a href="mailto:${org.email}">${org.email}</a></p>` : ''}
      </div>
    `).join('');

    const venueName = document.getElementById('venueName');
    const venueAddress = document.getElementById('venueAddress');
    const venueEmail = document.getElementById('venueEmail');
    const venueMap = document.getElementById('venueMap');

    if (data.venue) {
      if (venueName) {
        venueName.textContent = data.venue.name || '';
      }
      if (venueAddress) {
        venueAddress.textContent = data.venue.address || '';
      }
      if (venueEmail && data.venue.email) {
        venueEmail.textContent = data.venue.email;
        venueEmail.setAttribute('href', `mailto:${data.venue.email}`);
      }
      if (venueMap && data.venue.mapEmbedUrl) {
        venueMap.setAttribute('src', data.venue.mapEmbedUrl);
      }
    }
  });
}

// Load dates
if (isPage('registration')) {
  loadJSON('dates.json').then(data => {
    if (!data) {
      return;
    }
    const lastDate = document.getElementById('lastRegistrationDate');
    const lastDateText = data.lastRegistrationDate || data.registrationLastDate || '';
    if (lastDate) {
      lastDate.innerHTML = `<strong>Last Date of Registration: ${lastDateText}</strong>`;
    }
    const importantDates = asRows(data, ['rows', 'importantDates']);
    fillTable('importantDatesTable', importantDates.map(d => {
      const label = d.label || d.event || d.title || '';
      const value = d.value || d.date || '';
      return `<tr><td>${label}</td><td>${value}</td></tr>`;
    }).join(''));
  });
}

// Load fees
if (isPage('registration')) {
  loadJSON('fees.json').then(data => {
    if (!data) {
      return;
    }
    const feeRows = asRows(data, ['rows', 'categories', 'fees']);
    fillTable('feesTable', feeRows.map(c => {
      const label = c.label || c.category || c.item || '';
      const value = c.value || c.fee || c.amount || '';
      return `<tr><td>${label}</td><td>${value}</td></tr>`;
    }).join(''));
  });
}

// Load bank details
if (isPage('registration')) {
  loadJSON('bank.json').then(data => {
    if (!data) {
      return;
    }
    const bankRows = asRows(data, ['rows']);
    if (bankRows.length) {
      fillTable('bankDetailsTable', bankRows.map(r => `<tr><td>${r.label || ''}</td><td>${r.value || ''}</td></tr>`).join(''));
      return;
    }

    fillTable('bankDetailsTable', `
      <tr><td>Account Name</td><td>${data.accountName || ''}</td></tr>
      <tr><td>Account Number</td><td>${data.accountNumber || ''}</td></tr>
      <tr><td>Bank Name</td><td>${data.bankName || ''}</td></tr>
      <tr><td>Branch</td><td>${data.branch || ''}</td></tr>
      <tr><td>IFSC Code</td><td>${data.ifscCode || ''}</td></tr>
    `);
  });
}

// Load committee
if (isPage('committee')) {
  loadJSON('committee_international.json').then(data => {
    if (!data) {
      return;
    }
    fillTable('internationalCommitteeTable', data.international.map(m => `<tr><td><strong>${m.name}</strong></td><td>${m.institution}</td><td>${m.location}</td></tr>`).join(''));
  });
  loadJSON('committee_national.json').then(data => {
    if (!data) {
      return;
    }
    fillTable('nationalCommitteeTable', data.national.map(m => `<tr><td><strong>${m.name}</strong></td><td>${m.institution}</td></tr>`).join(''));
  });
  loadJSON('committee_organizing.json').then(data => {
    if (!data) {
      return;
    }
    fillTable('organizingCommitteeTable', data.organizing.map(m => `<tr><td><strong>${m.name}</strong></td></tr>`).join(''));
  });
}

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav-list');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('active');
  });
}
