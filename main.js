document.body.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menu && navigation) {
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
}
const share = document.querySelector('[data-copy-link]');
if (share) share.addEventListener('click', async () => {
  const status = document.querySelector('[role="status"]');
  try {
    await navigator.clipboard.writeText(window.location.href);
    status.textContent = '项目链接已复制。';
  } catch {
    status.textContent = '当前浏览器无法自动复制，请从地址栏复制项目链接。';
  }
});

const gameFilters = document.querySelectorAll('[data-game-filter]');
const gameEntries = document.querySelectorAll('[data-game-category]');
const gameResults = document.querySelector('.game-results');
gameFilters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.gameFilter;
  gameFilters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  gameEntries.forEach(entry => {
    entry.hidden = category !== 'all' && entry.dataset.gameCategory !== category;
    if (!entry.hidden) count++;
  });
  if (gameResults) gameResults.textContent = category === 'all' ? `显示全部 ${count} 款游戏` : `显示${button.textContent.replace(/\s*\d+$/, '')} · ${count} 款游戏`;
}));
