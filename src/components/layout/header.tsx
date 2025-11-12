"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Download, ArrowLeft, Home, FileText, BookOpen, FileCheck, Award, PencilLine } from "lucide-react";
import { Button } from "../ui/button";

type HeaderProps = {
  onReset: () => void;
  onDownload?: () => void;
  onBackToList?: () => void;
  activeDocument?: string;
  onGenerateHomologacion?: () => void;
  onShowKardex?: () => void;
  onShowTesis?: () => void;
  onShowCierrePensum?: () => void;
};

export function Header({
  onReset,
  onDownload,
  onBackToList,
  activeDocument,
  onGenerateHomologacion,
  onShowKardex,
  onShowTesis,
  onShowCierrePensum,
}: HeaderProps) {
  // Nombre mostrado arriba (lee de localStorage; si no hay, usa "Consortium Universitas")
  const [universityName, setUniversityName] = useState("Consortium Universitas");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("universityName");
      if (stored && stored.trim() !== "") setUniversityName(stored);
    } catch {}
  }, []);

  const handleChangeName = () => {
    const current = universityName || "Consortium Universitas";
    const newName = prompt("Escribe el nuevo nombre de la institución:", current);
    if (newName && newName.trim() !== "") {
      const clean = newName.trim();
      setUniversityName(clean);
      try {
        localStorage.setItem("universityName", clean);
      } catch {}
    }
  };

  return (
    <header
      className="sticky top-0 z-30 border-b-4 border-primary bg-white px-3 py-2"
      data-hide-for-pdf="true"
    >
      {/* Línea 1: Nombre + botón cambiar (compacto) */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="min-w-0 flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-blue-900" title={universityName}>
            {universityName}
          </span>
          <Button
            onClick={handleChangeName}
            className="h-7 px-2 text-xs bg-blue-700 hover:bg-blue-800 text-white"
            title="Cambiar nombre"
          >
            <PencilLine className="mr-1 h-3.5 w-3.5" />
            Cambiar nombre
          </Button>
        </div>

        {/* Botón Descargar si aplica (a la derecha en la misma línea) */}
        {onDownload && (
          <Button onClick={onDownload} className="h-7 px-2 text-xs" variant="default">
            <Download className="mr-1 h-3.5 w-3.5" />
            PDF
          </Button>
        )}
      </div>

      {/* Línea 2: TODOS los botones en UNA SOLA LÍNEA (compactos) */}
      <div className="flex flex-nowrap items-center gap-1 overflow-x-auto whitespace-nowrap">
        {onBackToList && (
          <>
            <Button onClick={onReset} variant="outline" className="h-8 px-2 text-xs">
              <Home className="mr-1 h-3.5 w-3.5" />
              Inicio
            </Button>
            <Button onClick={onBackToList} variant="outline" className="h-8 px-2 text-xs">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              Lista
            </Button>
          </>
        )}

        {onShowKardex && (
          <Button
            onClick={onShowKardex}
            variant={activeDocument === "kardex" ? "secondary" : "ghost"}
            className="h-8 px-2 text-xs"
          >
            <BookOpen className="mr-1 h-3.5 w-3.5" />
            Kardex
          </Button>
        )}

        {onGenerateHomologacion && (
          <Button
            onClick={onGenerateHomologacion}
            variant={activeDocument === "homologacion" ? "secondary" : "ghost"}
            className="h-8 px-2 text-xs"
          >
            <FileText className="mr-1 h-3.5 w-3.5" />
            Comparativo
          </Button>
        )}

        {onShowTesis && (
          <Button
            onClick={onShowTesis}
            variant={activeDocument === "tesis" ? "secondary" : "ghost"}
            className="h-8 px-2 text-xs"
          >
            <Award className="mr-1 h-3.5 w-3.5" />
            Tesis
          </Button>
        )}

        {onShowCierrePensum && (
          <Button
            onClick={onShowCierrePensum}
            variant={activeDocument === "cierre" ? "secondary" : "ghost"}
            className="h-8 px-2 text-xs"
          >
            <FileCheck className="mr-1 h-3.5 w-3.5" />
            Cierre Pensum
          </Button>
        )}

        {!onBackToList && (
          <Button onClick={onReset} variant="outline" className="h-8 px-2 text-xs">
            <Home className="mr-1 h-3.5 w-3.5" />
            Inicio
          </Button>
        )}
      </div>
    </header>
  );
}
