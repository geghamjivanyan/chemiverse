import type { Hand } from './hands';

// Простейшая шина последнего кадра рук: HandLayer пишет, 3D-сцена читает
// внутри useFrame (без ре-рендеров React).
let latest: Hand[] = [];

export const handsBus = {
  set(hands: Hand[]) {
    latest = hands;
  },
  get(): Hand[] {
    return latest;
  },
};

// Текущий режим жеста (⟳ / ⤢ / e⁻ / '') — сцена пишет, курсор показывает.
let mode = '';
export const gestureModeBus = {
  set(m: string) {
    mode = m;
  },
  get(): string {
    return mode;
  },
};
