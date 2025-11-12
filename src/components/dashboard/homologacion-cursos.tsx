"use client";

import { useEffect, useState } from "react";
import type { Student, Course } from "@/lib/academic-data";

type HomologacionCursosProps = {
  student: Student;
  courses: Course[];
};

/**
 * Solo contamos como “Profesionalización” los cursos que el Kardex ya tiene con estos prefijos:
 * - Maestría:      "prof-"
 * - Licenciatura:  "lic-prof-"
 * - Doctorado:     "doc-prof-"
 * - Técnico:       "tec-prof-"
 *
 * EXCLUIMOS:
 * - Especialización: "spec-"  (NO se muestran)
 * - Inducción/básicos (no usan esos prefijos)
 */
function esProfesionalizacionKardex(c: Course) {
  const id = String(c?.id || "").toLowerCase();
  return (
    id.startsWith("prof-") ||
    id.startsWith("lic-prof-") ||
    id.startsWith("doc-prof-") ||
    id.startsWith("tec-prof-")
  );
}

export function HomologacionCursos({ student, courses }: HomologacionCursosProps) {
  const [universityName, setUniversityName] = useState("Consortium Universitas");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("universityName");
      if (stored && stored.trim() !== "") setUniversityName(stored);
    } catch {
      /* ignore */
    }
  }, []);

  // Solo los que YA están en el Kardex y son de profesionalización según prefijos.
  const filtered = (courses || []).filter(
    (c) => c?.name?.trim() && esProfesionalizacionKardex(c)
  );

  // Mapeo 1:1 (NIU ⇄ Origen) usando el mismo nombre en ambas columnas.
  const rows = filtered.map((c, i) => ({
    niu: c.name,
    usm: c.name,
    key: c.id || `${c.name}-${i}`,
  }));

  const carrera =
    student?.careerName && student.careerName !== "N/A"
      ? student.careerName
      : "Carrera";

  const facultad =
    student?.school && student.school !== "N/A"
      ? student.school
      : "Facultad";

  const grado = student?.gradeLevel || "Programa";
  const nombreEstudiante =
    `${student?.firstName ?? ""} ${student?.lastName ?? ""}`.trim() ||
    "Estudiante";
  const idEstudiante = student?.studentId || "ID";

  return (
    <div className="p-4 text-gray-900">
      {/* Encabezado */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-1">
          CUADRO COMPARATIVO DE CURSOS HOMOLOGADOS
        </h1>
      </div>

      {/* Cuerpo tipo memo - SIN FECHA */}
      <div className="mb-6 text-sm leading-6">
        <p>
          <span className="font-semibold">PARA:</span> DEPARTAMENTO DE ADMISIONES
        </p>
        <p>
          <span className="font-semibold">DE:</span> VICERRECTORÍA ACADÉMICA
        </p>
        <p>
          <span className="font-semibold">ASUNTO:</span> Propuesta de
          Homologación de Cursos
        </p>
        {/* FECHA eliminada */}
        <p className="mt-1">
          <span className="font-semibold">CARRERA:</span> {carrera}
        </p>

        <p className="mt-4">
          Presento a continuación la propuesta de homologación de cursos de
          <span className="font-semibold"> profesionalización</span> del
          programa de {grado} en {facultad}, para el estudiante{" "}
          <span className="font-semibold">{nombreEstudiante}</span> con número
          de ID <span className="font-semibold">{idEstudiante}</span>.
        </p>
      </div>

      {/* Cuadro comparativo: SOLO Profesionalización del Kardex */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 px-2 py-1 w-10">No.</th>
              <th className="border border-gray-400 px-2 py-1">
                Cursos {universityName}
              </th>
              <th className="border border-gray-400 px-2 py-1">
                Cursos Universidad de Origen
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="border border-gray-400 px-2 py-2 text-center"
                  colSpan={3}
                >
                  No hay cursos de profesionalización para mostrar.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={r.key}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-400 px-2 py-1 text-center">
                    {i + 1}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">{r.niu}</td>
                  <td className="border border-gray-400 px-2 py-1">{r.usm}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
