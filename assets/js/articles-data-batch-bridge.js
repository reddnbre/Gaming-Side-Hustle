(function () {
  var batch4 = Array.isArray(window.GSH_ARTICLES_BATCH_4) ? window.GSH_ARTICLES_BATCH_4 : [];
  var batch3 = Array.isArray(window.GSH_ARTICLES_BATCH_3) ? window.GSH_ARTICLES_BATCH_3 : [];

  if (batch4.length) {
    window.GSH_ARTICLES_BATCH_3 = batch4.concat(batch3);
  }
}());
