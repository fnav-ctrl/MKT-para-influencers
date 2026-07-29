"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

type Answers = Record<string, unknown>;
type SaveState = "idle" | "saving" | "saved" | "error";

interface ChapterCtx {
  chapterId: string;
  getAnswers: (exerciseKey: string) => Answers;
  save: (exerciseKey: string, answers: Answers) => void;
  saveState: SaveState;
  // Respuestas de OTROS capítulos/volúmenes, para encadenar datos (read-only).
  referencias: Record<string, Answers>;
}

const Ctx = createContext<ChapterCtx | null>(null);

const DEBOUNCE_MS = 800;

export function ChapterProvider({
  chapterId,
  initialAnswers,
  referencias = {},
  children,
}: {
  chapterId: string;
  initialAnswers: Record<string, Answers>;
  referencias?: Record<string, Answers>;
  children: React.ReactNode;
}) {
  const supabase = useMemo(() => createClient(), []);
  const store = useRef<Record<string, Answers>>({ ...initialAnswers });
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const getAnswers = useCallback(
    (exerciseKey: string) => store.current[exerciseKey] ?? {},
    [],
  );

  const flush = useCallback(
    async (exerciseKey: string, answers: Answers) => {
      setSaveState("saving");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSaveState("error");
        return;
      }
      const { error } = await supabase.from("exercise_answers").upsert(
        {
          user_id: user.id,
          chapter_id: chapterId,
          exercise_key: exerciseKey,
          answers,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,chapter_id,exercise_key" },
      );
      setSaveState(error ? "error" : "saved");
    },
    [supabase, chapterId],
  );

  const save = useCallback(
    (exerciseKey: string, answers: Answers) => {
      store.current[exerciseKey] = answers;
      clearTimeout(timers.current[exerciseKey]);
      timers.current[exerciseKey] = setTimeout(
        () => flush(exerciseKey, answers),
        DEBOUNCE_MS,
      );
    },
    [flush],
  );

  useEffect(() => {
    const t = timers.current;
    return () => {
      Object.values(t).forEach(clearTimeout);
    };
  }, []);

  const value = useMemo(
    () => ({ chapterId, getAnswers, save, saveState, referencias }),
    [chapterId, getAnswers, save, saveState, referencias],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChapter() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useChapter debe usarse dentro de <ChapterProvider>");
  }
  return ctx;
}

// Lee una respuesta de otro capítulo/volumen (read-only). Devuelve {} si no hay.
export function useReferencia(exerciseKey: string): Record<string, unknown> {
  const { referencias } = useChapter();
  return referencias[exerciseKey] ?? {};
}

// Hook por ejercicio: mantiene estado local y persiste con debounce.
export function useExercise<T extends Answers>(exerciseKey: string, initial: T) {
  const { getAnswers, save } = useChapter();
  const [answers, setAnswers] = useState<T>(() => ({
    ...initial,
    ...(getAnswers(exerciseKey) as Partial<T>),
  }));

  const update = useCallback(
    (patch: Partial<T>) => {
      setAnswers((prev) => {
        const next = { ...prev, ...patch };
        save(exerciseKey, next);
        return next;
      });
    },
    [exerciseKey, save],
  );

  return { answers, update };
}
