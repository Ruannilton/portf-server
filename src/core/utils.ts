import { JsonValue } from '@prisma/client/runtime/library';

export function convertJsonValueToStringArray(jsonValue: JsonValue): string[] {
  if (jsonValue == null) return [];

  if (typeof jsonValue == 'string') {
    return JSON.parse(jsonValue) as string[];
  }

  if (Array.isArray(jsonValue)) {
    // Ensure all elements in the array are strings
    if (jsonValue.every((item) => typeof item === 'string')) {
      return jsonValue; // Safe to cast
    } else {
      throw new Error('The JsonValue is not an array of strings.');
    }
  } else {
    throw new Error('The JsonValue is not an array.');
  }
}
