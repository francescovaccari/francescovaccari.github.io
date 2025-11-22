document.addEventListener('DOMContentLoaded', function(){
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));
  const items = Array.from(document.querySelectorAll('.pub-item'));
  const searchInput = document.getElementById('pub-search');

  function applyFilter(){
    const activeBtn = buttons.find(b => b.classList.contains('active'));
    const filter = activeBtn ? activeBtn.dataset.filter : 'all';
    const query = (searchInput && searchInput.value || '').trim().toLowerCase();

    items.forEach(item => {
      const type = item.dataset.type || '';
      const text = item.textContent.trim().toLowerCase();

      const matchesType = (filter === 'all') || (type === filter);
      const matchesQuery = !query || text.indexOf(query) !== -1;

      if(matchesType && matchesQuery){
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

  // initial filter
  applyFilter();
});
