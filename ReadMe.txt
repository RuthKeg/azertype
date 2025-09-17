AzerType — Jeu de saisie rapide
Auteur : Ruth Kegmo
Version actuelle : 1.0
Technologies : HTML5, CSS3, JavaScript (Vanilla)
Style : “Girly” avec mode clair/sombre

DESCRIPTION
-----------
AzerType est un jeu éducatif de frappe rapide qui permet à l’utilisateur de pratiquer la saisie de mots et phrases. L’objectif est de taper correctement le texte affiché avant la fin du temps imparti. Le jeu suit un système de score et garde en mémoire le meilleur score localement sur le navigateur.

Fonctionnalités principales :
- Sélection du type de texte (mots ou phrases) et de la difficulté (facile, moyen, difficile) avant de commencer la partie.
- Commencer, arrêter, continuer ou recommencer une partie.
- Chronomètre avec barre de progression dynamique qui diminue avec le temps.
- Feedback visuel immédiat sur la saisie : ✔️ correct / ✖️ incorrect.
- Score en temps réel sous forme score / total et meilleur score sauvegardé dans localStorage.
- Partage du score via un formulaire popup.
- Support clavier (touche Enter pour valider).
- Mode sombre / clair avec contraste adapté pour une lecture confortable.

STRUCTURE DU PROJET
-------------------
azerType/
│
├── index.html        # Page principale du jeu
├── style/
│   └── style.css     # CSS principal (style girly + dark mode)
├── scripts/
│   ├── config.js     # Configuration générale (listes de mots/phrases)
│   ├── popup.js      # Gestion de la popup de partage
│   ├── script.js     # Logique du jeu (start/stop/validation/score/chrono)
│   └── main.js       # Initialisation générale et lancement du jeu
└── README.txt        # Ce document

DÉTAILS TECHNIQUES
------------------
1. HTML
- Sections principales :
  - Header : titre, tag, bouton mode sombre et avatar.
  - Options : type, difficulté, boutons Commencer/Arrêter/Recommencer.
  - Jeu : zone d’affichage du texte, champ de saisie et bouton valider.
  - Partage : bouton pour ouvrir le formulaire popup.
  - Footer : informations légales.
  - Popup : formulaire de partage du score (nom + email).
- Accessibilité :
  - aria-label et aria-live pour la popup et feedback des formulaires.
  - Navigation clavier supportée (Tab, Enter).

2. CSS (style/style.css)
- Variables CSS pour thèmes clair et sombre (:root et .dark).
- Classes spécifiques pour :
  - Panels (.panel), boutons (.btn), input et zone de texte.
  - Feedback visuel : .success (vert) et .error (rouge).
- Responsive design pour petits écrans (<700px).
- Barre de progression animée (#progressFill) qui change selon le temps restant.

3. JavaScript
script.js — logique principale :

- État du jeu :
  let currentList = [], index = 0, score = 0;
  let timerId = null, tempsRestant = 0, tempsTotal = 0;
  let partieEnCours = false;

- Fonctions principales :
  - debuterPartie() : démarre une nouvelle partie.
  - arreterPartie() : arrête temporairement une partie pour la reprendre.
  - continuerPartie() : reprend une partie arrêtée.
  - recommencerPartie() : réinitialise complètement la partie.
  - finPartie() : termine la partie et affiche un message selon le score.
  - verifierMot() : compare la saisie avec le mot/phrase courant et met à jour le score.
  - demarrerChrono() / stopChrono() : gestion du timer et de la barre de progression.

- Gestion des événements :
  - Boutons : Commencer / Continuer / Arrêter / Recommencer / Valider / Partager.
  - Clavier : touche Enter pour valider.

- Stockage :
  - Meilleur score sauvegardé dans localStorage :
    localStorage.setItem('bestScore', bestScore);

- Partage :
  - Ouvre la popup et pré-remplit le score actuel.
  - Validation des champs nom et email.
  - Génère un mailto: ou fallback alert si client mail non disponible.

4. Accessibilité et UX
- Feedback visuel immédiat ✔️/✖️ pour chaque saisie.
- Désactivation des options pendant la partie pour éviter les changements intempestifs.
- Barre de progression colorée : rose foncé en mode clair, violette en mode sombre.
- Support clavier complet pour la saisie et navigation des boutons.
- Mode sombre accessible via un bouton.

INSTALLATION ET UTILISATION
----------------------------
1. Cloner le projet ou télécharger les fichiers.
2. Ouvrir index.html dans un navigateur moderne (Chrome, Firefox, Edge).
3. Sélectionner les options de jeu et cliquer sur Commencer.
4. Utiliser le champ de saisie pour taper les mots/phrases affichés.
5. Utiliser les boutons Arrêter, Continuer, Recommencer selon besoin.
6. Partager le score avec le formulaire en bas.

⚠️Le meilleur score est sauvegardé localement sur l’appareil de l’utilisateur. Il ne se synchronise pas entre différents appareils ou utilisateurs.

EXTENSIBILITÉ
-------------
- Ajouter de nouveaux mots ou phrases dans config.js.
- Ajouter des niveaux dynamiques ou timers personnalisés.
- Intégrer sons et animations pour le feedback visuel.
- Ajouter avatars ou mascottes pour renforcer l’expérience de jeu.

LICENSE
-------
Projet personnel par Ruth Kegmo.
Libre d’utilisation pour usage personnel ou apprentissage.
