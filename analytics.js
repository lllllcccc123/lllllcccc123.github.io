(() => {
  // Keep local previews from recording visits against a shared localhost host.
  if (location.hostname !== 'lllllcccc123.github.io') return;

  const script = document.createElement('script');
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  script.async = true;
  document.head.append(script);
})();
