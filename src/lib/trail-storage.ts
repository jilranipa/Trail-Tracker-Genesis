import type { GeoPoint, Trail } from '@/types';

const TRAILS_STORAGE_KEY = 'trailTrackerApp_trails';
const CURRENT_PATH_STORAGE_KEY = 'trailTrackerApp_currentPath';

export function getStoredTrails(): Trail[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedTrails = localStorage.getItem(TRAILS_STORAGE_KEY);
    return storedTrails ? JSON.parse(storedTrails) : [];
  } catch (error) {
    console.error('Error loading trails from localStorage:', error);
    return [];
  }
}

export function saveStoredTrails(trails: Trail[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(TRAILS_STORAGE_KEY, JSON.stringify(trails));
  } catch (error) {
    console.error('Error saving trails to localStorage:', error);
  }
}

// Helper function to calculate distance (Haversine formula)
export function calculateDistance(path: { lat: number, lng: number }[]): number {
  let totalDistance = 0;
  if (path.length < 2) return 0;

  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i+1];

    const lat1 = p1.lat;
    const lon1 = p1.lng;
    const lat2 = p2.lat;
    const lon2 = p2.lng;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rLat1) * Math.cos(rLat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalDistance += R * c;
  }
  return totalDistance;
}

export function getStoredCurrentPath(): GeoPoint[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CURRENT_PATH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error loading current path from localStorage:', error);
    return [];
  }
}

export function saveStoredCurrentPath(path: GeoPoint[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENT_PATH_STORAGE_KEY, JSON.stringify(path));
  } catch (error) {
    console.error('Error saving current path to localStorage:', error);
  }
}

export function clearStoredCurrentPath(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CURRENT_PATH_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing current path from localStorage:', error);
  }
}
