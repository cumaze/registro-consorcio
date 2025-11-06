"use client";

import type { Student } from "@/lib/academic-data";
import Image from "next/image";

type CierrePensumProps = {
  student: Student;
  counselorSignature: string | null;
  secretarySignature: string | null;
  coordinatorSignature: string | null;
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

export function CierrePensum({ student, counselorSignature, secretarySignature, coordinatorSignature }: CierrePensumProps) {
  const studentName = `${student.firstName} ${student.lastName}`;

  return (
    <div className="p-8 bg-white text-gray-800 font-serif text-lg leading-relaxed">
      
      <p className="mb-8 text-center">
        La secretaría académica de <span className="font-bold">{student.university}</span> de California.
      </p>

      <p className="mb-8 text-center">
        Certifica a la estudiante <span className="font-bold">{studentName}</span>
      </p>

      <p className="mb-8 text-center">
        Que ha llenado los requisitos y culminó con éxito el plan de estudios de la carrera.
      </p>

      <p className="mb-12 text-center font-bold text-xl">
        "{student.careerName}"
      </p>
      
      <p className="mb-12 text-center">
        Este registro se le entrega al estudiante para que lo use apropiadamente.
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
