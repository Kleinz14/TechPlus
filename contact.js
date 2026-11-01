const FORMSPREE_CONTACT = 'https://formspree.io/f/xaeepzjg';

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

function showNote(text, type) {
  note.textContent = text;
  note.className = 'form-note ' + type;
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const course = document.getElementById('course');
  const message = document.getElementById('message');

  [name, email, message].forEach(function (field) {
    field.classList.remove('error');
  });

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

  if (name.value.trim() === '') {
    name.classList.add('error');
    showNote('Please enter your name.', 'bad');
    name.focus();
    return;
  }

  if (!emailOk) {
    email.classList.add('error');
    showNote('Please enter a valid email address.', 'bad');
    email.focus();
    return;
  }

  if (message.value.trim().length < 10) {
    message.classList.add('error');
    showNote('Please write a message of at least 10 characters.', 'bad');
    message.focus();
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  showNote('Sending...', 'good');

  try {
    const res = await fetch(FORMSPREE_CONTACT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        course: course.value,
        message: message.value.trim()
      })
    });

    if (res.ok) {
      showNote('Thank you! Your message has been sent. We will reply soon.', 'good');
      form.reset();
    } else {
      showNote('Sorry, your message could not be sent. Please try again or call us.', 'bad');
    }
  } catch (err) {
    showNote('Could not reach the form service. Check your internet connection.', 'bad');
  }

  button.disabled = false;
});