
import { RefreshCw, Download, ArrowLeft, Home, FileText, BookOpen, FileCheck, Award, Zap } from "lucide-react";
import Image from 'next/image';
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

export function Header({ onReset, onDownload, onBackToList, activeDocument, onGenerateHomologacion, onShowKardex, onShowTesis, onShowCierrePensum }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-end border-b-4 border-primary bg-white px-4 sm:px-6" data-hide-for-pdf="true">
      <div className="flex items-center gap-2">
         {onBackToList && (
            <>
              <Button onClick={onReset} variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Volver a Inicio
              </Button>
              <Button onClick={onBackToList} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a la lista
              </Button>
            </>
         )}
         {onShowKardex && (
            <Button onClick={onShowKardex} variant={activeDocument === 'kardex' ? 'secondary' : 'ghost'}>
              <BookOpen className="mr-2 h-4 w-4" />
              Kardex
            </Button>
         )}
         {onGenerateHomologacion && (
            <Button onClick={onGenerateHomologacion} variant={activeDocument === 'homologacion' ? 'secondary' : 'ghost'}>
                <FileText className="mr-2 h-4 w-4" />
                Comparativo
            </Button>
         )}
         {onShowTesis && (
            <Button onClick={onShowTesis} variant={activeDocument === 'tesis' ? 'secondary' : 'ghost'}>
                <Award className="mr-2 h-4 w-4" />
                Tesis
            </Button>
         )}
          {onShowCierrePensum && (
            <Button onClick={onShowCierrePensum} variant={activeDocument === 'cierre' ? 'secondary' : 'ghost'}>
                <FileCheck className="mr-2 h-4 w-4" />
                Cierre Pensum
            </Button>
         )}
         {!onBackToList && (
          <Button onClick={onReset} variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Volver a Inicio
          </Button>
         )}
         {onDownload && (
            <Button onClick={onDownload} variant="default">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
            </Button>
         )}
      </div>
    </header>
  );
}
