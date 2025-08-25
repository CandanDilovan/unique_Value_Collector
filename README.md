Collecteur de Valeurs Uniques pour Grist

Le Collecteur de Valeurs Uniques est un widget personnalisé pour Grist
 qui permet de copier ou de synchroniser des valeurs uniques d’une table vers une autre. Il simplifie les flux de travail où tu dois t’assurer que les colonnes de référence, champs de recherche ou autres ensembles de données partagent les mêmes valeurs cohérentes.

🚀 Fonctionnalités

Collecte des valeurs uniques depuis une colonne source et les copie dans une colonne de destination.

Deux modes d’utilisation flexibles :

Synchronisation colonne-à-colonne – associer les colonnes ayant le même nom entre deux tables.

Mappage personnalisé – choisir la table source et la table de destination, puis spécifier les colonnes exactes utilisées pour la collecte.

Supprime automatiquement les doublons.

Fonctionne directement dans tes documents Grist.

🔧 Modes d’utilisation
1. Synchronisation colonne-à-colonne

Choisis la table source et la table de destination.

Sélectionne une colonne qui existe dans les deux tables avec exactement le même nom.

Le widget collectera toutes les valeurs uniques de la colonne source et s’assurera qu’elles existent dans la colonne de destination.

✅ Idéal pour : garder des valeurs cohérentes entre plusieurs tables de référence ou de recherche.

2. Mappage personnalisé

Choisis une table source et une table de destination.

Indique la colonne source depuis laquelle collecter les valeurs.

Indique la colonne de destination dans laquelle insérer ces valeurs.

✅ Idéal pour : des flux de travail plus complexes où les noms de colonnes diffèrent entre tables.

📖 Exemple

Imaginons que tu aies :

Table A avec une colonne Catégorie

Table B avec une colonne Catégorie (ou Type si tu utilises le mappage personnalisé)

Le widget garantit que toutes les catégories définies dans Table A existent aussi dans Table B, sans doublons.

🛠️ Installation & configuration

Ajoute le widget Collecteur de Valeurs Uniques dans ton document Grist.

Configure-le en choisissant :

La table et la colonne source

La table et la colonne de destination

Le mode d’utilisation (colonne-à-colonne ou mappage personnalisé)

Lance le collecteur pour copier les valeurs uniques.

⚡ Remarques

Si la colonne de destination contient déjà des valeurs, le widget ajoute seulement les valeurs manquantes (aucun doublon créé).

Fonctionne principalement avec les colonnes textuelles (ID, noms, catégories, etc.).

Pour de grands ensembles de données, la première synchronisation peut prendre un peu de temps.

widget url :https://candandilovan.github.io/unique_Value_Collector/
