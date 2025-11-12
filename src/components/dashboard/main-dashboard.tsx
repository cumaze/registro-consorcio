"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Header } from "@/components/layout/header";
import { InfoCards } from "./info-cards";
import { AcademicRecordTable as MaestriaRecordTable } from "./maestria-record-table";
import { LicenciaturaRecordTable } from "./licenciatura-record-table";
import { DoctoradoRecordTable } from "./doctorado-record-table";
import { TecnicoRecordTable } from "./tecnico-record-table";
import { PosdoctoradoRecordTable } from './posdoctorado-record-table';
import { HomologacionCursos } from "./homologacion-cursos";
import { TesisGradeReport } from "./tesis-grade-report";
import { CierrePensum } from "./cierre-pensum";
import type { Student, Course } from "@/lib/academic-data";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

type MainDashboardProps = {
  student: Student;
  courses: Course[];
  onReset: () => void;
  onBackToList: () => void;
  logoUrl: string;
  counselorSignature: string | null;
  secretarySignature: string | null;
  coordinatorSignature: string | null;
  onEditCourse: (course: Course) => void;
};

type ActiveDocument = 'kardex' | 'homologacion' | 'tesis' | 'cierre';

const getNewGradeDetails = (numericGrade: number): { alphabetic: string, systemE: string } => {
  if (numericGrade >= 90) return { alphabetic: "A", systemE: "EXCELENTE" };
  if (numericGrade >= 83) return { alphabetic: "A", systemE: "BUENO" };
  if (numericGrade >= 80) return { alphabetic: "B", systemE: "BUENO" };
  if (numericGrade >= 73) return { alphabetic: "B", systemE: "SUFICIENTE" };
  if (numericGrade >= 70) return { alphabetic: "C", systemE: "SUFICIENTE" };
  if (numericGrade >= 1) return { alphabetic: "D", systemE: "INSUFICIENTE" };
  return { alphabetic: "F", systemE: "INSUFICIENTE" };
};

export function MainDashboard({
  student,
  courses,
  onReset,
  onBackToList,
  logoUrl,
  counselorSignature,
  secretarySignature,
  coordinatorSignature,
  onEditCourse
}: MainDashboardProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  // **Nombre de institución controlado solo por localStorage
  const [universityName, setUniversityName] = useState("Consortium Universitas");

  const [calculatedAverage, setCalculatedAverage] = useState(0);
  const [activeDocument, setActiveDocument] = useState<ActiveDocument>('kardex');
  const [documentTitle, setDocumentTitle] = useState('Registro Académico');
  const [showInfoCards, setShowInfoCards] = useState(true);
  const [thesisGrade, setThesisGrade] = useState<{ numeric: number; alphabetic: string; systemE: string; } | null>(null);

  // Carga inicial del nombre desde localStorage (sin tocar student.university)
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("universityName") : null;
    setUniversityName(stored && stored.trim() ? stored : "Consortium Universitas");
  }, []);

  // Si el usuario cargó un estudiante con tesis, generamos nota simulada como ya estaba
  useEffect(() => {
    if (student.thesisCredits > 0) {
      const numericGrade = Math.floor(Math.random() * (100 - 83 + 1)) + 83;
      const { alphabetic, systemE } = getNewGradeDetails(numericGrade);
      setThesisGrade({ numeric: numericGrade, alphabetic, systemE });
    } else {
      setThesisGrade(null);
    }
  }, [student]);

  // Título por tipo de documento (igual que antes)
  useEffect(() => {
    switch (activeDocument) {
      case 'homologacion':
        setDocumentTitle('Cuadro Comparativo');
        setShowInfoCards(false);
        break;
      case 'tesis':
        setDocumentTitle('Calificación de Tesis de Grado');
        setShowInfoCards(true);
        break;
      case 'cierre':
        setDocumentTitle('Certificación de Cierre de Pensum');
        setShowInfoCards(true);
        break;
      default:
        setDocumentTitle('Registro Académico');
        setShowInfoCards(true);
    }
  }, [activeDocument]);

  const handleAverageCalculated = useCallback((average: number) => {
    setCalculatedAverage(average);
  }, []);

  const handleDownload = () => {
    const input = reportRef.current;
    if (!input) return;

    const elementsToHide = input.querySelectorAll('[data-hide-for-pdf]');
    elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');

    const scale = 2;
    html2canvas(input, {
      scale,
      useCORS: true,
      width: input.offsetWidth,
      height: input.offsetHeight,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasAspectRatio = canvasWidth / canvasHeight;

      let imgWidth = pdfWidth;
      let imgHeight = imgWidth / canvasAspectRatio;

      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = imgHeight * canvasAspectRatio;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${documentTitle.replace(/ /g, '-')}-${student.studentId}.pdf`);

      elementsToHide.forEach(el => (el as HTMLElement).style.display = '');
    });
  };

  const SignatureBox = ({ title, signature }: { title: string; signature: string | null; }) => (
    <div className="flex flex-col items-center">
      <div className="flex h-24 w-64 items-center justify-center border-b-2 border-gray-400">
        {signature ? (
          <Image src={signature} alt={`${title} signature`} width={180} height={80} style={{ objectFit: 'contain' }} crossOrigin="anonymous" />
        ) : (
          <p className="text-gray-400">Firma no cargada</p>
        )}
      </div>
      <p className="pt-2 font-semibold">{title}</p>
    </div>
  );

  const renderKardex = () => {
    const gradeLevel = student.gradeLevel.toLowerCase();

    if (gradeLevel.includes('licenciatura')) {
      return (
        <LicenciaturaRecordTable
          records={courses}
          student={student}
          onAverageCalculated={handleAverageCalculated}
          thesisGrade={thesisGrade}
          onEditCourse={onEditCourse}
        />
      );
    } else if (gradeLevel.includes('posdoctorado')) {
      return (
        <PosdoctoradoRecordTable
          records={courses}
          student={student}
          onAverageCalculated={handleAverageCalculated}
          thesisGrade={thesisGrade}
          onEditCourse={onEditCourse}
        />
      );
    } else if (gradeLevel.includes('doctorado')) {
      return (
        <DoctoradoRecordTable
          records={courses}
          student={student}
          onAverageCalculated={handleAverageCalculated}
          thesisGrade={thesisGrade}
          onEditCourse={onEditCourse}
        />
      );
    } else if (gradeLevel.includes('técnico')) {
      return (
        <TecnicoRecordTable
          records={courses}
          student={student}
          onAverageCalculated={handleAverageCalculated}
          thesisGrade={thesisGrade}
          onEditCourse={onEditCourse}
        />
      );
    } else {
      // Maestría por defecto
      return (
        <MaestriaRecordTable
          records={courses}
          student={student}
          onAverageCalculated={handleAverageCalculated}
          thesisGrade={thesisGrade}
        />
      );
    }
  };

  const renderSignatures = () => (
    <div className="mt-8 space-y-8">
      <div className="grid grid-cols-3 gap-8 pt-8">
        <SignatureBox title="Consejero/ Revisor" signature={counselorSignature} />
        <SignatureBox title="Secretaria" signature={secretarySignature} />
        <SignatureBox title="Coordinador" signature={coordinatorSignature} />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeDocument) {
      case 'homologacion':
        return <HomologacionCursos student={student} courses={courses} />;
      case 'tesis':
        return (
          <TesisGradeReport
            student={student}
            counselorSignature={counselorSignature}
            secretarySignature={secretarySignature}
            coordinatorSignature={coordinatorSignature}
            thesisGrade={thesisGrade}
          />
        );
      case 'cierre':
        return (
          <CierrePensum
            student={student}
            counselorSignature={counselorSignature}
            secretarySignature={secretarySignature}
            coordinatorSignature={coordinatorSignature}
          />
        );
      case 'kardex':
      default:
        return (
          <>
            {renderKardex()}
            <div className="mt-8 space-y-8">
              <div>
                <h3 className="font-semibold mb-2">Observaciones</h3>
                <Textarea rows={4} className="border rounded-md p-2 bg-white w-full" />
              </div>
              {renderSignatures()}
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4 md:p-8 font-sans">
      {/* Barra superior (una sola línea) */}
      <div className="w-full max-w-7xl">
        <Header
          onReset={onReset}
          onDownload={handleDownload}
          onBackToList={onBackToList}
          activeDocument={activeDocument}
          onShowKardex={() => setActiveDocument('kardex')}
          onGenerateHomologacion={() => setActiveDocument('homologacion')}
          onShowTesis={() => setActiveDocument('tesis')}
          onShowCierrePensum={() => setActiveDocument('cierre')}
        />
      </div>

      {/* Contenido imprimible */}
      <div
        ref={reportRef}
        className="w-full max-w-7xl bg-white shadow-2xl p-4"
        style={{ minWidth: '1024px', minHeight: '297mm' }}
      >
        {/* Encabezado del reporte: logo izquierda, nombre al centro, espacio derecha */}
        <div className="flex justify-between items-center border-b-4 border-blue-900 pb-2 mb-2">
          <Image src={logoUrl} alt="University Logo" width={90} height={90} crossOrigin="anonymous" />
          <h1 className="text-4xl font-bold text-blue-900 font-serif tracking-wider">
            {universityName}
          </h1>
          <div className="w-24" />
        </div>

        {showInfoCards && (
          <InfoCards
            student={student}
            courses={courses}
            calculatedAverage={calculatedAverage}
          />
        )}

        <main className="flex-1 pt-4">
          <h2 className="text-center text-2xl font-bold text-gray-800 my-4">{documentTitle}</h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
