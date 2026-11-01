const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');

menuBtn.addEventListener('click', function () {
  const open = mainNav.classList.toggle('open');
  menuBtn.textContent = open ? '✕' : '☰';
});

mainNav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    mainNav.classList.remove('open');
    menuBtn.textContent = '☰';
  });
});
