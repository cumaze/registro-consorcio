"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Student } from "@/lib/academic-data";

type TesisGradeReportProps = {
  student: Student;
  counselorSignature: string | null;
  secretarySignature: string | null;
  coordinatorSignature: string | null;
  thesisGrade: { numeric: number; alphabetic: string; systemE: string } | null;
};

export function TesisGradeReport({
  student,
  counselorSignature,
  secretarySignature,
  coordinatorSignature,
  thesisGrade,
}: TesisGradeReportProps) {
  const [universityName, setUniversityName] = useState("Consortium Universitas");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("universityName");
      if (stored && stored.trim() !== "") setUniversityName(stored);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="p-4 text-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          CALIFICACIÓN DE TESIS DE GRADO
        </h1>
        <p className="text-lg font-semibold">{universityName}</p>
      </div>

      <div className="text-sm leading-6">
        <p className="mb-4">
          La Secretaría de la Facultad de{" "}
          <span className="font-semibold">{student.school || "Facultad"}</span>{" "}
          de {universityName}, certifica que el estudiante{" "}
          <span className="font-semibold">
            {student.firstName} {student.lastName}
          </span>
          , con ID <span className="font-semibold">{student.studentId}</span>, ha
          culminado el programa de{" "}
          <span className="font-semibold">
            {student.careerName || "Licenciatura"}
          </span>
          .
        </p>

        <p className="mb-4">
          Su proyecto de tesis de graduación fue evaluado y aprobado con la
          siguiente calificación:
        </p>

        {thesisGrade && (
          <div className="text-center my-6">
            <h3 className="text-xl font-bold mb-2">
              Proyecto de Tesis de Graduación
            </h3>
            <p className="text-4xl font-bold text-blue-900">
              {thesisGrade.numeric}
            </p>
            <p className="mt-2">
              Nota Alfabética:{" "}
              <span className="font-semibold">{thesisGrade.alphabetic}</span>
            </p>
            <p>
              Sistema E:{" "}
              <span className="font-semibold">{thesisGrade.systemE}</span>
            </p>
          </div>
        )}

        <p className="mt-8">
          Esta calificación certifica la culminación exitosa de los
          requerimientos académicos para la obtención del grado.
        </p>
        {/* FECHA eliminada */}
      </div>

      {/* Firmas con imágenes si existen */}
      <div className="mt-12 grid grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center">
          <div className="h-24 w-64 flex items-center justify-center border-b border-gray-400 mb-2">
            {counselorSignature ? (
              <Image
                src={counselorSignature}
                alt="Firma Consejero / Revisor"
                width={220}
                height={96}
                style={{ objectFit: "contain", maxHeight: "90px", width: "auto" }}
                crossOrigin="anonymous"
              />
            ) : null}
          </div>
          <p className="font-semibold">Consejero / Revisor</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-24 w-64 flex items-center justify-center border-b border-gray-400 mb-2">
            {secretarySignature ? (
              <Image
                src={secretarySignature}
                alt="Firma Secretaría"
                width={220}
                height={96}
                style={{ objectFit: "contain", maxHeight: "90px", width: "auto" }}
                crossOrigin="anonymous"
              />
            ) : null}
          </div>
          <p className="font-semibold">Secretaría</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-24 w-64 flex items-center justify-center border-b border-gray-400 mb-2">
            {coordinatorSignature ? (
              <Image
                src={coordinatorSignature}
                alt="Firma Coordinador"
                width={220}
                height={96}
                style={{ objectFit: "contain", maxHeight: "90px", width: "auto" }}
                crossOrigin="anonymous"
              />
            ) : null}
          </div>
          <p className="font-semibold">Coordinador</p>
        </div>
      </div>
    </div>
  );
}
