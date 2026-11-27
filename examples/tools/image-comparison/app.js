(function () {
  var stage = document.getElementById('stage'), clip = document.getElementById('clip'), handle = document.getElementById('handle');
  var pos = 50;
  function set(p) {
    pos = Math.max(0, Math.min(100, p));
    clip.style.clipPath = 'inset(0 0 0 ' + pos + '%)';
    handle.style.left = pos + '%';
    handle.setAttribute('aria-valuenow', Math.round(pos));
  }
  function fromEvent(e) { var r = stage.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); }
  stage.addEventListener('pointerdown', function (e) { stage.setPointerCapture(e.pointerId); fromEvent(e); stage.onpointermove = fromEvent; });
  stage.addEventListener('pointerup', function () { stage.onpointermove = null; });
  window.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') set(pos - 2); if (e.key === 'ArrowRight') set(pos + 2); });
  function load(file, side) { if (!file || !/^image\//.test(file.type)) return; document.getElementById(side).src = URL.createObjectURL(file); }
  document.querySelectorAll('input[type=file]').forEach(function (inp) { inp.onchange = function () { load(inp.files[0], inp.dataset.side); }; });
  document.addEventListener('dragover', function (e) { e.preventDefault(); document.body.classList.add('drag'); });
  document.addEventListener('dragleave', function () { document.body.classList.remove('drag'); });
  document.addEventListener('drop', function (e) {
    e.preventDefault(); document.body.classList.remove('drag');
    var f = e.dataTransfer.files;
    if (f.length >= 2) { load(f[0], 'a'); load(f[1], 'b'); }
    else if (f.length === 1) { var r = stage.getBoundingClientRect(); load(f[0], e.clientX - r.left < r.width * pos / 100 ? 'a' : 'b'); }
  });
  set(50);
})();
