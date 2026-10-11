(() => {
  const dialog = document.querySelector('#detail-dialog');
  const content = document.querySelector('#dialog-content');
  const closeButton = document.querySelector('#close-dialog');
  let trigger = null;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function renderDetail(kind, id) {
    const entry = window.portfolioContent[kind]?.[id];
    if (!entry) return false;
    const tags = entry.tags.map(t => `<span>${escapeHTML(t)}</span>`).join('');
    const metrics = entry.metrics ? `<div class="detail-metrics">${entry.metrics.map(m => `<div class="detail-metric"><strong>${escapeHTML(m[0])}</strong><span>${escapeHTML(m[1])}</span><small>${escapeHTML(m[2])}</small></div>`).join('')}</div>` : '';
    content.innerHTML = `<h2 id="dialog-title">${escapeHTML(entry.title)}</h2><p class="dialog-subtitle">${escapeHTML(entry.subtitle)}</p><div class="tags">${tags}</div><p class="dialog-lead">${escapeHTML(entry.lead)}</p>${metrics}${entry.body}`;
    document.querySelector('#dialog-kind').textContent = kind === 'projects' ? 'PROJECT / 深入项目' : 'FIELD NOTE / 技术笔记';
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    closeButton.focus();
    return true;
  }

  function openDetail(kind, id, source) {
    trigger = source;
    if (renderDetail(kind, id)) history.pushState({portfolioDetail:true}, '', `#${kind === 'projects' ? 'project' : 'note'}-${id}`);
  }
  function closeDetail() {
    if (history.state?.portfolioDetail) history.back();
    else { dialog.close(); history.replaceState(null, '', '#projects'); }
  }
  function syncHash() {
    const match = location.hash.match(/^#(project|note)-([a-z]+)$/);
    if (match) {
      if (renderDetail(match[1] === 'project' ? 'projects' : 'articles', match[2])) return;
    }
    if (dialog.open) dialog.close();
  }

  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => openDetail('projects', button.dataset.project, button)));
  document.querySelectorAll('[data-article]').forEach(button => button.addEventListener('click', () => openDetail('articles', button.dataset.article, button)));
  closeButton.addEventListener('click', closeDetail);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDetail(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDetail();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (trigger?.isConnected) trigger.focus({preventScroll:true});
  });
  window.addEventListener('popstate', syncHash);
  window.addEventListener('hashchange', syncHash);
  syncHash();

  const videos = [...document.querySelectorAll('video')];
  videos.forEach(video => {
    video.addEventListener('play', () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
    });
    const showError = () => {
      const figure = video.closest('figure');
      if (figure.querySelector('.video-error')) return;
      const message = document.createElement('p');
      message.className = 'video-error';
      message.innerHTML = `视频暂时无法播放。<a href="${escapeHTML(video.querySelector('source').getAttribute('src'))}" download>下载观看</a>`;
      figure.append(message);
    };
    video.addEventListener('error', showError);
    video.querySelector('source').addEventListener('error', showError);
  });
  document.querySelectorAll('.extra-videos').forEach(details => details.addEventListener('toggle', () => {
    if (!details.open) details.querySelectorAll('video').forEach(video => video.pause());
  }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('nav a[href^="#"]').forEach(a => {
        if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    });
  }, {rootMargin:'-15% 0px -55% 0px'});
  ['projects','notes','about'].forEach(id => observer.observe(document.getElementById(id)));
})();
