import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, type SiteSettings } from '../data/settings';

let settingsCache: Promise<SiteSettings> | null = null;

function loadSettings(): Promise<SiteSettings> {
  if (!settingsCache) {
    settingsCache = fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('API unavailable'))))
      .then((data: Partial<SiteSettings>) => ({ ...DEFAULT_SETTINGS, ...data }))
      .catch(() => ({ ...DEFAULT_SETTINGS }));
  }
  return settingsCache;
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>({ ...DEFAULT_SETTINGS });
  useEffect(() => {
    let active = true;
    loadSettings().then((s) => active && setSettings(s));
    return () => {
      active = false;
    };
  }, []);
  return settings;
}
