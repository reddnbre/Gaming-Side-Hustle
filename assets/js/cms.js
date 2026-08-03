(function () {
  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function setupArticleSearch() {
    var search = document.querySelector('[data-article-search]');
    var category = document.querySelector('[data-category-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-article-card]'));
    var empty = document.querySelector('[data-empty-state]');

    if (!cards.length) return;

    function applyFilters() {
      var query = normalize(search && search.value);
      var selectedCategory = normalize(category && category.value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-description'),
          card.getAttribute('data-category')
        ].join(' '));
        var cardCategory = normalize(card.getAttribute('data-category'));
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesCategory = !selectedCategory || cardCategory === selectedCategory;
        var visible = matchesQuery && matchesCategory;

        card.classList.toggle('is-hidden', !visible);
        if (visible) visibleCount += 1;
      });

      if (empty) empty.classList.toggle('is-hidden', visibleCount !== 0);
    }

    if (search) search.addEventListener('input', applyFilters);
    if (category) category.addEventListener('change', applyFilters);
    applyFilters();
  }

  function setupGeneratedToc() {
    var toc = document.querySelector('[data-generated-toc]');
    var content = document.querySelector('[data-article-content]');
    if (!toc || !content) return;

    var headings = Array.prototype.slice.call(content.querySelectorAll('h2[id], h3[id]'));
    if (!headings.length) return;

    var list = document.createElement('ol');
    headings.forEach(function (heading) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      item.appendChild(link);
      list.appendChild(item);
    });

    toc.appendChild(list);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupArticleSearch();
    setupGeneratedToc();
  });
}());