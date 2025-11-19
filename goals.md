# Fonctionnalités

## Inscription et connexion
On peut se créer un compte (sans mail pour l'exercice) qui comporte :
- Un pseudo
- Un mot de passe
L'appli demande donc d'être connecté pour accéder à ses objectifs
```json
{
  user_id: 164568                                             // Identifiant unique de l'utilisateur
  username: "EpicUser1234",                                   // Pseudo de l'utilisateur (doit être unique)
  pwd_hash: "a1f228756c978cec68b73517ea979cdc68fffda83..."    // Mot de passe (hashé) de l'utilisateur
}
```

### Modifier son profil
L'utilisateur pourra choisir un autre pseudo (unique)

## Objectifs

### - Ajouter un objectif
On pourra ajouter un objectif avec temps et intitulé
```json
{
  goal_id: 456852134,         // Identifiant unique de l'objectif
  title: "titre",             // Intitulé de l'objectif
  owner: 154153               // L'user_id du propriétaire de l'objectif
  start_date: "2024-12-12",   // Date de début de l'objectif
  goal_time: 31536000,        // Temps total programmé pour l'objectif
  progress: 26524800,         // Progression actuelle de l'utilisateur
}
```

#### - Avancer un objectif
Les objectifs avancent tous seuls quand ils sont chargés par le serveur qui calcule cette propriété avant de les envoyer au client

#### - Réinitialiser un objectif
On pourra réinitialiser l'objectif avec un bouton (si on l'a échoué mais qu'on veut réessayer par exemple)
```json
{
  reset_date: "2025-10-15",   // On rajoute reset_date, qui prendra désormais le dessus sur start_date pour calculer la progression. 
                              // Par défaut (quand l'objectif est créé) reset_date est égal à start_date
  progress: 0,                // progress est donc remis à 0
  // resets: 1                // On pourrait envisager un compteur de réinitialisations mais ce n'est pas très motivant...
}
```

#### - Compléter un objectif
Les objectifs sont marqués comme complétés lorsqu'ils sont arrivés à leur date limite
- On peut alors les passer dans une section "objectif complétés"
```json
{
  complete: true,             // On rajoute complete qui permet tout simplement de marquer l'objectif comme complété.
                              // On ignorera ces objectifs pendant le calcul de la progression pour gagner du temps de calcul côté serveur
}
```

### - Supprimer un objectif
On pourra supprimer un objectif

### - Modifier un objectif
On pourra modifier l'intitulé et la durée de l'objectif

### - Créer un objectif "infini"
On pourra créer un objectif sans date limite, qui compte simplement les jours depuis sa création/réinitialisation
```json
{
  type: 1,                    // On rajoute une propriété "type" à nos objectifs. 0 comporte une date limite, 1 n'en a pas.
  goal_time: 0                // goal_time est donc égal à 0
}
```

### - Rallonger un objectif complété
On pourra, lorsqu'on complète un objectif, choisir de le rallonger (en rajoutant 30 jours par exemple)
