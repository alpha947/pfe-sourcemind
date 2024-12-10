# React + TypeScript + Vite

# pour executer le projet ara_front_end, veuillez suivre le tutoriel suivant

Ce modèle fournit une configuration minimale pour faire fonctionner React dans Vite avec HMR et quelques règles ESLint.

Actuellement, deux plugins officiels sont disponibles :

@vitejs/plugin-react utilise Babel pour le rafraîchissement rapide
@vitejs/plugin-react-swc utilise SWC pour le rafraîchissement rapide
Expansion de la configuration ESLint
Si vous développez une application de production, nous recommandons de mettre à jour la configuration pour activer les règles de linting sensibles aux types :

Configurez la propriété parserOptions au niveau supérieur comme ceci :
js
Copier le code
export default {
// autres règles...
parserOptions: {
ecmaVersion: "latest",
sourceType: "module",
project: ["./tsconfig.json", "./tsconfig.node.json"],
tsconfigRootDir: \_\_dirname,
},
};
Remplacez plugin:@typescript-eslint/recommended par plugin:@typescript-eslint/recommended-type-checked ou plugin:@typescript-eslint/strict-type-checked
Ajoutez éventuellement plugin:@typescript-eslint/stylistic-type-checked
Installez eslint-plugin-react et ajoutez plugin:react/recommended et plugin:react/jsx-runtime à la liste des extends

Exigences Fonctionnelles de l'Application Cliente
Authentification et Gestion des Comptes
Création de Compte
L'application cliente doit permettre aux utilisateurs de créer un nouveau compte en utilisant des informations de base, un email (tous les emails sont uniques) et un mot de passe.
L'application cliente doit afficher un message indiquant que le compte est désactivé jusqu'à vérification.
L'application cliente doit afficher une notification lorsque l'email de confirmation est envoyé.
L'application cliente doit rediriger l'utilisateur vers la page de connexion après la vérification du compte.
Connexion
L'application cliente doit permettre aux utilisateurs de saisir leur email et leur mot de passe pour se connecter.
Si la MFA est configurée, l'application cliente doit demander à l'utilisateur de scanner un code QR après avoir saisi son email et son mot de passe.
L'application cliente doit afficher un message d'erreur après 6 tentatives de connexion échouées et indiquer que le compte est verrouillé pendant 15 minutes.
L'application cliente doit informer l'utilisateur que son mot de passe a expiré après 90 jours et le rediriger vers la page de mise à jour du mot de passe.
Réinitialisation du Mot de Passe
L'application cliente doit permettre aux utilisateurs de demander une réinitialisation de mot de passe en entrant leur email.
L'application cliente doit afficher une notification lorsque le lien de réinitialisation est envoyé par email.
L'application cliente doit rediriger l'utilisateur vers un formulaire de réinitialisation du mot de passe après avoir cliqué sur le lien.
L'application cliente doit afficher un message de confirmation lorsque le mot de passe est réinitialisé avec succès et rediriger l'utilisateur vers la page de connexion.
Authentification Multi-Facteurs (MFA)
L'application cliente doit permettre aux utilisateurs de configurer la MFA en scannant un code QR avec une application d'authentification mobile.
L'application cliente doit afficher un champ pour entrer le code généré par l'application d'authentification lors de la connexion.
Profil Utilisateur
L'application cliente doit permettre aux utilisateurs de mettre à jour leurs informations de base lorsqu'ils sont connectés.
L'application cliente doit permettre aux utilisateurs de changer leur mot de passe lorsqu'ils sont connectés.
L'application cliente doit permettre aux utilisateurs de modifier les paramètres de leur compte.
L'application cliente doit permettre aux utilisateurs de changer leur photo de profil.
Gestion des Documents
Liste des Documents
L'application cliente doit afficher une liste de tous les documents téléchargés sur la page d'accueil.
L'application cliente doit afficher des détails tels que le nom, la taille, le propriétaire et le type de chaque document dans la liste.
L'application cliente doit permettre aux utilisateurs connectés de télécharger de nouveaux documents.
L'application cliente doit inclure une pagination pour la liste des documents.
L'application cliente doit permettre aux utilisateurs de définir le nombre de documents à afficher par page.
L'application cliente doit permettre de rechercher des documents par nom et afficher les résultats avec pagination.
L'application cliente doit permettre de cliquer sur un document pour voir plus de détails.
Détails du Document
L'application cliente doit afficher les détails d'un document lorsqu'il est sélectionné, y compris le propriétaire du document.
L'application cliente doit permettre de mettre à jour le nom et la description d'un document.
L'application cliente doit permettre de télécharger un document.
L'application cliente doit permettre de supprimer un document.
Contrôle d'Accès
Rôle Utilisateur
L'application cliente doit afficher les rôles des utilisateurs et leurs permissions spécifiques.
L'application cliente doit permettre uniquement aux utilisateurs ayant les rôles appropriés d'effectuer certaines actions.
L'application cliente doit empêcher les utilisateurs sans les rôles appropriés de modifier les paramètres du compte et les rôles des autres utilisateurs.
L'application cliente doit permettre uniquement aux utilisateurs ayant la permission de "supprimer" des documents de les supprimer.
L'application cliente doit permettre uniquement aux utilisateurs non-rôles utilisateur de voir les autres utilisateurs du système.
Piste d'Audit
L'application cliente doit afficher une trace des actions des utilisateurs, y compris qui a créé ou mis à jour une entité (utilisateur, document, etc.) et quand cela a été fait.
