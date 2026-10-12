(() => {
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

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
})();
