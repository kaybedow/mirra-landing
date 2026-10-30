(() => {
  const canHover = matchMedia('(hover: hover)').matches;

  // галерея товару: мініатюри міняють головне фото, на компʼютері лупа за курсором
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const stage = gallery.querySelector('.stage');
    const img = stage.querySelector('.stage-img');
    const thumbs = [...gallery.querySelectorAll('.thumb')];

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        if (thumb.classList.contains('on')) return;
        thumbs.forEach(t => t.classList.toggle('on', t === thumb));
        const name = thumb.dataset.src;
        stage.classList.add('fade');
        setTimeout(() => {
          img.srcset = `img/${name}-600.webp 600w, img/${name}.webp 1200w`;
          img.src = `img/${name}.webp`;
          img.alt = thumb.dataset.alt;
          img.onload = () => stage.classList.remove('fade');
        }, 200);
      });
    });

    if (!canHover) return;
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 100;
      const y = (e.clientY - r.top) / r.height * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
    });
    stage.addEventListener('mouseenter', () => stage.classList.add('zooming'));
    stage.addEventListener('mouseleave', () => stage.classList.remove('zooming'));
  });

  // до і після: прозорий range поверх фото, тож працює і мишкою, і пальцем, і з клавіатури
  document.querySelectorAll('.compare').forEach(box => {
    const range = box.querySelector('input');
    const knob = document.createElement('span');
    knob.className = 'knob';
    knob.setAttribute('aria-hidden', 'true');
    knob.textContent = '‹ ›';
    box.append(knob);
    range.addEventListener('input', () => box.style.setProperty('--pos', range.value + '%'));
  });

  // плавна поява блоків при прокручуванні
  const blocks = document.querySelectorAll('.product-grid, .ba-grid, .fix-grid, .mood-grid, .steps');
  blocks.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('shown');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  blocks.forEach(el => io.observe(el));
})();
