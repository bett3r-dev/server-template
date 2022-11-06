import { Libraries } from "src";

export function create(libraries: Libraries) {
  expect(libraries.library2.helloUpperCase).toBeDefined();
  expect(libraries.library2.helloUpperCase('tomas')).toBe('Hello TOMAS');
  libraries.serverInitEmitter.on('serverReady', () => {
    console.log('asdf');
  })
}