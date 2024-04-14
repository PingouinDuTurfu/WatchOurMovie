# WatchOurMovie

Ce projet a pour but de créer une recherche de films en se basant sur la base de données de [TMDB](https://www.themoviedb.org/?language=fr) en y ajoutant un système de cache afin de limiter les requêtes. De plus, il ajoute une fonctionnalité de recherche personnalisée et un système de groupes.

# Technologies Utilisées
- **Frontend** : **React** - Permet à l'utilisateur une interface rapide et facile à utiliser.
- **Database manager** : **Node.js** - Crée une couche d'abstraction pour les appels à TMDB, contient également le cache des requêtes/films stockés dans une base de données locale (MongoDB).
- **Auth provider** : **Node.js** - Crée des tokens JWT pour sécuriser la connexion.
- **API** : **Python** - Lie le frontend, le l'auth provider et le db manager entre eux.

# Schéma de l'Infrastructure

# Notre Groupe

- **LANTA Axel**
- **LEANG Ameilie**
- **OLLIVIER Rémy**
- **SALL Marieme**
- **Configuration**
- **Fichier .env**

# Configuration
### Créez le fichier .env à la racine du répertoire avec le contenu suivant :

```
TMDB_API_KEY=

MONGO_PORT=27017
AUTH_PORT=3000
DB_MANAGER_PORT=3001
LOG_PORT=3002
MOVIE_PORT=3003
API_PORT=3004

JWT_SECRET=4b8e08f2c3a4d5e6f7101234567890abcdef1234567890abcdef1234567890ab

MONGO_URL=mongodb
MONGO_DATABASE=wom
MONGO_USER=root
MONGO_PASSWORD=motdepasse

MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=motdepasse
MONGO_INITDB_DATABASE=wom
```
### Note : N'oubliez pas de remplacer `TMDB_API_KEY` par votre propre clé d'API TMDB.