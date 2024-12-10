# Exigences Fonctionnelles du projet ara
## Compte Utilisateur
**Nouveau Compte**

1. L'application doit permettre aux utilisateurs de créer un nouveau compte en utilisant des informations de base, un email (tous les emails sont uniques) et un mot de passe.
2. L'application doit désactiver tous les nouveaux comptes créés jusqu'à ce qu'ils soient vérifiés.
3. L'application doit envoyer un email avec un lien pour confirmer le nouveau compte utilisateur.
4. Un utilisateur ne doit pouvoir se connecter à l'application qu'après avoir vérifié un nouveau compte.

5. **Connexion**
1. L'application doit permettre aux utilisateurs de saisir un email et un mot de passe pour se connecter.
2. Si la MFA est configurée, l'application doit demander un code QR après avoir saisi un email et un mot de passe corrects.
3. Après 6 tentatives de connexion échouées, le compte utilisateur doit être verrouillé pendant 15 minutes (atténuer les attaques par force brute).
4. Après un nombres definis de jours, le mot de passe de l'utilisateur doit expirer, il ne peut donc pas se connecter tant que le mot de passe n'est pas mis à jour (rotation des mots de passe).

**Réinitialisation du Mot de Passe**
1. L'application doit permettre aux utilisateurs de réinitialiser leur mot de passe.
2. L'application doit envoyer un lien à l'email des utilisateurs pour réinitialiser leur mot de passe (le lien devient invalide après avoir été cliqué).
3. L'application doit présenter un écran avec un formulaire pour réinitialiser le mot de passe lorsque le lien est cliqué.
4. Si un mot de passe est réinitialisé avec succès, l'utilisateur doit pouvoir se connecter en utilisant le nouveau mot de passe.
5. L'application doit permettre aux utilisateurs de réinitialiser leur mot de passe autant de fois qu'ils en ont besoin.

**MFA (Authentification Multi-Facteurs)**
1. L'application doit permettre aux utilisateurs de configurer l'Authentification Multi-Facteurs pour sécuriser leur compte.
2. L'Authentification Multi-Facteurs doit utiliser un code QR sur le téléphone mobile des utilisateurs.
3. L'application doit permettre aux utilisateurs de scanner un code QR à l'aide d'une application d'authentification sur leur téléphone pour configurer l'Authentification Multi-Facteurs.
4. L'application doit demander aux utilisateurs de saisir le code QR de leur application d'authentification mobile pour se connecter avec succès.

**Profil**
1. L'application doit permettre aux utilisateurs de mettre à jour leurs informations de base lorsqu'ils sont connectés.
2. L'application doit permettre aux utilisateurs de mettre à jour leur mot de passe lorsqu'ils sont connectés.
3. L'application doit permettre aux utilisateurs de mettre à jour les paramètres de leur compte lorsqu'ils sont connectés.
4. L'application doit permettre aux utilisateurs de mettre à jour leur photo de profil lorsqu'ils sont connectés.

## Gestion des Documents

**Liste des Documents**
1. L'application doit afficher une liste de tous les documents téléchargés sur la page d'accueil.
2. L'application doit afficher certains détails (nom, taille, propriétaire, type, etc.) de chaque document dans la liste.
3. L'application doit permettre aux utilisateurs connectés de télécharger de nouveaux documents.
4. L'application doit avoir une pagination pour la liste des documents.
5. L'application doit permettre de définir le nombre de documents à afficher par page.
6. L'application doit permettre de rechercher des documents par nom (le résultat doit également inclure la pagination).
7. L'application doit permettre de cliquer sur un document pour voir plus de détails.

**Détails du Document**
1. L'application doit afficher les détails d'un document lorsqu'il est cliqué.
2. Les détails du document doivent inclure le propriétaire du document.
3. L'application doit permettre de mettre à jour le nom et la description d'un document (dans la page de détail).
4. L'application doit permettre de télécharger un document (dans la page de détail).
5. L'application doit permettre de supprimer le document (dans la page de détail).
6. Contrôle d'Accès

**Rôle Utilisateur**
1. L'application doit attribuer des rôles aux utilisateurs.
2. Les rôles de l'application doivent contenir des permissions spécifiques (autorités).
3. Les rôles de l'application doivent accorder différents niveaux d'accès.
4. L'application doit permettre uniquement aux utilisateurs ayant les rôles appropriés de pouvoir effectuer certaines actions.
5. L'application doit permettre uniquement aux utilisateurs non-rôles utilisateur de mettre à jour les paramètres du compte.
6. L'application doit permettre uniquement aux utilisateurs non-rôles utilisateur de mettre à jour les rôles des comptes.
7. L'application doit permettre uniquement aux utilisateurs ayant la permission de "supprimer" des documents de supprimer des documents.
8. L'application doit permettre uniquement aux utilisateurs non-rôles utilisateur de voir les autres utilisateurs du système.

**Piste d'Audit**
1. L'application doit garder une trace de qui a créé une entité (utilisateur, document, etc.).
2. L'application doit garder une trace du moment où une entité (utilisateur, document, etc.) a été créée.
3. L'application doit garder une trace de qui a mis à jour une entité (utilisateur, document, etc.).
4. L'application doit garder une trace du moment où une entité (utilisateur, document, etc.) a été mise à jour.**