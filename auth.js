const FORMSPREE_APPLY = 'https://formspree.io/f/mpppyeyp';

// ---------- helpers ----------
function setNote(el, text, type) {
  el.textContent = text;
  el.className = 'form-note ' + type;
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function validPhone(v) {
  return /^\+?[0-9\s-]{9,15}$/.test(v.trim());
}

function check(note, rules) {
  rules.forEach(function (r) {
    r.field.classList.remove('error');
  });

  for (let i = 0; i < rules.length; i++) {
    if (!rules[i].ok()) {
      rules[i].field.classList.add('error');
      setNote(note, rules[i].msg, 'bad');
      rules[i].field.focus();
      return false;
    }
  }
  return true;
}

// demo "signed in" flag: not real security, nothing is saved
function isSignedIn() {
  return sessionStorage.getItem('techplusSignedIn') === 'yes';
}

function signIn() {
  sessionStorage.setItem('techplusSignedIn', 'yes');
}

// sends the application to Formspree, which emails it to you
async function sendApplication(data) {
  try {
    const res = await fetch(FORMSPREE_APPLY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// ---------- show / hide password ----------
document.querySelectorAll('.pw-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const input = btn.previousElementSibling;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Hide' : 'Show';
  });
});

// ---------- apply form ----------
const applyForm = document.getElementById('applyForm');

if (applyForm) {
  // visitors who are not signed in go to the register page first
  if (!isSignedIn()) {
    window.location.href = 'register.html?from=apply';
  }

  const note = document.getElementById('applyNote');
  const name = document.getElementById('aName');
  const email = document.getElementById('aEmail');
  const phone = document.getElementById('aPhone');
  const edu = document.getElementById('aEdu');
  const course = document.getElementById('aCourse');
  const start = document.getElementById('aStart');
  const why = document.getElementById('aWhy');
  const terms = document.getElementById('aTerms');

  // pre-select the course chosen on the course page
  const wantedCourse = new URLSearchParams(window.location.search).get('course');
  if (wantedCourse) sessionStorage.setItem('wantedCourse', wantedCourse);

  const savedCourse = sessionStorage.getItem('wantedCourse');
  if (savedCourse) course.value = savedCourse;

  applyForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const good = check(note, [
      { field: name, ok: function () { return name.value.trim().length >= 3; }, msg: 'Please enter your full name.' },
      { field: email, ok: function () { return validEmail(email.value); }, msg: 'Please enter a valid email address.' },
      { field: phone, ok: function () { return validPhone(phone.value); }, msg: 'Please enter a valid phone number.' },
      { field: edu, ok: function () { return edu.value !== ''; }, msg: 'Please choose your highest education.' },
      { field: course, ok: function () { return course.value !== ''; }, msg: 'Please choose a course.' },
      { field: start, ok: function () { return start.value !== ''; }, msg: 'Please choose a start date.' },
      { field: terms, ok: function () { return terms.checked; }, msg: 'Please confirm that your details are correct.' }
    ]);

    if (!good) return;

    const button = applyForm.querySelector('button[type="submit"]');
    button.disabled = true;
    setNote(note, 'Sending...', 'good');

    const sent = await sendApplication({
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      education: edu.value,
      course: course.value,
      start: start.value,
      mode: applyForm.querySelector('input[name="mode"]:checked').value,
      reason: why.value.trim()
    });

    button.disabled = false;

    if (!sent) {
      setNote(note, 'Could not send your application. Please try again.', 'bad');
      return;
    }

    sessionStorage.removeItem('wantedCourse');
    setNote(note, 'Thank you! Your application for ' + course.value + ' has been received.', 'good');
    applyForm.reset();
  });
}

// ---------- register form ----------
const registerForm = document.getElementById('registerForm');

if (registerForm) {
  const note = document.getElementById('registerNote');
  const name = document.getElementById('rName');
  const email = document.getElementById('rEmail');
  const phone = document.getElementById('rPhone');
  const pass = document.getElementById('rPass');
  const pass2 = document.getElementById('rPass2');
  const terms = document.getElementById('rTerms');
  const strength = document.getElementById('strength');
  const strengthText = document.getElementById('strengthText');
  const labels = ['Use 8+ characters with letters and numbers.', 'Weak', 'Fair', 'Good', 'Strong'];

  pass.addEventListener('input', function () {
    const v = pass.value;
    let score = 0;

    if (v.length >= 8) score++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    if (v === '') score = 0;
    strength.dataset.level = score;
    strengthText.textContent = labels[score];
  });

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const good = check(note, [
      { field: name, ok: function () { return name.value.trim().length >= 3; }, msg: 'Please enter your full name.' },
      { field: email, ok: function () { return validEmail(email.value); }, msg: 'Please enter a valid email address.' },
      { field: phone, ok: function () { return validPhone(phone.value); }, msg: 'Please enter a valid phone number.' },
      { field: pass, ok: function () { return pass.value.length >= 8 && /[A-Za-z]/.test(pass.value) && /[0-9]/.test(pass.value); }, msg: 'Password needs 8+ characters with letters and numbers.' },
      { field: pass2, ok: function () { return pass2.value === pass.value; }, msg: 'The two passwords do not match.' },
      { field: terms, ok: function () { return terms.checked; }, msg: 'Please agree to the terms to continue.' }
    ]);

    if (!good) return;

    // demo only: the details are not saved anywhere
    signIn();
    setNote(note, 'Details look good! Taking you to the application form...', 'good');

    setTimeout(function () {
      window.location.href = 'apply.html';
    }, 1500);
  });
}

// ---------- login form ----------
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  const note = document.getElementById('loginNote');
  const email = document.getElementById('lEmail');
  const pass = document.getElementById('lPass');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const good = check(note, [
      { field: email, ok: function () { return validEmail(email.value); }, msg: 'Please enter a valid email address.' },
      { field: pass, ok: function () { return pass.value.length > 0; }, msg: 'Please enter your password.' }
    ]);

    if (!good) return;

    // demo only: nothing is checked against a real account
    signIn();
    setNote(note, 'Logged in! Taking you to the application form...', 'good');

    setTimeout(function () {
      window.location.href = 'apply.html';
    }, 1500);
  });
}

// ---------- hint when sent here from the Apply page ----------
if (window.location.search.includes('from=apply')) {
  const hint = document.getElementById('registerNote') || document.getElementById('loginNote');

  if (hint) {
    setNote(hint, 'Please create an account or log in to apply.', 'good');
  }
}