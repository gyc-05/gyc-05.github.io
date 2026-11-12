(() => {
  const slider = document.querySelector('#distance');
  const body = document.querySelector('#comparison-rows');
  const status = document.querySelector('#comparison-status');
  if (!slider || !body || !status) return;
  slider.disabled = true;
  fetch('assets/bf6-weapons.json').then(response => {
    if (!response.ok) throw new Error('Unable to load weapon data');
    return response.json();
  }).then(data => {
    function render() {
      const distance = Number(slider.value);
      document.querySelector('#meters').textContent = `${distance} 米`;
      const rows = data.map(weapon => {
        let damage = weapon.damage.dmgs[0];
        weapon.damage.dists.forEach((point, i) => {
          if (distance >= point) damage = weapon.damage.dmgs[i];
        });
        const shots = Math.ceil(100 / damage - 1e-10);
        return {weapon, damage, shots, ttk: (shots - 1) * 60000 / weapon.rof.RoF};
      }).sort((a, b) => a.ttk - b.ttk);
      body.replaceChildren();
      rows.forEach(({weapon, damage, shots, ttk}) => {
        const row = document.createElement('tr');
        const values = [weapon.displayname, damage, shots, ttk.toFixed(1),
          weapon.rof.RoF.toFixed(1), weapon.mags.MagSize, weapon.velocity,
          `${(weapon.reload.ReloadLeft / weapon.reload.ReloadSpeed).toFixed(2)} / ${(weapon.reload.ReloadEmpty / weapon.reload.ReloadSpeed).toFixed(2)}`];
        values.forEach((value, i) => {
          const cell = document.createElement(i === 0 ? 'th' : 'td');
          if (i === 0) cell.scope = 'row';
          cell.textContent = String(value);
          if (i === 0 && weapon.image) {
            const image = document.createElement('img');
            image.className = 'weapon-table-image';
            image.src = weapon.image;
            image.alt = '';
            image.width = 112;
            image.height = 56;
            image.loading = 'lazy';
            image.decoding = 'async';
            cell.append(image);
          }
          row.append(cell);
        });
        body.append(row);
      });
      status.textContent = `${distance}米 · ${rows.length}款枪械，按理论TTK排序。`;
    }
    slider.disabled = false;
    slider.addEventListener('input', render);
    render();
  }).catch(() => {
    status.textContent = '交互数据暂时无法加载，请阅读下方静态数值表或下载CSV。';
  });
})();
