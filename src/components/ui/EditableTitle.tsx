'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'appTitle';
const DEFAULT_TITLE = 'Consortium Universitas';

export default function EditableTitle({
  className = '',
  as = 'h1',
}: {
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const AsTag = as;

  // Cargar título guardado
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim()) setTitle(saved);
    } catch {}
  }, []);

  // Guardar y sincronizar con el <title> del documento
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, title);
    } catch {}
    if (typeof document !== 'undefined') document.title = title;
  }, [title]);

  // Preparar input cuando se abre el modal
  useEffect(() => {
    if (open) {
      setTemp(title);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, title]);

  const onSave = () => {
    const v = (temp ?? '').trim();
    if (!v) return;
    setTitle(v);
    setOpen(false);
  };

  const onReset = () => {
    setTitle(DEFAULT_TITLE);
    setOpen(false);
  };

  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      <AsTag className="text-2xl font-semibold tracking-tight">{title}</AsTag>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
      >
        Cambiar nombre
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3">
              <h2 className="text-lg font-medium">Cambiar nombre</h2>
              <p className="text-sm text-gray-500">
                La aplicación inicia mostrando “{DEFAULT_TITLE}”. Aquí puedes personalizarlo.
              </p>
            </div>

            <input
              ref={inputRef}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave();
                if (e.key === 'Escape') setOpen(false);
              }}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="Escribe un nombre…"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={onReset}
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                title="Restablecer a Consortium Universitas"
              >
                Restablecer
              </button>
              <button
                onClick={onSave}
                className="rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
