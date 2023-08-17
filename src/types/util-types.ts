/**
 *
 * @example
 * ```ts
 *  const myObject = typeSafeObjectFromEntries([
 *      ["a", 5],
 *      ["b", "hello"],
 *      ["c", false],
 *  ]); // { a: 5; b: "hello"; c: false } ✅
 * ```
 * @param entries - Array of key-value pairs
 * @returns
 */
export const typeSafeObjectFromEntries = <
  const T extends ReadonlyArray<readonly [PropertyKey, unknown]>
>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
};

/**
 *
 * @example
 * ```ts
 * const myEntries = typeSafeObjectEntries({ x: 6, y: "apple", z: true });
 * // ["x", number] | ["y", string] | ["z", boolean])[] ✅
 * // with const param: (["x", 6] | ["y", "apple"] | ["z", true])[] ✅
 * ```
 * @param obj - Object to get entries from
 * @returns
 */
export const typeSafeObjectEntries = <
  const T extends Record<PropertyKey, unknown> // T is a whole object { a: 1, b: 2, c: 3, ... }
>(
  obj: T
): { [K in keyof T]: [K, T[K]] }[keyof T][] => {
  return Object.entries(obj) as { [K in keyof T]: [K, T[K]] }[keyof T][];
};
