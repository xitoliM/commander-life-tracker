import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  parse: (raw: string) => T | null,
  serialize: (value: T) => string,
) {
  const [value, setValueState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(key);
    if (!raw) {
      setHydrated(true);
      return;
    }

    const parsed = parse(raw);
    if (parsed !== null) {
      setValueState(parsed);
    }

    setHydrated(true);
  }, [key, parse]);

  const setValue = useCallback(
    (nextValue: T | ((current: T) => T)) => {
      setValueState((current) => {
        const resolved =
          typeof nextValue === "function"
            ? (nextValue as (current: T) => T)(current)
            : nextValue;

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, serialize(resolved));
        }

        return resolved;
      });
    },
    [key, serialize],
  );

  const clearValue = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }

    setValueState(initialValue);
  }, [initialValue, key]);

  return {
    value,
    setValue,
    clearValue,
    hydrated,
  };
}
