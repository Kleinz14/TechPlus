
const params = new URLSearchParams(window.location.search);
const course = COURSES[params.get('course')];

if (!course) {
  document.getElementById('detailBox').hidden = true;
  document.getElementById('notFound').hidden = false;
} else {
  document.title = course.title + ' | TechPlus Institute';

  document.getElementById('cTitle').textContent = course.title;
  document.getElementById('cCrumb').textContent = course.title;
  document.getElementById('cTagline').textContent = course.tagline;
  document.getElementById('fDuration').textContent = course.duration;
  document.getElementById('fLevel').textContent = course.level;
  document.getElementById('fMode').textContent = course.mode;
  document.getElementById('fCert').textContent = course.certificate;
  document.getElementById('cOverview').textContent = course.overview;
  document.getElementById('cWho').textContent = course.who;
  document.getElementById('cStart').textContent = course.start;

  // the apply button remembers which course was chosen
  document.getElementById('cApply').href = 'apply.html?course=' + encodeURIComponent(course.title);

  // fills a list from an array
  function fillList(id, items) {
    const list = document.getElementById(id);

    items.forEach(function (text) {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  }

  fillList('cLearn', course.learn);
  fillList('cModules', course.modules);

  // links to the other courses
  const others = document.getElementById('cOthers');

  Object.keys(COURSES).forEach(function (key) {
    if (COURSES[key] === course) return;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = 'course-detail.html?course=' + key;
    a.textContent = COURSES[key].title;
    li.appendChild(a);
    others.appendChild(li);
  });
}