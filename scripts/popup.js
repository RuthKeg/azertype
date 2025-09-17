/*********************************************************************************
 * Gestion de la popup de partage + validation
 *
 * Expose : openSharePopup(score, total) pour ouvrir la popup et renseigner le score
 *********************************************************************************/

(function(){
  // éléments
  const popupBackground = document.getElementById('popupBackground');
  const popupClose = document.getElementById('popupClose');
  const popupCancel = document.getElementById('popupCancel');
  const form = document.getElementById('formPartage');
  const formError = document.getElementById('formError');
  const inputNom = document.getElementById('nom');
  const inputEmail = document.getElementById('email');

  // variable pour contenir le score envoyé depuis le jeu
  let currentScoreText = '0 / 0';

  // ouvre la popup et pré-remplit le score (appelé depuis script.js)
  window.openSharePopup = function(score, total){
    currentScoreText = `${score} / ${total}`;
    formError.textContent = '';
    inputNom.value = '';
    inputEmail.value = '';
    popupBackground.classList.add('active');
    inputNom.focus();
  };

  // ferme popup
  function closePopup(){
    popupBackground.classList.remove('active');
  }

  // listeners
  popupClose.addEventListener('click', closePopup);
  popupCancel.addEventListener('click', closePopup);

  // click à l'extérieur ferme aussi
  popupBackground.addEventListener('click', function(e){
    if (e.target === popupBackground) closePopup();
  });

  // Validation simple et envoi via mailto (ou alert si bloqué)
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const nom = inputNom.value.trim();
    const email = inputEmail.value.trim();

    // validations
    if (nom.length < 2) {
      formError.textContent = 'Le nom doit contenir au moins 2 caractères.';
      inputNom.focus();
      return;
    }
    // email regex simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formError.textContent = 'L’adresse email est invalide.';
      inputEmail.focus();
      return;
    }

    formError.textContent = '';

    // construction mailto
    const subject = encodeURIComponent('Partage du score — AzerType');
    const body = encodeURIComponent(`Salut, je suis ${nom} et j'ai réalisé le score ${currentScoreText} sur AzerType !`);
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;

    // On essaie d'ouvrir le client mail. Si bloqué, on montre un message de confirmation.
    try {
      window.location.href = mailto;
    } catch (err) {
      alert(`Merci ${nom} — votre message pour ${email} :\n\n${body}`);
    }
    closePopup();
  });

})();
