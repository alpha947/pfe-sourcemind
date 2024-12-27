Bien sûr ! Adaptant votre demande, nous allons créer une application React avec TypeScript qui se connecte en temps réel à App A, affiche l'état de l'alimentation électrique avec des indicateurs visuels (vert pour courant allumé, rouge pour coupure de courant, et gris pour inactif) et émet un son d'alerte en cas de coupure. De plus, l'application détectera l'inactivité de App A et affichera un message approprié.

Étapes à Suivre
Créer l'Application React avec TypeScript
Installer les Dépendances Nécessaires 

Configurer la Connexion WebSocket
Créer le Composant Principal avec Indicateur et Alerte Sonore
Gérer l'Inactivité de App A
Styliser l'Interface Utilisateur
Tester l'Application
Déployer et Accéder depuis d'Autres Machines
1. Créer l'Application React avec TypeScript
Nous allons utiliser Create React App avec le template TypeScript pour initialiser rapidement notre projet.

a. Installer Node.js et npm
Assurez-vous d'avoir Node.js et npm installés sur votre machine. Vous pouvez vérifier leur installation en exécutant :

bash
Copier le code
node -v
npm -v
b. Initialiser le Projet React
Ouvrez votre terminal et exécutez les commandes suivantes :

bash
Copier le code
npx create-react-app front-ui --template typescript
cd front-ui
Cela créera un nouveau projet React nommé power-status-monitor avec TypeScript et vous y déplacera.

2. Installer les Dépendances Nécessaires
Nous allons utiliser SockJS et Stomp.js pour faciliter la communication WebSocket avec App A.

a. Installer SockJS et Stomp.js
Exécutez la commande suivante pour installer sockjs-client et stompjs :

bash
Copier le code
npm install sockjs-client stompjs
b. Installer les Types pour SockJS et Stomp.js (si disponibles)
Certaines bibliothèques JavaScript n'ont pas de types TypeScript intégrés. Pour sockjs-client et stompjs, il n'y a pas de types officiels maintenus, mais nous pouvons créer des déclarations de modules personnalisées pour éviter les erreurs TypeScript.

Créez un fichier src/types/stompjs.d.ts et ajoutez les déclarations suivantes :

typescript
Copier le code
// src/types/stompjs.d.ts
declare module 'stompjs' {
  export interface StompConfig {
    /**
     * If true, use the SockJS fallback options
     */
    debug?: (str: string) => void;
    /** The websocket url or stomp endpoint */
    brokerURL?: string;
    /** Stomp connection headers */
    connectHeaders?: { [key: string]: string };
    /** How often to heartbeat */
    heartbeatIncoming?: number;
    heartbeatOutgoing?: number;
    /** Reconnect delay (in milliseconds) */
    reconnect_delay?: number;
    /** If this option is true, the Stomp client will fail to connect instead of retrying. */
    debugEnabled?: boolean;
  }

  export interface StompSubscription {
    id: string;
    unsubscribe: () => void;
  }

  export interface StompSession {
    subscribe: (
      destination: string,
      callback: (message: StompMessage) => void,
      headers?: { [key: string]: string }
    ) => StompSubscription;
    send: (
      destination: string,
      headers?: { [key: string]: string },
      body?: string
    ) => void;
    disconnect: (callback?: () => void) => void;
  }

  export interface StompMessage {
    body: string;
    headers: { [key: string]: string };
    command: string;
    ack: () => void;
  }

  export interface StompClient {
    connect: (
      connectHeaders: { [key: string]: string },
      connectCallback: (frame: any) => void,
      errorCallback?: (error: string) => void
    ) => void;
    disconnect: (callback?: () => void) => void;
    subscribe: (
      destination: string,
      callback: (message: StompMessage) => void,
      headers?: { [key: string]: string }
    ) => StompSubscription;
    send: (
      destination: string,
      headers?: { [key: string]: string },
      body?: string
    ) => void;
  }

  export function over(socket: any): StompClient;
}
Créez un fichier src/types/sockjs-client.d.ts et ajoutez :

typescript
Copier le code
// src/types/sockjs-client.d.ts
declare module 'sockjs-client';
Remarque : TypeScript va utiliser ces déclarations de modules personnalisées pour sockjs-client et stompjs.

3. Configurer la Connexion WebSocket
Nous allons créer un service pour gérer la connexion WebSocket et recevoir les messages de App A.

a. Créer le Service WebSocket
Créez un fichier src/services/websocket.ts avec le contenu suivant :

typescript
Copier le code
// src/services/websocket.ts
import SockJS from 'sockjs-client';
import Stomp, { StompSubscription, StompClient, StompMessage } from 'stompjs';

const SOCKET_URL = 'http://192.168.1.10:8080/power-status-websocket'; // Remplacez par l'URL réelle de App A

export const connectWebSocket = (
  onMessageReceived: (message: string) => void,
  onError?: (error: string) => void
): StompClient => {
  const socket = new SockJS(SOCKET_URL);
  const stompClient: StompClient = Stomp.over(socket);

  stompClient.debug = () => {}; // Désactiver les logs de debug

  stompClient.reconnect_delay = 5000; // Tentative de reconnexion toutes les 5 secondes

  stompClient.connect({}, () => {
    stompClient.subscribe('/topic/power-status', (message: StompMessage) => {
      if (message.body) {
        onMessageReceived(message.body);
      }
    });
  }, (error: string) => {
    console.error('Erreur de connexion WebSocket:', error);
    if (onError) {
      onError(error);
    }
  });

  return stompClient;
};
Remarque : Remplacez http://192.168.1.10:8080/power-status-websocket par l'adresse IP et le port corrects de votre App A.

4. Créer le Composant Principal avec Indicateur et Alerte Sonore
Nous allons créer le composant principal qui affichera l'état de l'alimentation et gérera l'alerte sonore.

a. Ajouter le Fichier Audio
Placez votre fichier audio d'alerte, par exemple danger.mp3, dans le répertoire public de votre projet React.

java
Copier le code
power-status-monitor/
├── public/
│   ├── danger.mp3
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   ├── services/
│   │   └── websocket.ts
│   └── types/
│       ├── stompjs.d.ts
│       └── sockjs-client.d.ts
├── package.json
└── ...
b. Modifier App.tsx
Remplacez le contenu de App.tsx par le code suivant :

typescript
Copier le code
// src/App.tsx
import React, { useEffect, useState, useRef } from 'react';
import { connectWebSocket } from './services/websocket';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [powerStatus, setPowerStatus] = useState<'ON' | 'OFF' | 'UNKNOWN'>('UNKNOWN');
  const [isActive, setIsActive] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stompClientRef = useRef<any>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Connecter au WebSocket lors du montage du composant
    stompClientRef.current = connectWebSocket(
      (message: string) => {
        console.log('Message reçu:', message);
        lastUpdateRef.current = Date.now(); // Mettre à jour la dernière mise à jour
        setIsActive(true); // Réactiver l'état actif en cas de réception

        if (message === 'POWER_OFF') {
          setPowerStatus('OFF');
          playAlertSound();
        } else if (message === 'POWER_ON') {
          setPowerStatus('ON');
          stopAlertSound();
        }
      },
      (error: string) => {
        toast.error('Erreur de connexion WebSocket. Tentative de reconnexion...');
      }
    );

    // Nettoyer la connexion WebSocket lors du démontage du composant
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log('Déconnecté du WebSocket');
        });
      }
    };
  }, []);

  useEffect(() => {
    // Configurer un intervalle pour vérifier l'activité toutes les 10 secondes
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastUpdateRef.current;

      if (diff > 60000) { // 60 000 ms = 1 minute
        if (isActive) { // Afficher le toast une seule fois
          setIsActive(false);
          stopAlertSound(); // Arrêter le son si App A est inactive
          setPowerStatus('UNKNOWN'); // Réinitialiser le statut
          toast.error("Client Inactif, veuillez vous rendre sur le site pour vérification");
        }
      }
    }, 10000); // Vérifier toutes les 10 secondes

    // Nettoyer l'intervalle lors du démontage
    return () => clearInterval(interval);
  }, [isActive]);

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Erreur lors de la lecture du son:', error);
      });
    }
  };

  const stopAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getStatusColor = () => {
    switch(powerStatus) {
      case 'ON':
        return 'green';
      case 'OFF':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Surveillance de l'Alimentation</h1>
        {isActive ? (
          <div 
            className="status-indicator" 
            style={{ backgroundColor: getStatusColor() }}
          >
            {powerStatus === 'ON' && 'Courant Allumé'}
            {powerStatus === 'OFF' && 'Coupure de Courant'}
            {powerStatus === 'UNKNOWN' && 'Statut Inconnu'}
          </div>
        ) : (
          <div className="status-indicator inactive">
            Client Inactif,<br />Veuillez vous rendre sur le site pour vérification
          </div>
        )}
        <audio ref={audioRef} src="/danger.mp3" loop />
      </header>
      <ToastContainer />
    </div>
  );
};

export default App;
Explications :

Types d'État : powerStatus est typé pour accepter uniquement 'ON', 'OFF', ou 'UNKNOWN'.
Gestion des Messages WebSocket : Lorsqu'un message est reçu (POWER_ON ou POWER_OFF), l'état est mis à jour et le son d'alerte est géré en conséquence.
Détection d'Inactivité : Un intervalle vérifie toutes les 10 secondes si le dernier message a été reçu il y a plus d'une minute. Si oui, l'état devient inactif.
Toast Notifications : Utilisation de react-toastify pour afficher des notifications d'erreur.
c. Installer react-toastify
Pour les notifications, nous allons utiliser react-toastify. Installez-le en exécutant :

bash
Copier le code
npm install react-toastify
5. Gérer l'Inactivité de App A
L'inactivité est déjà gérée dans le composant App.tsx via un intervalle qui vérifie le temps écoulé depuis le dernier message reçu. Si ce temps dépasse une minute, l'application affiche un message d'inactivité et arrête le son d'alerte.

6. Styliser l'Interface Utilisateur
Nous allons ajouter des styles pour les indicateurs de statut et le message d'inactivité.

a. Modifier App.css
Remplacez le contenu de App.css par le code suivant :

css
Copier le code
/* src/App.css */
.App {
  text-align: center;
  font-family: Arial, sans-serif;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  padding: 40px;
  color: white;
}

.status-indicator {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  transition: background-color 0.5s ease;
}

.status-indicator.inactive {
  background-color: gray;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  height: auto;
  margin: 20px auto;
}
Explications :

Indicateur de Statut : Un cercle coloré qui change de couleur en fonction de l'état (green, red, gray).
Message d'Inactivité : Un indicateur gris avec un message informatif lorsqu'App A est inactive.
7. Tester l'Application
a. Démarrer l'Application React
Dans le terminal, exécutez :

bash
Copier le code
npm start
Cela démarrera l'application React et l'ouvrira dans votre navigateur par défaut à l'adresse http://localhost:3000.

b. Vérifier le Fonctionnement
App A en Fonctionnement : Assurez-vous que App A est en cours d'exécution et qu'elle envoie correctement les messages via WebSocket.
Surveillance en Temps Réel :
Lorsque App A envoie POWER_ON, l'indicateur devrait devenir vert et afficher "Courant Allumé".
Lorsque App A envoie POWER_OFF, l'indicateur devrait devenir rouge, afficher "Coupure de Courant" et le son d'alerte devrait se lancer en boucle.
Inactivité de App A :
Arrêtez App A ou simulez une coupure de communication.
Après une minute sans messages, l'indicateur devrait passer en gris et afficher :
arduino
Copier le code
Client Inactif,
Veuillez vous rendre sur le site pour vérification
Le son d'alerte devrait également s'arrêter si c'était en cours.
c. Simuler des Messages WebSocket (Optionnel)
Si vous souhaitez tester sans dépendre de App A, vous pouvez utiliser des outils comme WebSocket King ou Postman pour envoyer manuellement des messages au WebSocket de App A. Assurez-vous que l'endpoint WebSocket de App A est accessible.

8. Déployer et Accéder depuis d'Autres Machines
Pour rendre l'application accessible depuis d'autres machines sur le réseau, suivez ces étapes :

a. Modifier le Script de Démarrage
Par défaut, Create React App héberge l'application sur localhost. Pour permettre l'accès externe, modifiez le script de démarrage dans package.json.

Installer cross-env

Sous Windows, vous pouvez utiliser cross-env pour définir la variable d'environnement HOST.

bash
Copier le code
npm install cross-env --save-dev
Modifier le Script start dans package.json

Remplacez la ligne de script start par :

json
Copier le code
"scripts": {
  "start": "cross-env HOST=0.0.0.0 react-scripts start",
  // autres scripts
}
b. Démarrer l'Application
Lancez l'application avec :

bash
Copier le code
npm start
c. Configurer le Pare-feu pour Autoriser le Trafic sur le Port 3000
Ouvrir le Pare-feu Windows avec Sécurité Avancée

Appuyez sur Win + R, tapez wf.msc et appuyez sur Entrée.
Créer une Nouvelle Règle Entrante

Cliquez sur Règles de trafic entrant dans le panneau de gauche.
Cliquez sur Nouvelle règle… dans le panneau de droite.
Sélectionnez Port et cliquez sur Suivant.
Sélectionnez TCP et entrez 3000 dans le champ Ports locaux spécifiques.
Cliquez sur Suivant.
Sélectionnez Autoriser la connexion et cliquez sur Suivant.
Sélectionnez les profils appropriés (Domaine, Privé, Public) en fonction de votre réseau et cliquez sur Suivant.
Nommez la règle, par exemple "React App Port 3000", et cliquez sur Terminer.
d. Trouver l'Adresse IP de la Machine Hébergeant App B
Sur la machine hébergeant App B, exécutez :

bash
Copier le code
ipconfig
Notez l'adresse IPv4 (par exemple, 192.168.1.5).

e. Accéder via le Navigateur depuis une Autre Machine
Depuis une autre machine sur le même réseau, ouvrez un navigateur et accédez à :

arduino
Copier le code
http://192.168.1.5:3000
Remarque : Remplacez 192.168.1.5 par l'adresse IP réelle de la machine hébergeant App B.

9. Code Complet et Fonctionnel
Voici un récapitulatif complet des fichiers essentiels.

a. src/services/websocket.ts
typescript
Copier le code
// src/services/websocket.ts
import SockJS from 'sockjs-client';
import Stomp, { StompClient, StompMessage } from 'stompjs';

const SOCKET_URL = 'http://192.168.1.10:8080/power-status-websocket'; // Remplacez par l'URL réelle de App A

export const connectWebSocket = (
  onMessageReceived: (message: string) => void,
  onError?: (error: string) => void
): StompClient => {
  const socket = new SockJS(SOCKET_URL);
  const stompClient: StompClient = Stomp.over(socket);

  stompClient.debug = () => {}; // Désactiver les logs de debug

  stompClient.reconnect_delay = 5000; // Tentative de reconnexion toutes les 5 secondes

  stompClient.connect({}, () => {
    stompClient.subscribe('/topic/power-status', (message: StompMessage) => {
      if (message.body) {
        onMessageReceived(message.body);
      }
    });
  }, (error: string) => {
    console.error('Erreur de connexion WebSocket:', error);
    if (onError) {
      onError(error);
    }
  });

  return stompClient;
};
b. src/App.tsx
typescript
Copier le code
// src/App.tsx
import React, { useEffect, useState, useRef } from 'react';
import { connectWebSocket } from './services/websocket';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [powerStatus, setPowerStatus] = useState<'ON' | 'OFF' | 'UNKNOWN'>('UNKNOWN');
  const [isActive, setIsActive] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stompClientRef = useRef<any>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Connecter au WebSocket lors du montage du composant
    stompClientRef.current = connectWebSocket(
      (message: string) => {
        console.log('Message reçu:', message);
        lastUpdateRef.current = Date.now(); // Mettre à jour la dernière mise à jour
        setIsActive(true); // Réactiver l'état actif en cas de réception

        if (message === 'POWER_OFF') {
          setPowerStatus('OFF');
          playAlertSound();
        } else if (message === 'POWER_ON') {
          setPowerStatus('ON');
          stopAlertSound();
        }
      },
      (error: string) => {
        toast.error('Erreur de connexion WebSocket. Tentative de reconnexion...');
      }
    );

    // Nettoyer la connexion WebSocket lors du démontage du composant
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log('Déconnecté du WebSocket');
        });
      }
    };
  }, []);

  useEffect(() => {
    // Configurer un intervalle pour vérifier l'activité toutes les 10 secondes
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastUpdateRef.current;

      if (diff > 60000) { // 60 000 ms = 1 minute
        if (isActive) { // Afficher le toast une seule fois
          setIsActive(false);
          stopAlertSound(); // Arrêter le son si App A est inactive
          setPowerStatus('UNKNOWN'); // Réinitialiser le statut
          toast.error("Client Inactif, veuillez vous rendre sur le site pour vérification");
        }
      }
    }, 10000); // Vérifier toutes les 10 secondes

    // Nettoyer l'intervalle lors du démontage
    return () => clearInterval(interval);
  }, [isActive]);

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Erreur lors de la lecture du son:', error);
      });
    }
  };

  const stopAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getStatusColor = () => {
    switch(powerStatus) {
      case 'ON':
        return 'green';
      case 'OFF':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Surveillance de l'Alimentation</h1>
        {isActive ? (
          <div 
            className="status-indicator" 
            style={{ backgroundColor: getStatusColor() }}
          >
            {powerStatus === 'ON' && 'Courant Allumé'}
            {powerStatus === 'OFF' && 'Coupure de Courant'}
            {powerStatus === 'UNKNOWN' && 'Statut Inconnu'}
          </div>
        ) : (
          <div className="status-indicator inactive">
            Client Inactif,<br />Veuillez vous rendre sur le site pour vérification
          </div>
        )}
        <audio ref={audioRef} src="/danger.mp3" loop />
      </header>
      <ToastContainer />
    </div>
  );
};

export default App;
Explications :

Types d'État : powerStatus est typé pour accepter uniquement 'ON', 'OFF', ou 'UNKNOWN'.
Gestion des Messages WebSocket : Lorsqu'un message est reçu (POWER_ON ou POWER_OFF), l'état est mis à jour et le son d'alerte est géré en conséquence.
Détection d'Inactivité : Un intervalle vérifie toutes les 10 secondes si le dernier message a été reçu il y a plus d'une minute. Si oui, l'état devient inactif et une notification est affichée.
Toast Notifications : Utilisation de react-toastify pour afficher des notifications d'erreur.
c. src/App.css
css
Copier le code
/* src/App.css */
.App {
  text-align: center;
  font-family: Arial, sans-serif;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  padding: 40px;
  color: white;
}

.status-indicator {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  transition: background-color 0.5s ease;
}

.status-indicator.inactive {
  background-color: gray;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  height: auto;
  margin: 20px auto;
}
10. Déployer et Accéder depuis d'Autres Machines
Pour rendre l'application accessible depuis d'autres machines sur le réseau, suivez ces étapes :

a. Modifier le Script de Démarrage
Par défaut, Create React App héberge l'application sur localhost. Pour permettre l'accès externe, modifiez le script de démarrage dans package.json.

Installer cross-env

Sous Windows, utilisez cross-env pour définir la variable d'environnement HOST.

bash
Copier le code
npm install cross-env --save-dev
Modifier le Script start dans package.json

Remplacez la ligne de script start par :

json
Copier le code
"scripts": {
  "start": "cross-env HOST=0.0.0.0 react-scripts start",
  // autres scripts
}
b. Démarrer l'Application
Lancez l'application avec :

bash
Copier le code
npm start
c. Configurer le Pare-feu pour Autoriser le Trafic sur le Port 3000
Ouvrir le Pare-feu Windows avec Sécurité Avancée

Appuyez sur Win + R, tapez wf.msc et appuyez sur Entrée.
Créer une Nouvelle Règle Entrante

Cliquez sur Règles de trafic entrant dans le panneau de gauche.
Cliquez sur Nouvelle règle… dans le panneau de droite.
Sélectionnez Port et cliquez sur Suivant.
Sélectionnez TCP et entrez 3000 dans le champ Ports locaux spécifiques.
Cliquez sur Suivant.
Sélectionnez Autoriser la connexion et cliquez sur Suivant.
Sélectionnez les profils appropriés (Domaine, Privé, Public) en fonction de votre réseau et cliquez sur Suivant.
Nommez la règle, par exemple "React App Port 3000", et cliquez sur Terminer.
d. Trouver l'Adresse IP de la Machine Hébergeant App B
Sur la machine hébergeant App B, exécutez :

bash
Copier le code
ipconfig
Notez l'adresse IPv4 (par exemple, 192.168.1.5).

e. Accéder via le Navigateur depuis une Autre Machine
Depuis une autre machine sur le même réseau, ouvrez un navigateur et accédez à :

arduino
Copier le code
http://192.168.1.5:3000
Remarque : Remplacez 192.168.1.5 par l'adresse IP réelle de la machine hébergeant App B.

11. Résumé et Vérification Finale
Vous avez maintenant une application React avec TypeScript qui :

Affiche un Indicateur Visuel :

Vert pour Courant Allumé (POWER_ON)
Rouge pour Coupure de Courant (POWER_OFF)
Gris pour Statut Inconnu ou Inactif
Alerte Sonore :

Émet un son d'alerte en boucle en cas de coupure de courant.
Arrête le son lorsque le courant est rétabli ou si App A devient inactive.
Détection d'Inactivité :

Affiche un message d'inactivité si aucun message n'est reçu depuis plus d'une minute.
Notifications :

Utilise react-toastify pour afficher des notifications d'erreur de connexion.
a. Démarrer App A et App B
Démarrer App A :

Assurez-vous que App A est en cours d'exécution et qu'elle envoie correctement les messages via WebSocket.
Démarrer App B :

Exécutez App B avec npm start.
Vérifiez les logs pour voir si la connexion au WebSocket est établie avec succès :
css
Copier le code
Connecté au WebSocket d'App A
b. Tester la Communication
Simuler une Coupure de Courant :

Modifiez l'état de la batterie ou simulez une coupure pour que App A envoie un message POWER_OFF.
App B devrait recevoir le message et déclencher le bip sonore.
Logs attendus dans App B :
mathematica
Copier le code
Message reçu via WebSocket: POWER_OFF
Bip sonore déclenché!
Rétablir le Courant :

Rétablissez l'alimentation pour que App A envoie un message POWER_ON.
App B devrait recevoir le message et arrêter le bip sonore.
Logs attendus dans App B :
mathematica
Copier le code
Message reçu via WebSocket: POWER_ON
Bip sonore arrêté!
Tester l'Inactivité :

Arrêtez App A ou empêchez-la d'envoyer des messages.
Après une minute, App B devrait afficher le message d'inactivité et arrêter le son d'alerte.
Logs attendus dans App B :
arduino
Copier le code
Client Inactif, veuillez vous rendre sur le site pour vérification
12. Gestion des Erreurs et Reconnections
Pour rendre l'application plus robuste, vous pouvez ajouter des mécanismes de reconnexion automatique ou afficher des messages d'erreur spécifiques. Voici quelques améliorations possibles :

a. Ajouter des Notifications d'Erreur
Déjà intégré via react-toastify. Les erreurs de connexion WebSocket afficheront des notifications.

b. Reconnaissance Automatique
L'option reconnect_delay dans websocket.ts tente de reconnecter toutes les 5 secondes si la connexion échoue.

13. Améliorations Futures
Pour rendre votre application encore plus robuste et conviviale, envisagez les améliorations suivantes :

Reconnexion Automatique Renforcée : Implémentez des stratégies de reconnexion plus avancées, comme des tentatives de reconnexion exponentielles.
Notifications Visuelles : Ajoutez des notifications visuelles supplémentaires ou des alertes pour informer l'utilisateur des changements de statut.
Sécurité : Si déployé en production, sécurisez les WebSockets avec wss:// et implémentez des mécanismes d'authentification.
Responsive Design : Assurez-vous que l'application est bien affichée sur différents appareils et tailles d'écran.
Logs et Monitoring : Intégrez des outils de monitoring pour suivre les performances et les erreurs de l'application.
14. Code Complet et Fonctionnel
Voici un récapitulatif complet des fichiers essentiels.

a. src/services/websocket.ts
typescript
Copier le code
// src/services/websocket.ts
import SockJS from 'sockjs-client';
import Stomp, { StompClient, StompMessage } from 'stompjs';

const SOCKET_URL = 'http://192.168.1.10:8080/power-status-websocket'; // Remplacez par l'URL réelle de App A

export const connectWebSocket = (
  onMessageReceived: (message: string) => void,
  onError?: (error: string) => void
): StompClient => {
  const socket = new SockJS(SOCKET_URL);
  const stompClient: StompClient = Stomp.over(socket);

  stompClient.debug = () => {}; // Désactiver les logs de debug

  stompClient.reconnect_delay = 5000; // Tentative de reconnexion toutes les 5 secondes

  stompClient.connect({}, () => {
    stompClient.subscribe('/topic/power-status', (message: StompMessage) => {
      if (message.body) {
        onMessageReceived(message.body);
      }
    });
  }, (error: string) => {
    console.error('Erreur de connexion WebSocket:', error);
    if (onError) {
      onError(error);
    }
  });

  return stompClient;
};
b. src/App.tsx
typescript
Copier le code
// src/App.tsx
import React, { useEffect, useState, useRef } from 'react';
import { connectWebSocket } from './services/websocket';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [powerStatus, setPowerStatus] = useState<'ON' | 'OFF' | 'UNKNOWN'>('UNKNOWN');
  const [isActive, setIsActive] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stompClientRef = useRef<any>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Connecter au WebSocket lors du montage du composant
    stompClientRef.current = connectWebSocket(
      (message: string) => {
        console.log('Message reçu:', message);
        lastUpdateRef.current = Date.now(); // Mettre à jour la dernière mise à jour
        setIsActive(true); // Réactiver l'état actif en cas de réception

        if (message === 'POWER_OFF') {
          setPowerStatus('OFF');
          playAlertSound();
        } else if (message === 'POWER_ON') {
          setPowerStatus('ON');
          stopAlertSound();
        }
      },
      (error: string) => {
        toast.error('Erreur de connexion WebSocket. Tentative de reconnexion...');
      }
    );

    // Nettoyer la connexion WebSocket lors du démontage du composant
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log('Déconnecté du WebSocket');
        });
      }
    };
  }, []);

  useEffect(() => {
    // Configurer un intervalle pour vérifier l'activité toutes les 10 secondes
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastUpdateRef.current;

      if (diff > 60000) { // 60 000 ms = 1 minute
        if (isActive) { // Afficher le toast une seule fois
          setIsActive(false);
          stopAlertSound(); // Arrêter le son si App A est inactive
          setPowerStatus('UNKNOWN'); // Réinitialiser le statut
          toast.error("Client Inactif, veuillez vous rendre sur le site pour vérification");
        }
      }
    }, 10000); // Vérifier toutes les 10 secondes

    // Nettoyer l'intervalle lors du démontage
    return () => clearInterval(interval);
  }, [isActive]);

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Erreur lors de la lecture du son:', error);
      });
    }
  };

  const stopAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getStatusColor = () => {
    switch(powerStatus) {
      case 'ON':
        return 'green';
      case 'OFF':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Surveillance de l'Alimentation</h1>
        {isActive ? (
          <div 
            className="status-indicator" 
            style={{ backgroundColor: getStatusColor() }}
          >
            {powerStatus === 'ON' && 'Courant Allumé'}
            {powerStatus === 'OFF' && 'Coupure de Courant'}
            {powerStatus === 'UNKNOWN' && 'Statut Inconnu'}
          </div>
        ) : (
          <div className="status-indicator inactive">
            Client Inactif,<br />Veuillez vous rendre sur le site pour vérification
          </div>
        )}
        <audio ref={audioRef} src="/danger.mp3" loop />
      </header>
      <ToastContainer />
    </div>
  );
};

export default App;
c. src/App.css
css
Copier le code
/* src/App.css */
.App {
  text-align: center;
  font-family: Arial, sans-serif;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  padding: 40px;
  color: white;
}

.status-indicator {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  transition: background-color 0.5s ease;
}

.status-indicator.inactive {
  background-color: gray;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  height: auto;
  margin: 20px auto;
}
d. src/index.tsx
Assurez-vous que votre fichier index.tsx est correctement configuré.

typescript
Copier le code
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
e. public/danger.mp3
Assurez-vous que le fichier danger.mp3 est bien placé dans le répertoire public :

java
Copier le code
power-status-monitor/
├── public/
│   ├── danger.mp3
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   ├── services/
│   │   └── websocket.ts
│   └── types/
│       ├── stompjs.d.ts
│       └── sockjs-client.d.ts
├── package.json
└── ...
14. Tester l'Application
a. Démarrer App A et App B
Démarrer App A :

Assurez-vous que App A est en cours d'exécution et qu'elle envoie correctement les messages via WebSocket.
Démarrer App B :

Exécutez App B avec :

bash
Copier le code
npm start
Vérifiez les logs dans le terminal pour voir si la connexion au WebSocket est établie avec succès :

css
Copier le code
Connecté au WebSocket d'App A
b. Tester la Communication
Simuler une Coupure de Courant :

Modifiez l'état de la batterie ou simulez une coupure pour que App A envoie un message POWER_OFF.
App B devrait recevoir le message et déclencher le bip sonore.
Logs attendus dans App B :
mathematica
Copier le code
Message reçu via WebSocket: POWER_OFF
Bip sonore déclenché!
Rétablir le Courant :

Rétablissez l'alimentation pour que App A envoie un message POWER_ON.
App B devrait recevoir le message et arrêter le bip sonore.
Logs attendus dans App B :
mathematica
Copier le code
Message reçu via WebSocket: POWER_ON
Bip sonore arrêté!
Tester l'Inactivité :

Arrêtez App A ou empêchez-la d'envoyer des messages.
Après une minute, App B devrait afficher le message d'inactivité et arrêter le son d'alerte.
Logs attendus dans App B :
arduino
Copier le code
Client Inactif, veuillez vous rendre sur le site pour vérification
15. Conclusion
En suivant ces étapes, vous avez maintenant une application React avec TypeScript qui :

Affiche un Indicateur Visuel :

Vert pour Courant Allumé (POWER_ON)
Rouge pour Coupure de Courant (POWER_OFF)
Gris pour Statut Inconnu ou Inactif
Alerte Sonore :

Émet un son d'alerte en boucle en cas de coupure de courant.
Arrête le son lorsque le courant est rétabli ou si App A devient inactive.
Détection d'Inactivité :

Affiche un message d'inactivité si App A ne communique pas pendant plus d'une minute.
Notifications :

Utilise react-toastify pour afficher des notifications d'erreur de connexion.
Améliorations Futures
Pour rendre votre application encore plus robuste et conviviale, envisagez les améliorations suivantes :

Reconnexion Automatique Renforcée : Implémentez des stratégies de reconnexion plus avancées, comme des tentatives de reconnexion exponentielles.
Notifications Visuelles : Ajoutez des notifications visuelles supplémentaires ou des alertes pour informer l'utilisateur des changements de statut.
Sécurité : Si déployé en production, sécurisez les WebSockets avec wss:// et implémentez des mécanismes d'authentification.
Responsive Design : Assurez-vous que l'application est bien affichée sur différents appareils et tailles d'écran.
Logs et Monitoring : Intégrez des outils de monitoring pour suivre les performances et les erreurs de l'application.
N'hésitez pas à personnaliser l'application selon vos besoins spécifiques. Si vous avez des questions supplémentaires ou besoin d'aide pour des fonctionnalités avancées, je suis là pour vous aider !