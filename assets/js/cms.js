(function () {
  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function getArticles() {
    return Array.isArray(window.GSH_ARTICLES) ? window.GSH_ARTICLES : [];
  }

  function escapeHtml(value) {
    return (value || '').toString().replace(/[&<>'"]/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[character];
    });
  }

  function renderArticleCards() {
    var grid = document.querySelector('[data-articles-grid]');
    if (!grid) return;

    var articles = getArticles();
    if (!articles.length) return;

    grid.innerHTML = articles.map(function (article) {
      return '<article class="article-card" data-article-card data-title="' + escapeHtml(article.title) + '" data-description="' + escapeHtml(article.description) + '" data-category="' + escapeHtml(article.category) + '">' +
        '<a href="' + escapeHtml(article.url) + '"><img src="' + escapeHtml(article.image) + '" alt="' + escapeHtml(article.title) + '" /></a>' +
        '<div class="article-card-body">' +
          '<div class="meta"><span class="category">' + escapeHtml(article.category) + '</span><span>' + escapeHtml(article.readTime) + '</span></div>' +
          '<h2><a href="' + escapeHtml(article.url) + '">' + escapeHtml(article.title) + '</a></h2>' +
          '<p>' + escapeHtml(article.description) + '</p>' +
        '</div>' +
      '</article>';
    }).join('');
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

  function setupDashboardData() {
    var articles = getArticles();
    if (!articles.length) return;

    var total = document.querySelector('[data-total-articles]');
    var draftTotal = document.querySelector('[data-draft-articles]');
    var recent = document.querySelector('[data-recent-articles]');
    var top = document.querySelector('[data-top-articles]');

    if (total) total.textContent = articles.filter(function (article) { return article.status === 'Published'; }).length;
    if (draftTotal) draftTotal.textContent = articles.filter(function (article) { return article.status === 'Draft'; }).length;

    if (recent) {
      recent.innerHTML = articles.slice(0, 5).map(function (article) {
        return '<tr><td><a href="../articles/' + escapeHtml(article.url) + '">' + escapeHtml(article.title) + '</a></td><td><span class="status-pill">' + escapeHtml(article.status) + '</span></td><td>' + escapeHtml(article.date) + '</td></tr>';
      }).join('');
    }

    if (top) {
      top.innerHTML = articles.slice(0, 5).map(function (article) {
        return '<tr><td><a href="../articles/' + escapeHtml(article.url) + '">' + escapeHtml(article.title) + '</a></td><td>--</td><td>--</td></tr>';
      }).join('');
    }
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
    renderArticleCards();
    setupArticleSearch();
    setupDashboardData();
    setupGeneratedToc();
  });
}());