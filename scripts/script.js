/**
 * scripts/script.js
 * Logique du jeu (corrigée)
 *
 * Remplace entièrement ton ancien script.js par celui-ci.
 */

(function () {
  // DOM éléments (IDs attendus dans ton HTML)
  const btnCommencer = document.getElementById('btnCommencer');
  const btnContinuer = document.getElementById('btnContinuer');
  const btnArreter = document.getElementById('btnArreter');
  const btnRecommencer = document.getElementById('btnRecommencer');
  const btnValiderMot = document.getElementById('btnValiderMot');
  const btnPartager = document.getElementById('btnPartager');

  const zoneProposition = document.getElementById('zoneProposition');
  const inputEcriture = document.getElementById('inputEcriture');
  const spanScore = document.getElementById('spanScore');
  const bestScoreSpan = document.getElementById('bestScore');
  const chronoSpan = document.getElementById('chrono');
  const progressFill = document.getElementById('progressFill');

  // état du jeu
  let currentList = [];
  let index = 0;
  let score = 0;
  let timerId = null;
  let tempsRestant = 0;
  let tempsTotal = 0;
  let partieEnCours = false;

  // meilleur score localStorage
  let bestScore = parseInt(localStorage.getItem('bestScore') || '0', 10);
  bestScoreSpan.textContent = bestScore;

  // helpers pour lire options (existant dans ton HTML)
  function lireType() {
    const el = document.querySelector('input[name="optionSource"]:checked');
    return el ? el.value : 'mots';
  }
  function lireDifficulte() {
    const el = document.querySelector('input[name="difficulte"]:checked');
    return el ? el.value : 'facile';
  }
  function getTempsBy(diff, type) {
    if (diff === 'facile') return (type === 'mots') ? 10 : 15;
    if (diff === 'moyen') return (type === 'mots') ? 7 : 10;
    return (type === 'mots') ? 5 : 7;
  }
  function setButtonsState({commencer, continuer, arreter, recommencer, valider}) {
    btnCommencer.disabled = !commencer;
    btnContinuer.disabled = !continuer;
    btnArreter.disabled = !arreter;
    btnRecommencer.disabled = !recommencer;
    btnValiderMot.disabled = !valider;
  }
  function disableOptionRadios(disabled) {
    document.querySelectorAll('input[name="optionSource"]').forEach(r => r.disabled = disabled);
    document.querySelectorAll('input[name="difficulte"]').forEach(r => r.disabled = disabled);
  }

  // afficher la proposition courante (ou message si fin)
  function afficherProposition() {
    zoneProposition.classList.remove('success', 'error');
    if (!currentList || currentList.length === 0) {
      zoneProposition.textContent = 'Aucune proposition. Choisis les options puis Commencer.';
      return;
    }
    if (index >= currentList.length) {
      zoneProposition.textContent = 'Le jeu est fini 🎉';
      return;
    }
    zoneProposition.textContent = currentList[index];
  }

  // afficher score sous la forme score / total
  function afficherScore() {
    const total = (currentList && currentList.length) ? currentList.length : 0;
    spanScore.textContent = `${score} / ${total}`;
    // update meilleur score si besoin
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('bestScore', String(bestScore));
      bestScoreSpan.textContent = bestScore;
    }
  }

  // progress bar update
  function majProgress() {
    if (!progressFill) return;
    const pct = (tempsTotal > 0) ? Math.max(0, (tempsRestant / tempsTotal) * 100) : 0;
    progressFill.style.width = pct + '%';
  }

  // chrono (gère aussi la barre)
  function demarrerChrono() {
    clearInterval(timerId);
    const type = lireType();
    const diff = lireDifficulte();
    tempsTotal = getTempsBy(diff, type);
    tempsRestant = tempsTotal;
    chronoSpan.textContent = String(tempsRestant);
    majProgress();

    timerId = setInterval(() => {
      tempsRestant--;
      chronoSpan.textContent = String(tempsRestant);
      majProgress();

      if (tempsRestant <= 0) {
        clearInterval(timerId);
        // compte comme manqué -> on passe au suivant
        index++;
        // Mettre à jour l'affichage du score (score inchangé)
        afficherScore();
        if (index >= currentList.length) {
          finPartie();
        } else {
          afficherProposition();
          demarrerChrono();
        }
      }
    }, 1000);
  }
  function stopChrono() {
    clearInterval(timerId);
    chronoSpan.textContent = '--';
    progressFill.style.width = '0%';
  }

  // démarrer une nouvelle partie (reset)
  function debuterPartie() {
    const type = lireType();
    currentList = (type === 'mots') ? listeMots.slice() : listePhrases.slice();
    score = 0;
    index = 0;
    partieEnCours = true;

    disableOptionRadios(true);
    setButtonsState({commencer: false, continuer: false, arreter: true, recommencer: true, valider: true});
    inputEcriture.disabled = false;
    inputEcriture.value = '';
    inputEcriture.focus();

    afficherProposition();
    afficherScore();
    demarrerChrono();
  }

  // arrêter la partie (garder l'état pour reprendre)
  function arreterPartie() {
    if (!partieEnCours && index >= currentList.length) return; // rien à faire
    partieEnCours = false;
    stopChrono();
    zoneProposition.textContent = 'Partie arrêtée.';
    setButtonsState({commencer: false, continuer: true, arreter: false, recommencer: false, valider: false});
    inputEcriture.disabled = true;
    disableOptionRadios(false);
  }

  // continuer la partie arrêtée (reprendre à index courant)
  function continuerPartie() {
    if (partieEnCours) return;
    if (!currentList || index >= currentList.length) return; // rien à reprendre
    partieEnCours = true;
    setButtonsState({commencer: false, continuer: false, arreter: true, recommencer: true, valider: true});
    inputEcriture.disabled = false;
    inputEcriture.focus();
    afficherProposition();
    demarrerChrono();
    disableOptionRadios(true);
  }

  // recommencer proprement (reset complet)
  function recommencerPartie() {
    // reset et start
    stopChrono();
    debuterPartie();
  }

  // fin de partie (afficher message selon performance)
  function finPartie() {
    partieEnCours = false;
    stopChrono();
    const total = (currentList && currentList.length) ? currentList.length : 0;
    const ratio = total > 0 ? (score / total) : 0;
    let message = '';
    if (ratio < 0.4) message = 'Courage ! Continue à t’entraîner 💪';
    else if (ratio < 0.75) message = 'Bien joué ! Encore un petit effort ✨';
    else message = 'Excellent ! Tu es prête pour le niveau suivant 🚀';
    zoneProposition.innerHTML = `Le jeu est fini 🎉<br><small>${message}</small>`;
    setButtonsState({commencer: true, continuer: false, arreter: false, recommencer: true, valider: false});
    inputEcriture.disabled = true;
    disableOptionRadios(false);
    // mettre à jour bestScore déjà fait dans afficherScore
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('bestScore', String(bestScore));
      bestScoreSpan.textContent = bestScore;
    }
  }

  // validation d'un mot/phrase saisi
  function verifierMot() {
    if (!partieEnCours) return;
    if (!currentList || index >= currentList.length) return;

    const saisie = inputEcriture.value.trim();
    const cible = currentList[index];

    // feedback visuel immédiat
    if (saisie === cible) {
      score++;
      // petit feedback vert
      zoneProposition.classList.remove('error');
      zoneProposition.classList.add('success');
      // on affiche temporairement la coche (on garde aussi le mot pour feedback)
      const prevText = zoneProposition.textContent;
      zoneProposition.textContent = `${prevText} ✔️`;
    } else {
      // feedback rouge + shake
      zoneProposition.classList.remove('success');
      zoneProposition.classList.add('error');
      const prevText = zoneProposition.textContent;
      zoneProposition.textContent = `${prevText} ✖️`;
    }

    // mettre à jour score visible tout de suite
    afficherScore();

    // stop timer et avancer au prochain mot après court délai pour laisser voir le feedback
    clearInterval(timerId);
    setTimeout(() => {
      // retirer classes de feedback
      zoneProposition.classList.remove('success', 'error');

      index++;
      inputEcriture.value = '';
      if (index >= currentList.length) {
        finPartie();
      } else {
        afficherProposition();
        demarrerChrono();
      }
    }, 450); // 450ms = assez pour lire le ✔/✖
  }

  // --- listeners boutons & clavier ---

  btnCommencer && btnCommencer.addEventListener('click', () => {
    // Empêcher de démarrer si déjà en cours
    if (partieEnCours) return;
    debuterPartie();
  });

  btnArreter && btnArreter.addEventListener('click', () => {
    if (!partieEnCours) return;
    arreterPartie();
  });

  btnContinuer && btnContinuer.addEventListener('click', () => {
    continuerPartie();
  });

  btnRecommencer && btnRecommencer.addEventListener('click', () => {
    // Recommencer proprement : reset complet et start
    recommencerPartie();
  });

  btnValiderMot && btnValiderMot.addEventListener('click', () => {
    verifierMot();
  });

  // valider sur Enter (si input pas disabled)
  inputEcriture && inputEcriture.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!btnValiderMot.disabled) verifierMot();
    }
  });

  // partager : ouvre la popup (popup.js doit exposer window.openSharePopup(score, total))
  btnPartager && btnPartager.addEventListener('click', () => {
    const total = (currentList && currentList.length) ? currentList.length : 0;
    if (typeof window.openSharePopup === 'function') {
      window.openSharePopup(score, total);
    } else {
      // fallback : ouvrir la popup HTML si popup.js n'expose pas la fn
      const popupBg = document.getElementById('popupBackground');
      if (popupBg) popupBg.classList.add('active');
    }
  });

  // initialisation UI (au chargement)
  function initUI() {
    // état boutons initial
    setButtonsState({commencer: true, continuer: false, arreter: false, recommencer: false, valider: false});
    inputEcriture.disabled = true;
    afficherScore(); // montrera 0 / 0 si pas de liste
    chronoSpan.textContent = '--';
    progressFill.style.width = '0%';
  }

  // lance l'initialisation quand DOM prêt (main.js fait déjà lancerJeu, mais on rend sûr)
  initUI();

  // export (si main.js appelle lancerJeu) — on respecte ton ancien nom de fonction
  window.lancerJeu = function () {
    initUI();
    // On ne démarre pas automatiquement ; on attend que l'utilisateur clique "Commencer"
    // (mais si tu veux auto-start, peux appeler debuterPartie ici)
  };
})();
