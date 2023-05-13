import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Given any object, returns the prop subchild using dot notation as string "desc"
 * Example:
 * var r = { a:1, b: {b1:11, b2: 99}};
 * console.log(getDescendantProp(r, "b.b2"));
 * -> 99
 */
export function getDescendantProp(obj: object, desc: string): unknown {
  const arr = desc.split('.');
  while (arr.length && obj) {
    const element = arr.shift();
    if (element) {
      obj = obj[element as keyof object];
    }
  }
  return obj;
}
