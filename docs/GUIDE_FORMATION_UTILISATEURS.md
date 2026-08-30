# 🌍 GOLDIES TRAVEL — GUIDE OPÉRATIONNEL & MANUEL DE FORMATION UTILISATEURS

**Version :** 1.0 — Fintech & Travel-Tech Grade  
**Date :** Août 2026  
**Cible :** Équipe de Direction, Coordinatrices de Voyages, Gestionnaires Support & Administrateurs  
**Fichier Word généré :** [`Goldies_Guide_Formation_Utilisateurs.docx`](file:///Users/yancoubadiatta/Downloads/goldies/Goldies_Guide_Formation_Utilisateurs.docx) *(Prêt à être déposé dans Google Drive ou ouvert avec Microsoft Word / LibreOffice)*

---

## 📑 SOMMAIRE EXÉCUTIF

1. [Introduction & Présentation de la Plateforme](#1-introduction--présentation-de-la-plateforme)
2. [Sécurité & Authentification Double Facteur (2FA / MFA)](#2-sécurité--authentification-double-facteur-2fa--mfa)
3. [Module 1 : Gestion du Catalogue des Voyages (Trips)](#3-module-1--gestion-du-catalogue-des-voyages-trips)
4. [Module 2 : Inscriptions & Parcours Financier (Bookings)](#4-module-2--inscriptions--parcours-financier-bookings)
5. [Module 3 : Vigilance Voyageuses & Santé (Duty of Care)](#5-module-3--vigilance-voyageuses--santé-duty-of-care)
6. [Module 4 : Traçabilité & Journal d'Audit Immuable (Audit Events)](#6-module-4--traçabilité--journal-daudit-immuable-audit-events)
7. [Module 5 : Conformité & Maintenance RGPD](#7-module-5--conformité--maintenance-rgpd)
8. [Module 6 : Galerie Photos & Preuve Sociale](#8-module-6--galerie-photos--preuve-sociale)
9. [Guide de Résolution des Problèmes Fréquents (Troubleshooting & FAQ)](#9-guide-de-résolution-des-problèmes-fréquents-troubleshooting--faq)
10. [Check-lists Opérationnelles de l'Administrateur](#10-check-lists-opérationnelles-de-ladministrateur)

---

## 1. INTRODUCTION & PRÉSENTATION DE LA PLATEFORME

### 1.1 Mission & Positionnement
**Goldies Travel** organise des voyages immersifs et solidaires en petits groupes féminins en Afrique (Sénégal, Maroc, Tanzanie, Kenya, etc.).  
La plateforme web assure :
- La présentation de l'expérience et du programme jour par jour.
- L'encaissement sécurisé (Acompte 30%, Paiement total, Klarna 3x/4x).
- Le recueil des consentements légaux et des impératifs de santé.
- La traçabilité intégrale de chaque dossier.

### 1.2 Cartographie des Rôles
- **Coordinatrice de Séjour :** Suivi des participantes, gestion des alertes d'allergies, validation des attestations d'assurance, animation du groupe WhatsApp.
- **Administrateur Ventes / Finances :** Publication des séjours, ajustement des quotas, validation des paiements hors-ligne, contrôle des échéances de solde (J-45).
- **Responsable Conformité & Système :** Déclenchement de la maintenance RGPD, revue des journaux d'audit, gestion des accès 2FA.

---

## 2. SÉCURITÉ & AUTHENTIFICATION DOUBLE FACTEUR (2FA / MFA)

L'accès à l'espace d'administration (`/admin`) est verrouillé par un mécanisme strict d'authentification à deux facteurs basé sur le standard **TOTP (Time-based One-Time Password)**.

### 2.1 Première Connexion & Activation
1. Rendez-vous sur `https://goldies.vercel.app/admin`.
2. Saisissez votre adresse email et votre mot de passe d'administrateur.
3. Si le 2FA n'est pas encore associé, la plateforme redirige vers `/mfa-setup`.
4. Ouvrez votre application d'authentification sur mobile (**Google Authenticator**, **Microsoft Authenticator** ou **Authy**).
5. Scannez le **QR Code** affiché.
6. Entrez le code à 6 chiffres affiché sur votre mobile pour valider l'association.

### 2.2 Connexion Quotidienne
À chaque ouverture de session :
1. Connexion par Email + Mot de passe.
2. Saisie du code à 6 chiffres éphémère (renouvelé toutes les 30 secondes).

> 💡 **Incident & Dépannage (Perte de téléphone) :**  
> Si un administrateur change de smartphone ou perd son accès 2FA, un co-administrateur ou le responsable technique doit réinitialiser le facteur TOTP dans l'interface Supabase Auth. L'utilisateur pourra alors ré-enrôler son nouvel appareil.

---

## 3. MODULE 1 : GESTION DU CATALOGUE DES VOYAGES (TRIPS)

Accessible via l'onglet **« Gestion des Voyages »**.

### 3.1 Créer ou Modifier un Voyage
Cliquez sur **« Nouveau voyage »** ou sur l'icône **Crayon ✏️** :
- **Nom du voyage :** Titre attractif (ex: *« Sénégal – Immersion & Solidarité »*).
- **Destination :** Pays de destination.
- **Prix (€) :** Montant TTC par personne (ex: `1350`).
- **Dates & Durée :** Texte clair (ex: *« 15 – 22 Octobre 2026 »*) et durée (ex: *« 8 jours / 7 nuits »*).
- **Places Disponibles (Capacité) :** Quota de participantes (ex: `12`).
- **Tag du voyage :**
  - `Disponible` : Voyage ouvert aux inscriptions.
  - `Bientôt` : Voyage en préparation (non réservable).
  - `Complet` : Voyage complet (bascule auto en liste d'attente).
- **Programme jour par jour :** Découpage avec titre et description pour chaque journée.
- **Photos & Couverture :** Image principale et galerie d'illustration.
- **Liens Stripe sécurisés :**
  - *Lien principal / Klarna :* `https://buy.stripe.com/...` (Paiement 100% ou plusieurs fois).
  - *Lien Acompte (30%) :* `https://buy.stripe.com/...` (Acompte de réservation).

### 3.2 Règles de Gestion Métier Clés

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ RÈGLE ANTI-SUPPRESSION DES VOYAGES (SOFT-DELETE)                                    │
│ Si un voyage possède au moins 1 réservation liée, le système INTERDIT sa suppression   │
│ définitive de la base de données.                                                      │
│ Si vous tentez de le supprimer, le système le DÉSACTIVE automatiquement (archivé)      │
│ pour le masquer du site public sans détruire les dossiers clientes.                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 🎟️ RÈGLE DE BASCULE AUTOMATIQUE EN LISTE D'ATTENTE                                     │
│ Lorsque le quota de places payées atteint la capacité max (ou tag mis sur "Complet"),  │
│ le bouton public se transforme automatiquement en « Rejoindre la liste d'attente ».    │
│ Les clientes peuvent s'inscrire sans payer pour être rappelées en cas de désistement.  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. MODULE 2 : INSCRIPTIONS & PARCOURS FINANCIER (BOOKINGS)

Accessible via l'onglet **« Inscriptions & Contacts »**.

### 4.1 Suivi des Dossiers Clientes
Le tableau répertorie l'ensemble des clientes inscrites avec filtres par voyage et par mode de règlement.

- **Modes de Paiement Disponibles :**
  - `Acompte` (Bleu) : La voyageuse a versé 30% du prix.
  - `Plusieurs fois` (Violet) : Financement Stripe / Klarna (3x ou 4x sans frais).
  - `Totalité` (Vert) : Règlement intégral au comptant.
- **Statut de Paiement :**
  - `Non payé` (Orange) : Formulaire soumis, paiement en attente.
  - `Payé` (Vert) : Paiement validé.

### 4.2 Snapshot de Prix & Échéancier à J-45
- **Prix Figé (Snapshot) :** La colonne affiche `Prix figé : XXX €`. Même si le prix public du séjour change ultérieurement, la cliente conserve le montant contractuel exact souscrit.
- **Date Limite de Solde (J-45) :** Pour les clientes ayant choisi l'acompte, le système calcule et affiche automatiquement l'échéance :  
  `Date Limite Solde = Date de départ - 45 jours`  
  *Exemple : Pour un départ le 15 Octobre, la date limite affichée est le 31 Août.*

---

## 5. MODULE 3 : VIGILANCE VOYAGEUSES & SANTÉ (DUTY OF CARE)

### 5.1 Détection Automatique des Alertes Médicales
Le système scanne le champ allergies en temps réel. S'il contient des mots-clés à risque (*arachide, cacahuète, gluten, asthme, diabète, femme enceinte, cardiaque, épilepsie, allergie sévère*), le dossier déclenche un badge rouge clignotant :

`Alerte Médicale 🚨` ➔ *(Cliquer après action)* ➔ `Alerte Traitée ✅`

**Procédure à suivre par la Coordinatrice :**
1. Prendre contact téléphonique ou par email avec la voyageuse.
2. Renseigner les fiches de préparation pour les hébergements et cuisiniers locaux.
3. Cliquer sur le badge pour passer l'alerte à l'état `Alerte Traitée ✅`.

### 5.2 Contrôle de l'Assurance Rapatriement
- Badge `Attestation requise ⏳` : La cliente n'a pas encore fourni sa police d'assistance.
- Dès réception du document : Cliquer sur le badge pour le passer en `Attestation OK ✅`.
- **Règle d'or :** Aucune voyageuse n'est autorisée à embarquer sans assurance validée.

---

## 6. MODULE 4 : TRAÇABILITÉ & JOURNAL D'AUDIT IMMUABLE

Accessible via le sous-onglet **« Journal d'Audit »**.

Chaque événement génère une trace horodatée infalsifiable contenant :
- L'action effectuée (`BOOKING_SUBMITTED`, `PAYMENT_STATUS_UPDATED`, `TRIP_CREATED`, `MEDICAL_ALERT_ACK_TOGGLED`, etc.).
- L'auteur de l'action (Adresse email de l'administrateur connecté).
- L'identifiant de l'entité concernée.
- Les détails techniques sous format JSON.

---

## 7. MODULE 5 : CONFORMITÉ & MAINTENANCE RGPD

### 7.1 Cycle Légal de Conservation des Données

| Donnée | Durée Maximale | Action Système |
| :--- | :--- | :--- |
| **Contacts / Prospects** | 3 ans sans interaction | Suppression définitive |
| **Réservations abandonnées** | 90 jours | Suppression définitive |
| **Données médicales / Santé** | 1 an post-séjour | Purge du champ (`[PURGÉ_RGPD]`) |
| **Factures & Contrats** | 10 ans (Code de commerce) | Anonymisation irréversible post-10 ans |

### 7.2 Bouton « Maintenance RGPD »
En haut à droite de l'onglet Inscriptions, le bouton **« Maintenance RGPD »** permet d'exécuter la purge réglementaire en un clic. Un rapport s'affiche avec le décompte exact des éléments traités.

---

## 8. MODULE 6 : GALERIE PHOTOS & PREUVE SOCIALE

Accessible via l'onglet **« Galerie & Albums »**.
- **Création d'album :** Renseigner le titre et la destination.
- **Téléversement de photos :** Glisser-déposer des images HD.
- **Règle Droit à l'Image :** Ne publier que les photos des participantes ayant coché l'autorisation optionnelle lors de leur réservation.

---

## 9. GUIDE DE RÉSOLUTION DES PROBLÈMES FRÉQUENTS (TROUBLESHOOTING)

| Incident Opérationnel | Cause Probable | Solution Pas-à-Pas |
| :--- | :--- | :--- |
| **Paiement reçu par virement bancaire externe** | La cliente a payé hors Stripe. | Aller dans *Inscriptions*, chercher la cliente et cliquer sur le badge pour passer à `Payé`. |
| **Impossible de supprimer un voyage test** | Des réservations existent sur ce voyage. | Le système protège les données par *Soft-Delete*. Supprimer les réservations de test si nécessaire. |
| **Le voyage est complet mais affiche 'Réserver'** | Le tag n'a pas été mis à jour. | Dans *Gestion des Voyages*, modifier le tag en `Complet` ou ajuster la capacité `qte`. |
| **Une cliente signale une allergie tardivement** | Non précisé à l'inscription. | Contacter immédiatement l'équipe locale pour adapter la logistique du séjour. |
| **Lien Stripe refusé à la sauvegarde** | Format d'URL invalide. | S'assurer que le lien commence par `https://buy.stripe.com/` ou `https://checkout.stripe.com/`. |

---

## 10. CHECK-LISTS OPÉRATIONNELLES DE L'ADMINISTRATEUR

### 🌅 Routine Quotidienne (5 min)
- [ ] Consulter le Tableau de Bord (nouveaux paiements et CA encaissé).
- [ ] Répondre aux nouveaux messages de contact sous 24h.
- [ ] Traiter les nouvelles alertes médicales signalées en rouge.

### 🗓️ Routine Avant-Départ (J-45, J-30, J-7)
- [ ] **À J-45 :** Relancer les clientes en formule Acompte pour le paiement du solde restant.
- [ ] **À J-30 :** Valider les attestations d'assurance (passer à `Attestation OK`).
- [ ] **À J-15 :** Transmettre la liste consolidée des régimes et allergies aux chefs et guides sur place.
- [ ] **À J-7 :** Intégrer les participantes confirmées au groupe WhatsApp dédié.

### 🧹 Routine Mensuelle RGPD
- [ ] Cliquer sur **« Maintenance RGPD »** pour purger les anciens prospects et réservations abandonnées.
- [ ] Consulter le **Journal d'Audit** pour contrôler l'intégrité des opérations.

---

*Document produit pour Goldies Travel — Tous droits réservés.*
