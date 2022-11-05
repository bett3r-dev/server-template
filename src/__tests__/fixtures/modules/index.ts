import { Library } from "src";

export function create(libraries: Record<string, Library>) {
  expect(libraries.library2.helloUpperCase).toBeDefined();
  expect(libraries.library2.helloUpperCase('tomas')).toBe('Hello TOMAS');
}