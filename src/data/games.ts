// src/data/games.ts

// Definición de la interfaz para un juego (útil para TypeScript)
export interface Game {
  id: string;
  name: string;
  logoUrl: string;
  status: 'Disponible' | 'No disponible';
  platform: string;
  note?: string; // Propiedad opcional
}

// Array de juegos
export const games: Game[] = [
  { id: 'assetto-corsa', name: 'Assetto Corsa Competizione', logoUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/805550/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'beamng', name: 'BeamNG.drive', logoUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/284160/capsule_616x353.jpg', status: 'Disponible', platform: 'Steam' },
  { id: 'call-of-duty-warzone', name: 'Call of Duty: Warzone', logoUrl: 'https://cdn.steamstatic.com/steam/apps/1962663/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam', note: '+18' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', logoUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg', status: 'Disponible', platform: 'Steam', note: '+18' },
  { id: 'drive-beyond-horizons', name: 'Drive Beyond Horizons', logoUrl: 'https://cdn.steamstatic.com/steam/apps/2625420/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'ea-fc25', name: 'EA SPORTS FC™ 25', logoUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2195250/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'f1-22', name: 'F1 22', logoUrl: 'https://cdn.steamstatic.com/steam/apps/1692250/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'fall-guys', name: 'Fall Guys', logoUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/capsule_616x353.jpg', status: 'Disponible', platform: 'Steam' },
  { id: 'forza-horizon-5', name: 'Forza Horizon 5', logoUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'fortnite', name: 'Fortnite', logoUrl: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/03/fortnite-2024-promo-art.jpg', status: 'Disponible', platform: 'Epic Games' },
  { id: 'gta5', name: 'GTA 5', logoUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam', note: '+18' },
  { id: 'hotwheels-2', name: 'HOT WHEELS UNLEASHED™ 2', logoUrl: 'https://cdn.steamstatic.com/steam/apps/2051120/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'jurassic-evolution', name: 'Jurassic World Evolution', logoUrl: 'https://cdn.steamstatic.com/steam/apps/648350/capsule_616x353.jpg', status: 'Disponible', platform: 'Steam' },
  { id: 'lego-star-wars', name: 'LEGO® Star Wars™: La Saga Skywalker', logoUrl: 'https://cdn.steamstatic.com/steam/apps/920210/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'marvel-rivals', name: 'Marvel Rivals', logoUrl: 'https://cdn.steamstatic.com/steam/apps/2767030/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'miles-morales', name: 'Marvel\'s Spider-Man Miles Morales', logoUrl: 'https://cdn.steamstatic.com/steam/apps/1817190/capsule_616x353.jpg', status: 'Disponible', platform: 'Steam' },
  { id: 'spiderman2', name: 'Marvel\'s Spider-Man Remastered', logoUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3172660/0c0f71d9656b96f53095a9757bbba6ea1c074acc/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'minecraft', name: 'Minecraft', logoUrl: 'https://xboxwire.thesourcemediaassets.com/sites/4/15YR_Free_Cape-1-7cbcb0739e3df57534ec-9063efed017354d1b1c3.jpg', status: 'No disponible', platform: 'PC' },
  { id: 'motogp24', name: 'MotoGP™24', logoUrl: 'https://cdn.steamstatic.com/steam/apps/2581700/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'nba2k23', name: 'NBA 2K23', logoUrl: 'https://cdn.steamstatic.com/steam/apps/1919590/capsule_616x353.jpg', status: 'Disponible', platform: 'Steam' },
  { id: 'pc-building-sim', name: 'PC Building Simulator 2', logoUrl: 'https://cdn.steamstatic.com/steam/apps/621060/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'rocket-league', name: 'Rocket League', logoUrl: 'https://cdn.steamstatic.com/steam/apps/252950/capsule_616x353.jpg', status: 'No disponible', platform: 'Epic Games' },
  { id: 'the-last-of-us', name: 'The Last of Us Part I', logoUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'trackmania', name: 'Trackmania', logoUrl: 'https://cdn.steamstatic.com/steam/apps/2225070/capsule_616x353.jpg', status: 'Disponible', platform: 'Epic Games' },
  { id: 'uncharted', name: 'Uncharted: Legacy of Thieves Collection', logoUrl: 'https://cdn.steamstatic.com/steam/apps/1659420/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
  { id: 'wwe-2k24', name: 'WWE 2K24', logoUrl: 'https://cdn.steamstatic.com/steam/apps/2315690/capsule_616x353.jpg', status: 'Disponible', platform: 'Steam' },
  { id: 'wwe-2k25', name: 'WWE 2K25', logoUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2878960/76d35961f8a4e857b88a6c50bef901a1f87c23dc/capsule_616x353.jpg', status: 'No disponible', platform: 'Steam' },
];
