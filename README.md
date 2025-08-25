Collecteur de Valeurs Uniques pour Grist

Le Collecteur de Valeurs Uniques est un widget personnalisé pour Grist
 qui permet de copier ou de synchroniser des valeurs uniques d’une table vers une autre. Il simplifie les flux de travail où tu dois t’assurer que les colonnes de référence, champs de recherche ou autres ensembles de données partagent les mêmes valeurs cohérentes.

🚀 Fonctionnalités

- Collecte des valeurs uniques depuis une colonne source et les copie dans une colonne de destination.
- Deux modes d’utilisation flexibles :
  1. Synchronisation colonne-à-colonne – associer les colonnes ayant le même nom entre deux tables.
  2. Mappage personnalisé – choisir la table source et la table de destination, puis spécifier les colonnes exactes utilisées pour la collecte.
- Supprime automatiquement les doublons.
- Fonctionne directement dans tes documents Grist.

🔧 Modes d’utilisation
1. Synchronisation colonne-à-colonne

 - Choisis la table source et la table de destination.
 -Sélectionne une colonne qui existe dans les deux tables avec exactement le même nom.
 - Le widget collectera toutes les valeurs uniques de la colonne source et s’assurera qu’elles existent dans la colonne de destination.

✅ Idéal pour : garder des valeurs cohérentes entre plusieurs tables de référence ou de recherche.

2. Création de tables de référence (mappage personnalisé)

 - Choisis une table source et une table de destination.
 - La table de destination doit avoir les mêmes noms de colonnes que la table source.
 - Sélectionne une colonne clé sur laquelle se fera le tri et la suppression des doublons.
 - Le widget remplit alors la colonne visée avec uniquement les valeurs uniques issues de la colonne clé.
 - Les autres colonnes sont copiées telles quelles, même si elles contiennent des doublons.

✅ Idéal pour : générer automatiquement des tables de référence à partir de tables complexes


🛠️ Installation & configuration


- Ajoute le widget avec l'url https://candandilovan.github.io/unique_Value_Collector/
- Donner l'accès complet au document
- Dupliquer la table source visée sans les données pour l'utiliser avec le widget
