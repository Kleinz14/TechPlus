// courses.html script
const cards = document.querySelectorAll('#courseList .card');
const searchBox = document.getElementById('search');
const links = document.querySelectorAll('#cats a');
let category = 'all';

function filter() {
  const text = searchBox.value.toLowerCase();

  cards.forEach(function (card) {
    const matchCat = category === 'all' || card.dataset.cat === category;
    const matchText = card.textContent.toLowerCase().includes(text);
    card.style.display = matchCat && matchText ? '' : 'none';
  });

      // each Learn More link opens the page for its own course
cards.forEach(function (card) {
  card.querySelector('.more').href = 'course-detail.html?course=' + card.dataset.cat;
});
}

searchBox.addEventListener('input', filter);

links.forEach(function (link) {
  link.addEventListener('click', function () {
    document.querySelector('#cats a.on').classList.remove('on');
    link.classList.add('on');
    category = link.dataset.cat;
    filter();
  });
});