(function () {
  var measurementId = 'G-6XMHDM9G46';
  var platformOffers = [
    {
      key: 'swagbucks',
      label: 'Swagbucks',
      href: 'https://www.swagbucks.com/profile/reddnbre?rp=1',
      button: 'Start Swagbucks',
      text: 'Earn SB through eligible games, surveys, shopping, receipts, and other reward activities.'
    },
    {
      key: 'inboxdollars',
      label: 'InboxDollars',
      href: 'https://www.inboxdollars.com/?rb=4X8m1qv4js1hh1Fl&rp=1',
      button: 'Start InboxDollars',
      text: 'Try cash-based rewards through eligible games, surveys, offers, paid emails, and more.'
    },
    {
      key: 'mistplay',
      label: 'Mistplay',
      href: 'https://mistplay.onelink.me/ZGRQ/0vlgrca7',
      button: 'Start Mistplay',
      text: 'Play eligible mobile games, earn units, and redeem rewards through Mistplay.'
    }
  ];

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function getArticles() {
    var batches = [window.GSH_ARTICLES_BATCH_2, window.GSH_ARTICLES];
    return batches.reduce(function (all, batch) {
      return Array.isArray(batch) ? all.concat(batch) : all;
    }, []);
  }

  function escapeHtml(value) {
    return (value || '').toString().replace(/[&<>'\"]/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '\"': '&quot;'
      }[character];
    });
  }

  function initAnalytics() {
    if (location.pathname.indexOf('/dashboard/') !== -1) return;
    if (window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function setupAnalyticsEvents() {
    if (!window.gtag || location.pathname.indexOf('/dashboard/') !== -1) return;

    document.querySelectorAll('a[href*="#pricing"]').forEach(function (link) {
      link.addEventListener('click', function () {
        window.gtag('event', 'article_cta_click', {
          event_category: 'engagement',
          event_label: document.title
        });
      });
    });

    document.querySelectorAll('a[href*="gumroad.com"], a[href*="swagbucks.com"], a[href*="inboxdollars.com"], a[href*="mistplay.onelink.me"]').forEach(function (link) {
      link.addEventListener('click', function () {
        window.gtag('event', 'affiliate_click', {
          event_category: 'affiliate',
          event_label: link.href
        });
      });
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

  function getPageOffers() {
    var pageKey = normalize(location.pathname + ' ' + document.title);
    return platformOffers.filter(function (offer) {
      return pageKey.indexOf(offer.key) !== -1;
    });
  }

  function buildOfferBlock(offers) {
    var title = offers.length > 1 ? 'Try These Reward Platforms' : 'Try ' + offers[0].label;
    var intro = offers.length > 1 ? 'This comparison mentions more than one platform. Use the buttons below to open the one you want to try.' : offers[0].text;

    return '<div class="content-box platform-cta" data-platform-cta>' +
      '<h2>' + escapeHtml(title) + '</h2>' +
      '<p>' + escapeHtml(intro) + '</p>' +
      '<div class="platform-cta-actions">' + offers.map(function (offer) {
        return '<a class="btn" href="' + escapeHtml(offer.href) + '" rel="nofollow sponsored noopener" target="_blank">' + escapeHtml(offer.button) + '</a>';
      }).join('') + '</div>' +
    '</div>';
  }

  function setupPlatformCtas() {
    var articleMain = document.querySelector('.article-main');
    var quickAnswer = document.querySelector('.quick-answer');
    if (!articleMain || !quickAnswer || document.querySelector('[data-platform-cta]')) return;

    var offers = getPageOffers();
    if (!offers.length) return;

    quickAnswer.insertAdjacentHTML('afterend', buildOfferBlock(offers));
  }

  initAnalytics();

  document.addEventListener('DOMContentLoaded', function () {
    renderArticleCards();
    setupArticleSearch();
    setupDashboardData();
    setupPlatformCtas();
    setupGeneratedToc();
    setupAnalyticsEvents();
  });
}());