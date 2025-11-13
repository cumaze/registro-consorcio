
"use client";

import type { Student } from "@/lib/academic-data";
import Image from "next/image";

type TesisGradeReportProps = {
  student: Student;
  universityName: string;
  counselorSignature: string | null;
  secretarySignature: string | null;
  coordinatorSignature: string | null;
  thesisGrade: { numeric: number; alphabetic: string; systemE: string; } | null;
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

export function TesisGradeReport({ student, universityName, counselorSignature, secretarySignature, coordinatorSignature, thesisGrade }: TesisGradeReportProps) {
  const studentName = `${student.firstName} ${student.lastName}`;

  if (!thesisGrade) {
    return (
      <div className="p-8 bg-white text-gray-800 font-serif text-lg leading-relaxed text-center">
        <p>Este estudiante no tiene créditos de tesis asignados.</p>
      </div>
    )
  }

  return (
    <div className="p-8 bg-white text-gray-800 font-serif text-lg leading-relaxed">
      
      <p className="mb-8">
        La Secretaría de la Facultad de <span className="font-bold">{student.school}</span> de <span className="font-bold">{universityName}</span>, certifica que el estudiante <span className="font-bold">{studentName}</span>, con ID <span className="font-bold">{student.studentId}</span>, ha culminado el programa de <span className="font-bold">{student.careerName}</span>.
      </p>

      <p className="mb-8">
        Su proyecto de tesis de graduación fue evaluado y aprobado con la siguiente calificación:
      </p>

      <div className="flex justify-center my-12">
        <div className="border-4 border-gray-700 p-6 text-center shadow-lg w-full max-w-md">
          <p className="text-xl mb-2">Proyecto de Tesis de Graduación</p>
          <p className="text-5xl font-bold text-blue-900 mb-4">{thesisGrade.numeric}</p>
          <div className="flex justify-around text-lg">
            <p><span className="font-semibold">Nota Alfabética:</span> {thesisGrade.alphabetic}</p>
            <p><span className="font-semibold">Sistema E:</span> {thesisGrade.systemE}</p>
          </div>
        </div>
      </div>

      <p className="mb-12">
        Esta calificación certifica la culminación exitosa de los requerimientos académicos para la obtención del grado.
      </p>

      <div className="mt-24 space-y-8">
        <div className="grid grid-cols-3 gap-8 pt-8">
            <SignatureBox
              title="Consejero/ Revisor"
              signature={counselorSignature}
            />
            <SignatureBox
              title="Secretaria"
              signature={secretarySignature}
            />
            <SignatureBox
              title="Coordinador"
              signature={coordinatorSignature}
            />
        </div>
      </div>

    </div>
  );
}
