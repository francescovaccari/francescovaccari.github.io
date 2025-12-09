document.addEventListener('DOMContentLoaded', function(){
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));
  const items = Array.from(document.querySelectorAll('.pub-item'));
  const searchInput = document.getElementById('pub-search');
  const keywordFiltersContainer = document.getElementById('keyword-filters');
  let activeKeywords = new Set();

  // Extract all unique keywords from publications
  function extractKeywords(){
    const keywords = new Set();
    items.forEach(item => {
      const kw = item.dataset.keywords || '';
      kw.split(' ').forEach(k => {
        if(k.trim()) keywords.add(k.trim());
      });
    });
    return Array.from(keywords).sort();
  }

  // Build keyword filter buttons
  function buildKeywordFilters(){
    const keywords = extractKeywords();
    keywordFiltersContainer.innerHTML = '';
    keywords.forEach(keyword => {
      const btn = document.createElement('button');
      btn.className = 'keyword-btn';
      btn.textContent = keyword.replace(/-/g, ' ');
      btn.dataset.keyword = keyword;
      btn.addEventListener('click', function(){
        if(activeKeywords.has(keyword)){
          activeKeywords.delete(keyword);
          btn.classList.remove('active');
        } else {
          activeKeywords.add(keyword);
          btn.classList.add('active');
        }
        applyFilter();
      });
      keywordFiltersContainer.appendChild(btn);
    });
  }

  function applyFilter(){
    const activeBtn = buttons.find(b => b.classList.contains('active'));
    const filter = activeBtn ? activeBtn.dataset.filter : 'all';
    const query = (searchInput && searchInput.value || '').trim().toLowerCase();

    items.forEach(item => {
      const type = item.dataset.type || '';
      const text = item.textContent.trim().toLowerCase();
      const itemKeywords = (item.dataset.keywords || '').split(' ').filter(k => k.trim());

      const matchesType = (filter === 'all') || (type === filter);
      const matchesQuery = !query || text.indexOf(query) !== -1;
      const matchesKeywords = activeKeywords.size === 0 || Array.from(activeKeywords).every(k => itemKeywords.includes(k));

      if(matchesType && matchesQuery && matchesKeywords){
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  // button handlers
  buttons.forEach(btn => {
    btn.addEventListener('click', function(){
      buttons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      applyFilter();
    });
  });

  // search handler
  if(searchInput){
    searchInput.addEventListener('input', function(){
      applyFilter();
    });
  }

  // Build keyword filters and apply initial filter
  buildKeywordFilters();
  applyFilter();
});
