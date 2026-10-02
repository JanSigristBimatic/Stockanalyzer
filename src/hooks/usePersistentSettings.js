import { useState, useEffect } from 'react';

/**
 * Settings object that survives reloads in localStorage; stored values override the defaults
 * @param {string} key - localStorage key
 * @param {Object} defaults - Default settings
 * @returns {[Object, function]} - Settings and setter like useState
 */
export function usePersistentSettings(key, defaults) {
  const [settings, setSettings] = useState(() => loadSettings(key, defaults));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(settings));
    } catch (e) {
      console.error(`Failed to save ${key}:`, e);
    }
  }, [key, settings]);

  return [settings, setSettings];
}

function loadSettings(key, defaults) {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(key)) };
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return defaults;
  }
}
