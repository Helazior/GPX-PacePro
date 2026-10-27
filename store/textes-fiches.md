# Textes des fiches et check-list de dépôt — GPX Pacer

Textes prêts à coller dans la Google Play Console et dans la console développeur
Connect IQ, en français et en anglais, puis la liste de tout ce qu'il faut fournir en
plus des images de `store/`. Rien n'est promis ici qui ne soit dans l'application
telle que montrée par les captures du kit et décrite dans `PRIVACY.md`.

Remplacer `<URL-CONFIDENTIALITÉ>` par l'adresse publique de la politique de
confidentialité (voir check-list) et `<LIEN-PLAY>` / `<LIEN-CONNECT-IQ>` par les
liens des fiches une fois publiées.

---

## 1. Google Play

### Nom de l'application (30 caractères max)

| | Texte | Longueur |
|---|---|---|
| FR / EN (sobre) | `GPX Pacer` | 9 |
| FR (avec mot-clé) | `GPX Pacer – Plan d'allure` | 25 |
| EN (avec mot-clé) | `GPX Pacer – Pacing plan` | 23 |

Pas de « Garmin » dans le nom (marque tierce) : la compatibilité se dit dans la description.

### Description courte (80 caractères max)

- FR : `Ton GPX devient un plan d'allure ; ta montre Garmin affiche l'écart au plan.` (76)
- EN : `Your GPX becomes a pacing plan; your Garmin watch shows the gap to plan.` (72)

### Description complète — FR (4000 caractères max)

```
Cours ton plan, pas ta montre.

GPX Pacer transforme une trace GPX en plan d'allure : un temps de référence pour chaque point du parcours, pondéré par le dénivelé et la technicité du terrain. Le plan part sur ta montre Garmin, qui n'affiche en course que l'essentiel : l'écart au plan, en minutes, et l'heure d'arrivée estimée. À l'arrivée, la montre renvoie un rapport de course au téléphone, qui apprend ton profil pente par pente.

PRÉPARE
• Charge un GPX : sélecteur de fichiers, « Ouvrir avec », ou partage d'un itinéraire ou d'une activité depuis Strava.
• Fixe ton temps objectif.
• Règle la stratégie de split (positif, régulier, négatif) et ajuste le plan à ton profil montée / descente.
• Lis le profil d'altitude coloré par pente, avec la courbe d'allure, en plein écran si tu veux.
• Pose des points de passage avec leur temps de passage, des rappels, et consulte le détail par kilomètre.
• Quatre types d'activité : trail, course sur route, randonnée, vélo.

COURS
• Envoie le plan à la montre en un geste, vers le champ de données Connect IQ « GPX Pacer » (à installer depuis la boutique Connect IQ).
• Deux cadrans : anneau de progression (2, 3 ou 4 champs) ou Horizon. Deux thèmes : noir ou beige.
• Champs : avance ou retard sur le plan, chrono, temps final estimé, guide d'allure (toi par rapport au plan), heure d'arrivée estimée, distance parcourue.

ANALYSE
• Temps final et écart au plan, détaillés par pente : montée raide, montée, plat, descente, descente raide.
• Effort (% FCmax) et rendement cardiaque par pente, dérive cardiaque, VAM, écart par tiers de course, arrêts et temps hors trace.
• Un profil de coureur appris de tes courses : ton allure selon la pente face au traileur moyen, tes points forts et faibles. L'option « Ajuster à mon profil » le réinjecte dans le plan suivant.

CE QU'IL TE FAUT
• Une montre Garmin compatible Connect IQ et l'application Garmin Connect Mobile : le transfert passe par elle, en Bluetooth.
• Le champ de données « GPX Pacer » installé sur la montre : <LIEN-CONNECT-IQ>

CONFIDENTIALITÉ
Aucun compte, aucun serveur, aucune collecte de données : tes GPX, tes plans et tes rapports restent sur tes appareils. La seule connexion réseau est l'import Strava, optionnel et déclenché par toi. Politique de confidentialité : <URL-CONFIDENTIALITÉ>

GPX Pacer n'affiche pas de carte : il parle en chiffres et en profils.

Garmin et Connect IQ sont des marques de Garmin Ltd. Strava est une marque de Strava, Inc. GPX Pacer est une application indépendante, sans lien avec ces sociétés.
```

### Description complète — EN

```
Run your plan, not your watch.

GPX Pacer turns a GPX track into a pacing plan: a reference time for every point of the route, weighted by elevation gain and the technicality of the terrain. The plan goes to your Garmin watch, which shows only what matters while you run: the gap to plan, in minutes, and the estimated finish time. At the finish, the watch sends a race report back to your phone, which learns your profile gradient by gradient.

PREPARE
• Load a GPX: file picker, "Open with", or share a route or an activity from Strava.
• Set your target time.
• Choose the split strategy (positive, even, negative) and adjust the plan to your uphill / downhill profile.
• Read the elevation profile coloured by gradient, with the pace curve, full screen if you like.
• Add checkpoints with their split times, reminders, and the kilometre-by-kilometre detail.
• Four activity types: trail, road running, hiking, cycling.

RUN
• Send the plan to the watch in one tap, to the "GPX Pacer" Connect IQ data field (installed from the Connect IQ store).
• Two dials: progress ring (2, 3 or 4 fields) or Horizon. Two themes: black or beige.
• Fields: ahead or behind plan, chrono, estimated final time, pace guide (you against the plan), estimated arrival time, distance covered.

REVIEW
• Final time and gap to plan, broken down by gradient: steep climb, climb, flat, descent, steep descent.
• Effort (% HRmax) and heart-rate efficiency per gradient, cardiac drift, VAM (climb rate), gap per third of the race, stops and off-track time.
• A runner profile learned from your races: your pace by gradient against the average trail runner, your strong and weak points. The "adjust to my profile" option feeds it back into the next plan.

WHAT YOU NEED
• A Connect IQ compatible Garmin watch and the Garmin Connect Mobile app: the transfer goes through it, over Bluetooth.
• The "GPX Pacer" data field installed on the watch: <LIEN-CONNECT-IQ>

PRIVACY
No account, no server, no data collection: your GPX files, plans and reports stay on your devices. The only network connection is the optional Strava import, triggered by you. Privacy policy: <URL-CONFIDENTIALITÉ>

GPX Pacer shows no map: it speaks in numbers and profiles.

Garmin and Connect IQ are trademarks of Garmin Ltd. Strava is a trademark of Strava, Inc. GPX Pacer is an independent app, not affiliated with these companies.
```

### Notes de version (première publication)

- FR : `Première version : plan d'allure depuis un GPX, envoi à la montre, rapport de course et profil de coureur.`
- EN : `First release: pacing plan from a GPX, send to the watch, race report and runner profile.`

---

## 2. Boutique Connect IQ

### Nom

`GPX Pacer` — type **Data Field** (champ de données).

### Description — FR

```
L'écart au plan, rien d'autre.

GPX Pacer est le champ de données compagnon de l'application Android GPX Pacer. Sur le téléphone, ta trace GPX devient un plan d'allure : un temps de référence pour chaque point du parcours, pondéré par le dénivelé et le terrain. Le plan est envoyé à la montre ; en course, le champ te relocalise sur la trace et affiche :

• ton avance ou ton retard sur le plan, en minutes ;
• le chrono et le temps final estimé ;
• le guide d'allure : toi par rapport au plan ;
• l'heure d'arrivée estimée ;
• la distance parcourue, avec un anneau de progression du chrono vers la fin estimée.

Deux cadrans, choisis depuis le téléphone : anneau de progression (2, 3 ou 4 champs) ou Horizon. Deux thèmes : noir ou beige. Pour le trail, la course sur route, la randonnée et le vélo.

À l'arrivée, le champ renvoie au téléphone un rapport de course : écart au plan par pente, effort et rendement cardiaque, dérive cardiaque, VAM, écart par tiers, arrêts. Le téléphone apprend ainsi ton profil pente par pente.

MISE EN ROUTE
1. Installe l'application GPX Pacer sur ton téléphone Android : <LIEN-PLAY>
2. Ajoute ce champ de données à un écran de ton activité, de préférence un écran à un seul champ.
3. Dans l'application, charge un GPX, règle ton objectif et appuie sur « Envoyer à la montre ». Tant qu'aucune trace n'a été reçue, le champ affiche « Waiting for a GPX ».

Le transfert passe par Garmin Connect Mobile, en Bluetooth : montre et téléphone doivent être connectés.

PERMISSIONS
• Communications : recevoir la trace, renvoyer le rapport de course.
• Positioning : te relocaliser sur la trace pendant l'activité.
• UserProfile : lire tes zones de fréquence cardiaque.
Tout reste sur la montre et sur ton téléphone : aucun serveur, aucune collecte de données. Politique de confidentialité : <URL-CONFIDENTIALITÉ>
```

### Description — EN

```
The gap to plan, nothing else.

GPX Pacer is the companion data field of the GPX Pacer Android app. On the phone, your GPX track becomes a pacing plan: a reference time for every point of the route, weighted by elevation and terrain. The plan is sent to the watch; while you run, the field locates you on the track and shows:

• how far ahead of or behind the plan you are, in minutes;
• the chrono and the estimated final time;
• the pace guide: you against the plan;
• the estimated arrival time;
• the distance covered, with a progress ring from the chrono to the estimated finish.

Two dials, chosen from the phone: progress ring (2, 3 or 4 fields) or Horizon. Two themes: black or beige. For trail running, road running, hiking and cycling.

At the finish, the field sends a race report back to the phone: gap to plan per gradient, effort and heart-rate efficiency, cardiac drift, VAM, gap per third, stops. That is how the phone learns your profile, gradient by gradient.

GETTING STARTED
1. Install the GPX Pacer app on your Android phone: <LIEN-PLAY>
2. Add this data field to a data screen of your activity, ideally a single-field screen.
3. In the app, load a GPX, set your target and tap "Send to watch". Until a track has been received, the field shows "Waiting for a GPX".

The transfer goes through Garmin Connect Mobile over Bluetooth: watch and phone must be connected.

PERMISSIONS
• Communications: receive the track, send the race report back.
• Positioning: locate you on the track during the activity.
• UserProfile: read your heart-rate zones.
Everything stays on the watch and on your phone: no server, no data collection. Privacy policy: <URL-CONFIDENTIALITÉ>
```

### « What's New » (première publication)

- FR : `Première version. Anneau de progression (2, 3 ou 4 champs) et cadran Horizon, thèmes noir et beige, rapport de course renvoyé au téléphone.`
- EN : `First release. Progress ring (2, 3 or 4 fields) and Horizon dial, black and beige themes, race report sent back to the phone.`

---

## 3. Check-list : ce qu'il faut fournir en plus des images

### Commun aux deux fiches

- [ ] **URL publique de la politique de confidentialité** (obligatoire des deux côtés).
      `PRIVACY.md` de ce dépôt convient si le dépôt est public :
      `https://github.com/Helazior/GPX-PacePro/blob/main/PRIVACY.md` — vérifier qu'elle
      s'ouvre dans une fenêtre de navigation privée. Plus propre : l'activer en GitHub
      Pages pour avoir une page HTML.
- [ ] **E-mail de contact / support** : `clementgindrier@gmail.com` (celui de `PRIVACY.md`).
- [ ] **Liens croisés** : coller le lien Connect IQ dans la description Play et le lien
      Play dans la description Connect IQ. Lien Play prévisible dès maintenant :
      `https://play.google.com/store/apps/details?id=com.helazior.gpxpacer` ; le lien
      Connect IQ (`https://apps.garmin.com/apps/<id>`) n'existe qu'après le premier dépôt.
- [ ] **Tarification** : décider (le brief dit que le modèle peut changer) ; aucun texte
      ci-dessus ne dit « gratuit », « sans pub » ni « open source », ne pas l'ajouter.

### Google Play Console

- [ ] Icône **512 × 512** (`icone_play_512.png`, finale) — PNG 32 bits, < 1 Mo.
- [ ] Image de présentation **1024 × 500** : `store/play/feature_play_1024x500_fr.png`
      (fiche FR) et `_en` (fiche EN).
- [ ] Captures téléphone : les 7 de `store/play/fr/` puis `store/play/en/` (2 à 8 par langue).
- [ ] Captures **tablette 7″ et 10″** : facultatives, mais sans elles la Console affiche
      un avertissement et la fiche n'est pas mise en avant sur tablette. À générer si
      l'app tourne sur tablette (je peux les produire depuis les mêmes compositions).
- [ ] Vidéo YouTube : facultative.
- [ ] Langue par défaut **français (France)**, puis ajouter **anglais (États-Unis)** avec
      les textes EN.
- [ ] Catégorie : **Santé et remise en forme** (alternative : Sports). Tags : course à
      pied, fitness, randonnée, vélo.
- [ ] **Sécurité des données** (Data safety), d'après `PRIVACY.md` : aucune donnée
      collectée ni partagée ; pas de chiffrement en transit à déclarer puisque rien
      n'est transmis au développeur ; les données sont supprimables (désinstallation).
      L'import Strava est une action déclenchée par l'utilisateur vers un tiers qu'il a
      choisi : Google l'exempte de la déclaration de « partage », à vérifier au moment
      de remplir le formulaire.
- [ ] **Classification du contenu** (questionnaire IARC) : catégorie utilitaire, aucun
      contenu sensible → tous publics.
- [ ] **Public cible** : 18 ans et plus (l'app ne s'adresse pas aux enfants ; évite les
      obligations du programme Familles).
- [ ] **Déclarations** : annonces → non ; accès à l'app → toutes les fonctionnalités
      principales sont accessibles sans identifiants (préciser que la connexion Strava
      est optionnelle) ; applis de santé → cocher « activité physique / fitness » (le
      rapport contient l'effort cardiaque) ; actualités, gouvernement, finance → non.
- [ ] **Appareils** : téléphones (et tablettes si prises en charge). Package :
      `com.helazior.gpxpacer`. Bundle **.aab** signé, niveau d'API cible conforme à
      l'exigence Play en vigueur au moment du dépôt.
- [ ] **Compte développeur personnel récent** : Google impose un **test fermé avec au
      moins 12 testeurs pendant 14 jours** avant de demander l'accès à la production.
      À anticiper dans le calendrier.
- [ ] Pays de distribution, puis notes de version (ci-dessus).

### Console développeur Connect IQ

- [ ] Fichier **.iq** compilé pour la boutique (clé développeur, build « App Store »).
- [ ] Type d'application : **Data Field**. Nom : `GPX Pacer`.
- [ ] Icône boutique **500 × 500** (`icone_connectiq_500.png`, finale) : ni texte, ni fond
      noir, ni transparence.
- [ ] Bandeau **1440 × 720** : `store/connectiq/hero_connectiq_1440x720_fr.png` (et `_en`
      si la console accepte un visuel par langue ; sinon prendre le FR ou l'EN selon la
      langue principale de la fiche).
- [ ] Captures montre : `store/connectiq/montre/*_800.png` (7). **Vérifier la taille
      exacte demandée** dans le formulaire au moment du dépôt ; les sources sont
      regénérables à une autre taille en une ligne dans `store/src/build.mjs`.
- [ ] Description FR et EN (ci-dessus) : la fiche accepte plusieurs langues, ajouter
      l'anglais en plus du français.
- [ ] « What's New » (ci-dessus).
- [ ] Appareils compatibles et permissions : repris automatiquement du manifeste
      (`Communications`, `Positioning`, `UserProfile`) ; la politique de confidentialité
      est exigée dès qu'une de ces permissions est déclarée.
- [ ] URL de support ou site : ce dépôt GitHub peut servir de page de support en
      attendant mieux.
- [ ] Lien vers l'application compagnon (Play) dans la description — et préciser
      « Android » : il n'y a pas d'application iOS.
