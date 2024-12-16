# Moniteur de Coupures Électriques

Application React pour la surveillance en temps réel des coupures de courant électrique.

## Fonctionnalités

- Surveillance en temps réel des coupures
- Alertes sonores lors des coupures
- Visualisations graphiques des données historiques
- Analyses par zone géographique
- Statistiques mensuelles et quotidiennes

## Configuration Requise Backend

L'application nécessite un backend Spring Boot exposant les endpoints suivants :

### WebSocket

- Endpoint: `ws://localhost:8080/ws`
- Events:
  - `powerOutage`: Émis lors d'une nouvelle coupure
  - `powerRestored`: Émis lors du rétablissement du courant

### REST API

#### Endpoints Analytics

```
GET /api/analytics/daily
Params: startDate, endDate
Response: [{ date: string, count: number, totalDuration: number }]

GET /api/analytics/monthly/{year}
Response: [{ month: string, count: number, averageDuration: number }]

GET /api/analytics/locations
Response: [{ location: string, count: number }]

GET /api/analytics/statistics
Response: {
  totalOutages: number,
  averageDuration: number,
  mostAffectedLocation: string
}
```

### Modèle de Données

```typescript
interface PowerOutage {
  id: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  location?: string;
  status: 'ONGOING' | 'RESOLVED';
}
```

## Installation

```bash
npm install
npm run dev
```

## Structure du Projet

```
src/
  ├── components/      # Composants réutilisables
  ├── pages/          # Pages de l'application
  ├── services/       # Services API
  ├── types/          # Types TypeScript
  └── utils/          # Utilitaires
```

## Technologies Utilisées

- React
- TypeScript
- Tailwind CSS
- Socket.io
- Recharts
- React Router
- date-fns