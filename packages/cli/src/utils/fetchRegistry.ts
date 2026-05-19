import { Registry, BlockPayload } from '../types/registry.js';
import { REGISTRY_URLS } from './registryUrl.js';

export class RegistryFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegistryFetchError';
  }
}

// In-memory cache for the current CLI session
let cachedRegistry: Registry | null = null;
let lastSource: 'primary' | 'fallback' | null = null;

export function getRegistrySource(): 'primary' | 'fallback' | null {
  return lastSource;
}

export async function fetchRegistry(): Promise<Registry> {
  if (cachedRegistry) {
    return cachedRegistry;
  }

  // 1. Try primary registry
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(REGISTRY_URLS.primary, { signal: controller.signal });
    clearTimeout(id);

    if (res.ok) {
      const data = await res.json() as Registry;
      cachedRegistry = data;
      lastSource = 'primary';
      return data;
    }
  } catch (err) {
    // silently fail and proceed to fallback
  }

  // 2. Try fallback registry
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(REGISTRY_URLS.fallback, { signal: controller.signal });
    clearTimeout(id);

    if (res.ok) {
      const data = await res.json() as Registry;
      cachedRegistry = data;
      lastSource = 'fallback';
      return data;
    }
  } catch (err) {
    // let it fail and throw below
  }

  throw new RegistryFetchError(
    "Could not reach GwenUI registry.\nCheck your internet connection and try again."
  );
}

export async function fetchBlock(id: string): Promise<BlockPayload> {
  const registry = await fetchRegistry();
  const block = registry.blocks.find(b => b.id === id);
  if (!block) {
    throw new Error(
      `Block '${id}' not found in registry. Run 'gwenui list' to see available blocks.`
    );
  }
  return block;
}
