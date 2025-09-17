document.addEventListener('DOMContentLoaded', function(){
  lancerJeu();

  // Mode sombre
  const btnTheme = document.getElementById('btnTheme');
  btnTheme.addEventListener('click', function(){
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')){
      btnTheme.textContent = "☀️ Mode clair";
    } else {
      btnTheme.textContent = "🌙 Mode sombre";
    }
  });
});
