const posts = document.querySelectorAll('#postList .blog-card');
const search = document.getElementById('blogSearch');
const select = document.getElementById('blogCat');
const empty = document.getElementById('noPosts');

function filterPosts() {
  const text = search.value.toLowerCase();
  const cat = select.value;
  let shown = 0;

  posts.forEach(function (post) {
    const matchCat = cat === 'all' || post.dataset.cat === cat;
    const matchText = post.textContent.toLowerCase().includes(text);
    const show = matchCat && matchText;

    post.style.display = show ? '' : 'none';
    if (show) shown++;
  });

  empty.style.display = shown === 0 ? 'block' : 'none';
}

search.addEventListener('input', filterPosts);
select.addEventListener('change', filterPosts);