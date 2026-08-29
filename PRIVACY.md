# Politique de confidentialité — GPX Pacer

*Dernière mise à jour : 29 août 2026 · Applicable à l'application Android
`com.helazior.gpxpacer` et au champ de données Connect IQ « GPX Pacer ».*

## En une phrase

**GPX Pacer ne collecte, ne transmet et ne stocke aucune donnée personnelle.**
Il n'y a ni compte GPX Pacer, ni serveur, ni analytique, ni publicité, ni traceur. Le
seul échange réseau est optionnel, déclenché par toi, et se fait directement avec
Strava (voir plus bas).

## Ce que l'application manipule, et où ça reste

| Donnée | D'où elle vient | Où elle va |
|---|---|---|
| Fichiers GPX | Que **tu** choisis, via le sélecteur de fichiers du système | Lus en mémoire, jamais copiés ailleurs |
| Plans d'allure, points de passage, réglages | Calculés ou saisis par toi | `SharedPreferences`, dans le bac à sable privé de l'app |
| Trace compressée envoyée à la montre | Dérivée de ton GPX | Ta montre, par Bluetooth, via Garmin Connect Mobile |
| Rapports de course | Calculés par la montre | Renvoyés à ton téléphone, stockés localement |
| Position GPS, fréquence cardiaque | Capteurs de la montre, pendant l'activité | Restent sur la montre, le temps de l'activité |
| Itinéraire ou activité Strava importés (optionnel) | Téléchargés depuis Strava quand **tu** partages un lien vers l'app | Fichier GPX dans le bac à sable privé de l'app |
| GPX exporté (optionnel) | Généré par l'app à ta demande (« exporter ») | À l'emplacement que **tu** choisis dans le sélecteur du système |
| Jetons de connexion Strava (optionnel) | Délivrés par Strava après **ton** consentement | `SharedPreferences` privées ; effacés par « Déconnecter Strava » ou la désinstallation |

Rien de tout cela ne quitte tes appareils, hors l'échange avec Strava décrit ci-dessous.

## Permissions

**L'application Android déclare une seule permission : `INTERNET`**, et ne s'en sert
que pour l'import Strava (ci-dessous). Pas de localisation, pas d'accès au stockage :
le fichier GPX arrive par le sélecteur de documents du système, ou par « Ouvrir avec »
/ « Partager », qui accordent un accès ponctuel au seul fichier que tu désignes.

## Import Strava (optionnel)

Tu peux partager un itinéraire ou l'une de tes activités depuis l'application Strava
vers GPX Pacer. Strava ne laisse télécharger un itinéraire — même public — qu'à un
utilisateur connecté, et ne fournit les données d'une activité qu'à son propriétaire,
donc cette fonction demande de **connecter ton compte Strava** une fois, par le
mécanisme officiel (OAuth2), dans ton navigateur ou l'application Strava. GPX Pacer ne
voit jamais ton mot de passe.

- L'application ne contacte Strava que lorsque tu connectes ton compte, que tu
  partages un lien vers elle, ou que tu te déconnectes. Jamais en arrière-plan.
- Ce qui est téléchargé : le nom, le type, le tracé et le temps estimé de l'itinéraire
  partagé ; ou le nom, le type, le tracé, l'altitude et les horodatages de l'activité
  partagée (seulement les tiennes : Strava ne donne pas celles des autres athlètes).
- Autorisations demandées à Strava : lecture de ton profil public, de tes itinéraires
  et de tes activités. Aucune écriture.
- Ce qui est envoyé à Strava : rien d'autre que les requêtes nécessaires à cet
  import. Aucune activité, aucun rapport de course, aucun plan ne remonte vers Strava.
- Les jetons d'accès restent dans le stockage privé de l'app. « Déconnecter Strava »
  révoque l'autorisation côté Strava et les efface.
- L'usage de ces données par Strava relève de la politique de confidentialité de
  Strava. Tu peux aussi révoquer GPX Pacer depuis Strava → Paramètres → Mes applis.

Si tu n'utilises pas cette fonction, l'application n'émet aucune requête réseau.

Le champ de données montre déclare trois permissions Connect IQ, toutes nécessaires à
son fonctionnement et toutes locales à la montre :

- **Communications** — recevoir la trace depuis le téléphone et lui renvoyer le
  rapport de course.
- **Positioning** — te relocaliser sur la trace pendant la course.
- **UserProfile** — lire tes zones de fréquence cardiaque pour colorer l'affichage FC.

## Tiers

Le transfert téléphone ↔ montre passe par l'application **Garmin Connect Mobile**,
qui doit être installée. Ce transit relève de la politique de confidentialité de
Garmin, sur laquelle nous n'avons aucune prise. GPX Pacer n'envoie rien à Garmin
en dehors de ce transport local vers ta propre montre.

**Strava** n'intervient que si tu connectes ton compte pour importer un itinéraire
(section ci-dessus).

Il n'y a aucun autre tiers : aucune bibliothèque d'analytique, de publicité ou de
rapport de plantage n'est embarquée.

## Enfants

L'application ne s'adresse pas aux enfants et ne collecte sciemment aucune donnée les
concernant — puisqu'elle n'en collecte aucune.

## Effacer tes données

Désinstalle l'application : tout ce qu'elle a écrit disparaît avec elle — y compris
les jetons et itinéraires Strava. Côté montre,
supprime le champ de données ; la trace et le rapport stockés en flash partent avec.

## Modifications

Toute évolution de cette politique sera publiée sur cette page, avec sa date.

## Contact

Clément Gindrier — clementgindrier@gmail.com

---

# Privacy Policy — GPX Pacer (English)

*Last updated: 29 August 2026*

**GPX Pacer collects, transmits and stores no personal data.** There is no
GPX Pacer account, no server, no analytics, no advertising and no tracking. The only
network exchange is optional, triggered by you, and goes directly to Strava.

GPX files you pick are read in memory. Pacing plans, checkpoints and settings are
kept in the app's private storage. The compressed track is sent to *your* watch over
Bluetooth via Garmin Connect Mobile, and the watch sends a race report back to your
phone. GPS position and heart rate stay on the watch, for the duration of the
activity. Nothing leaves your devices.

**The Android app declares a single permission, `INTERNET`**, used only for the
optional Strava import: share a route or one of your own activities from the Strava app
to GPX Pacer and, after you connect your Strava account once through Strava's official
OAuth2 flow (GPX Pacer never sees your password), the app downloads that route's name,
type, track and estimated time — or that activity's name, type, track, altitude and
timestamps (your own activities only: Strava does not expose other athletes') — into
its private storage. Read-only scopes: profile, routes, activities. The "export" link
writes a GPX with the plan's times to a location you pick in the system file dialog. It contacts Strava only when you connect, share a
link, or disconnect — never in the background — and sends nothing else to Strava: no
activity, race report or plan. Tokens stay in the app's private storage; "Disconnect
Strava" revokes the authorisation and deletes them. Strava's own privacy policy
governs Strava's side. If you never use this feature, the app makes no network
request. No location, no storage permission. The watch data field declares
Communications, Positioning and UserProfile, all required and all local to the watch.

The phone ↔ watch transfer relies on the Garmin Connect Mobile app, governed by
Garmin's own privacy policy. No analytics, advertising or crash-reporting library is
bundled.

Uninstalling the app removes everything it wrote, Strava tokens and routes included;
deleting the data field removes the
stored track and report from the watch.

Contact: Clément Gindrier — clementgindrier@gmail.com
