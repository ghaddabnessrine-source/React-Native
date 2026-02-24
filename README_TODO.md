# Application Todo List

Une application mobile simple pour gérer vos tâches quotidiennes. Parfait pour les débutants qui veulent apprendre React Native !

## Comment Lancer l'Application

1. **Ouvrez le terminal** et naviguez vers le dossier :
   
   cd my-app
   

2. **Installez les dépendances** :
   
   npm install
   

3. **Lancez l'application** :
   
   npm start
  

4. **Choisissez votre plateforme** :
   - Appuyez sur `i` pour iOS
   - Appuyez sur `a` pour Android  
   - Appuyez sur `w` pour le navigateur web

## Fonctionnalités Principales

### Fonctions de Base
- **Ajouter une tâche** - Entrez un titre et description
- **Voir toutes les tâches** - Liste scrollable de vos tâches
- **Cocher une tâche** - Marquez comme terminée
- **Modifier une tâche** - Changez les détails
- **Supprimer une tâche** - Enlevez les tâches inutiles

### Fonctionnalités Bonus
- **Mode Sombre** - Basculez entre clair/sombre avec le bouton
- **Barre de Recherche** - Trouvez rapidement vos tâches
- **Catégories** - Organisez (Personnel, Travail, Courses, Santé)
- **Priorités** - Faible, Moyenne, Haute avec couleurs
- **Dates d'échéance** - Ajoutez des dates limites à vos tâches
- **Rappels** - Configurez des rappels avant l'échéance
- **Alertes de retard** - Tâches en retard signalées en rouge
- **Notifications** - Messages de confirmation
- **Animations** - Transitions fluides et interactions

## Structure des Fichiers

```
my-app/
├── app/
│   └── (tabs)/
│       └── index.tsx          # Écran principal
├── components/
│   └── TodoList.js           # Composant principal de la liste
├── services/
│   └── simpleTaskStorage.js # Service de stockage
└── types/
    └── task.js              # Modèle de données des tâches
```

## Comment Ça Marche 

### Les Composants Principaux

#### **Modèle de Tâche (`types/task.js`)**
- Définit ce qu'est une tâche (titre, description, catégorie, etc.)
- **NOUVEAU** : Gère les dates d'échéance et rappels
- Contient les catégories, priorités et options de rappel
- Fonctions utiles pour vérifier si une tâche est en retard

#### **Service de Stockage (`services/simpleTaskStorage.js`)**
- Sauvegarde vos tâches localement
- Fonctions pour ajouter, modifier, supprimer des tâches
- Utilise le stockage local du téléphone

#### **Composant Principal (`components/TodoList.js`)**
- Interface utilisateur complète et simplifiée
- **NOUVEAU** : Modal d'ajout compact avec boutons rapides
- Gère tous les boutons et interactions
- Affiche les notifications et animations

### Le Flux de Données

1. **Utilisateur ajoute une tâche** → `TodoList.js`
2. **Appelle le service** → `simpleTaskStorage.js`  
3. **Sauvegarde localement** → Téléphone/navigateur
4. **Met à jour l'affichage** → `TodoList.js`

### Le Styling

- **StyleSheet** : Crée des styles pour chaque élément
- **Mode sombre** : Styles différents pour clair/sombre
- **Animations** : Utilise `Animated` pour les transitions
- **NOUVEAU** : Styles pour tâches en retard et dates d'échéance

## Technologies Utilisées

- **React Native** - Pour créer l'application mobile
- **Expo** - Pour simplifier le développement
- **JavaScript** - Le langage de programmation
- **AsyncStorage** - Pour sauvegarder les données

## Comment Utiliser l'Application

### Ajouter une Tâche
1. Cliquez sur le bouton bleu "+ Add Task"
2. Entrez un titre (obligatoire, max 50 caractères)
3. Ajoutez une description (optionnel, max 200 caractères)
4. **NOUVEAU** : Cliquez sur "Date" pour choisir une échéance
5. **NOUVEAU** : Cliquez sur "Rappel" pour configurer un rappel
6. Choisissez une catégorie et priorité
7. Cliquez sur "Ajouter"

### Gérer les Tâches
- **Cocher** : Touchez la case à cocher
- **Modifier** : Touchez "Edit"
- **Supprimer** : Touchez "Delete"

### Rechercher et Filtrer
- **Rechercher** : Utilisez la barre de recherche
- **Filtrer** : Touchez les boutons de catégorie

### Mode Sombre
- **Basculez** : Touchez l'icône en haut

### Dates d'Échéance et Rappels
- **Ajouter une date** : Cliquez sur "Date" dans le formulaire
- **Options de date** : Aujourd'hui, Demain, Cette semaine
- **Configurer un rappel** : Cliquez sur "Rappel"
- **Options de rappel** : Aucun, 1 heure avant, 1 jour avant
- **Tâches en retard** : S'affichent automatiquement en rouge

## Conseils pour Débutants

### Problèmes Communs

**L'application ne démarre pas**
- Vérifiez que vous êtes dans le bon dossier (`cd my-app`)
- Assurez-vous d'avoir installé Node.js

**Le mode sombre ne fonctionne pas**
- Sur mobile : Changez les paramètres système
- Sur web : Changez les paramètres de votre navigateur
- Ou utilisez le bouton☀️/🌙 dans l'app

**La page d'ajout est trop chargée**
- **Déjà résolu** : L'interface est maintenant simplifiée
- Boutons rapides pour date et rappel
- Moins de champs et plus compact

### Personnalisation

**Changer les couleurs**
- Modifiez les styles dans `TodoList.js`
- Cherchez les styles comme `taskItem` ou `addButton`

**Ajouter des catégories**
- Éditez `types/task.js`
- Ajoutez à `TaskCategories`

**Changer les animations**
- Modifiez les valeurs dans `Animated.timing`
- Changez `duration` et `delay`

**Ajouter des options de rappel**
- Éditez `types/task.js`
- Ajoutez à `ReminderTimes`



