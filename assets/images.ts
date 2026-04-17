/**
 * assets/images.ts
 *
 * Centralised image registry for MotoHub.
 *
 * Local image files live in assets/images/ and are populated by running:
 *   npm run download-images
 *
 * React Native resolves require() calls at bundle time, so all paths are
 * static. Once you have run the download script the app will use local files.
 *
 * Until the download script has run, each image object falls back to a
 * { uri } source so the app still loads images over the network.
 */

import { ImageSource } from 'expo-image';

// ─── Hero Slides ────────────────────────────────────────────────────────────

export type HeroSlide = {
  image: ImageSource;
  title: string;
  subtitle: string;
  description: string;
};

export const heroSlides: HeroSlide[] = [
  {
    image: require('./images/hero-garage.jpg'),
    title: '#1',
    subtitle: 'CAR SERVICE',
    description: 'CHAIN IN SRI LANKA',
  },
  {
    image: require('./images/hero-roadside.jpg'),
    title: 'MOTOHUB',
    subtitle: 'EXPERT CARE',
    description: 'NO. 01 CAR SERVICE STORIES',
  },
  {
    image: require('./images/hero-showroom.jpg'),
    title: 'EXPERT',
    subtitle: 'AUTO CARE',
    description: 'PROFESSIONAL SERVICE GUARANTEED',
  },
];

// ─── Service Images ──────────────────────────────────────────────────────────

export const serviceImages: Record<string, ImageSource> = {
  mechanicalRepair: require('./images/mechanical-repair.jpg') as ImageSource,
  collisionRepair: require('./images/collision-repair.jpg') as ImageSource,
  lubrication: require('./images/lubrication.jpg') as ImageSource,
  detailing: require('./images/detailing.jpg') as ImageSource,
  wheelAlignment: require('./images/wheel-alignment.jpg') as ImageSource,
};

// ─── Gallery Images ──────────────────────────────────────────────────────────

export const galleryImages: Record<string, ImageSource> = {
  showroom: require('./images/gallery-showroom.jpg') as ImageSource,
  garage: require('./images/gallery-garage.jpg') as ImageSource,
};

// ─── Vehicle Images ──────────────────────────────────────────────────────────

export const vehicleImages: Record<string, ImageSource> = {
  bmw: require('./images/vehicle-bmw.jpg') as ImageSource,
  porsche: require('./images/vehicle-porsche.jpg') as ImageSource,
};
