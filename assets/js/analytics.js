window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-6XMHDM9G46');

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href*="#pricing"]').forEach(function (link) {
    link.addEventListener('click', function () {
      gtag('event', 'article_cta_click', {
        event_category: 'engagement',
        event_label: document.title
      });
    });
  });

  document.querySelectorAll('a[href*="gumroad.com"]').forEach(function (link) {
    link.addEventListener('click', function () {
      gtag('event', 'ebook_click', {
        event_category: 'sales',
        event_label: link.href
      });
    });
  });
});