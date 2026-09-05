const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-links');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));
}

// Mark the current page in the primary navigation.
const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
document.querySelectorAll('.nav-links a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
  if (href.toLowerCase() === currentPage) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// Publication search and type filtering.
const pubSearch = document.querySelector('#publication-search');
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const pubItems = Array.from(document.querySelectorAll('.publication-item[data-kind]'));
const pubSections = Array.from(document.querySelectorAll('.publication-section[data-kind]'));
const pubCount = document.querySelector('#publication-count');
let activeFilter = 'all';

function filterPublications() {
  if (!pubItems.length) return;
  const q = (pubSearch?.value || '').trim().toLowerCase();
  let visible = 0;
  pubItems.forEach(item => {
    const kind = item.dataset.kind || '';
    const haystack = item.dataset.search || item.textContent.toLowerCase();
    const matchesType = activeFilter === 'all' || kind === activeFilter;
    const matchesQuery = !q || haystack.includes(q);
    const show = matchesType && matchesQuery;
    item.hidden = !show;
    if (show) visible += 1;
  });
  pubSections.forEach(section => {
    const hasVisible = Array.from(section.querySelectorAll('.publication-item[data-kind]')).some(item => !item.hidden);
    section.hidden = !hasVisible;
  });
  if (pubCount) pubCount.textContent = `${visible} publication${visible === 1 ? '' : 's'}`;
}

if (pubSearch) pubSearch.addEventListener('input', filterPublications);
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter || 'all';
  filterButtons.forEach(b => b.classList.toggle('active', b === button));
  filterPublications();
}));
filterPublications();
