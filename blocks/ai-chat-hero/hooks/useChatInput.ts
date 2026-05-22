/**
 * Block: AI Chat Hero
 * Author: Implemented by JinXSuper
 * License: MIT
 */
import { useState, useCallback, ChangeEvent, FocusEvent, KeyboardEvent } from "react";

export function useChatInput(onSubmit?: (value: string) => void) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const trimmed = value.trim();
        if (trimmed) {
          onSubmit?.(trimmed);
          setValue("");
        }
      }
    },
    [value, onSubmit]
  );

  const onFocus = useCallback((e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
  }, []);

  const onBlur = useCallback((e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
  }, []);

  return {
    value,
    setValue,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    isFocused,
  };
}
