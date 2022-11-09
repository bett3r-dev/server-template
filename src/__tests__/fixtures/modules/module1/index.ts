import { Libraries } from "src";

export function create(libraries: Libraries) {
  expect((libraries.library2 as any).helloUpperCase).toBeDefined();
  expect((libraries.library2 as any).helloUpperCase('tomas')).toBe('Hello TOMAS');
  libraries.serverInitEmitter.on('serverReady', () => {
    console.log('asdf');
  })
}
