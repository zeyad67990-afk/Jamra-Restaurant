const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6LO7BrVjXj6ftSFe-77AXdwf9Kp5zpd_v_sDLduUyyWuGdg7ShuMiqE-w7MEnaN9kasNy1Zi0ULh7/pub?output=csv";

function loadPreview() {
  fetch(sheetUrl)
    .then(res => res.text())
    .then(csvData => {
      Papa.parse(csvData, {          // ✅ Papa بحرف كبير
        header: true,
        complete: function(results) {
          const firstFiveItems = results.data.slice(0, 5);
          displayPreview(firstFiveItems);
        }
      });
    })
    .catch(err => console.error('خطأ في تحميل المنيو:', err));
}

function displayPreview(items) {
  const previewContainer = document.getElementById('preview-container'); // ✅ id صح
  previewContainer.innerHTML = '';
  items.forEach(item => {
    if (item.name_ar) {
      previewContainer.innerHTML += `
        <div class="food-card">
          <h3>${item.name_ar}</h3>
          <p style="color:#666;font-size:14px;">${item.desc_ar || ''}</p>
          <span style="font-weight:bold;color:#27ae60;">${item.price} EGP</span>
        </div>
      `;
    }
  });
} // ✅ القوس الناقص اتضاف

window.onload = loadPreview;

// ---- باقي الكود زي ما هو ----
let lang  = 'ar';
let theme = 'dark';
let cart  = 0;
let drawerOpen = false;

function renderMenu(filter) {
  const items = filter === 'all' ? MENU : MENU.filter(i => i.cat === filter);
  document.getElementById('menu-grid').innerHTML = items.map(item => `
    <div class="menu-card">
      ${item.img
        ? `<img src="${item.img}" alt="${lang==='ar'?item.nameAr:item.nameEn}" class="menu-card-img">`
        : `<div class="menu-card-emoji">${item.emoji}</div>`}
      <div class="menu-card-body">
        <div class="menu-card-name">${lang==='ar'?item.nameAr:item.nameEn}</div>
        <div class="menu-card-desc">${lang==='ar'?item.descAr:item.descEn}</div>
        <div class="menu-card-footer">
          <div class="menu-price">${item.price} <span>${lang==='ar'?'جنيه':'EGP'}</span></div>
          <button class="add-btn" onclick="addToCart()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>${lang==='ar'?'أضف':'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterMenu(cat, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMenu(cat);
}

function addToCart() {
  cart++;
  document.getElementById('cart-count').textContent = cart;
  const fl = document.getElementById('cart-float');
  fl.classList.add('show');
  fl.style.animation = 'none';
  setTimeout(() => fl.style.animation = '', 10);
}

function toggleDrawer() {
  drawerOpen = !drawerOpen;
  document.getElementById('mobile-drawer').classList.toggle('open', drawerOpen);
  document.getElementById('burger-icon').innerHTML = drawerOpen
    ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
    : '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
}
function closeDrawer() {
  drawerOpen = false;
  document.getElementById('mobile-drawer').classList.remove('open');
  document.getElementById('burger-icon').innerHTML = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
}

function syncThemeIcons() {
  const isLight = theme === 'light';
  ['', '-m'].forEach(s => {
    const sun  = document.getElementById('icon-sun'  + s);
    const moon = document.getElementById('icon-moon' + s);
    const lbl  = document.getElementById('theme-label' + s);
    if (!sun) return;
    sun.style.display  = isLight ? 'none'  : 'block';
    moon.style.display = isLight ? 'block' : 'none';
    if (lbl) lbl.textContent = isLight
      ? (lang === 'ar' ? 'داكن' : 'Dark')
      : (lang === 'ar' ? 'فاتح' : 'Light');
  });
}
function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement[theme === 'light' ? 'setAttribute' : 'removeAttribute']('data-theme', 'light');
  syncThemeIcons();
}

function applyLang() {
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.title = lang === 'ar' ? 'جمرة — مشويات وكباب' : 'JAMRA — Charcoal & Grill';
  document.querySelectorAll('.logo-text').forEach(el => {
    el.textContent = lang === 'ar' ? 'جمرة' : 'JAMRA';
  });
  ['', '-m'].forEach(s => {
    const el = document.getElementById('lang-label' + s);
    if (el) el.textContent = lang === 'ar' ? 'EN' : 'عر';
  });
  document.querySelectorAll('[data-ar]').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = el.getAttribute('data-' + lang) || '';
    } else {
      el.textContent = el.getAttribute('data-' + lang) || '';
    }
  });
  const activeTab = document.querySelector('.tab-btn.active');
  const cat = activeTab ? (activeTab.getAttribute('data-filter') || 'all') : 'all';
  renderMenu(cat);
  syncThemeIcons();
}

function toggleLang() {
  lang = lang === 'ar' ? 'en' : 'ar';
  applyLang();
}

function submitOrder() {
  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const addr  = document.getElementById('f-addr').value.trim();
  if (!name || !phone || !addr) {
    alert(lang === 'ar' ? 'من فضلك ادخل الاسم والتليفون والعنوان' : 'Please fill in name, phone, and address');
    return;
  }
  alert(lang === 'ar'
    ? `شكراً ${name}! طلبك اتسجل وهنتصل بيك على ${phone} خلال دقائق 🔥`
    : `Thank you ${name}! Your order is placed, we'll call you at ${phone} shortly 🔥`
  );
}

const sections = ['home','about-section','menu-section','contact-section'];
window.addEventListener('scroll', () => {
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

renderMenu('all');
syncThemeIcons();