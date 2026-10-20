(() => {
  // Keep local previews from recording visits against a shared localhost host.
  if (location.hostname !== 'lllllcccc123.github.io') return;

  const script = document.createElement('script');
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.async = true;
  script.addEventListener('error', () => {
    document.querySelector('.site-stats').title = '访问统计暂时不可用，请稍后重试。';
  });
  document.head.append(script);
})();
