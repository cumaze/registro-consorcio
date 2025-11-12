"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/layout/header";
import type { Student, Course } from "@/lib/academic-data";

type Props = {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onReset: () => void;
  logoUrl: string;
  onDeleteBatch: (batchId: string) => void;
  // ✅ Recibimos el callback que ya existe en Home
  onSpecializationUpload: (
    student: Student,
    courses: Partial<Course>[],
    gradeLevel: "tecnico" | "licenciatura" | "maestria" | "doctorado"
  ) => void;
};

function normalizeKey(key: string): string {
  return key
    ? key
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, "n")
        .replace(/\s+/g, "")
    : "";
}

// Mapea el gradeLevel del estudiante al que espera Home
function mapGradeLevel(student: Student): "tecnico" | "licenciatura" | "maestria" | "doctorado" {
  const gl = (student.gradeLevel || "").toLowerCase();
  if (gl.includes("técnico") || gl.includes("tecnico")) return "tecnico";
  if (gl.includes("licenciatura")) return "licenciatura";
  if (gl.includes("maestr")) return "maestria";
  // Posdoctorado lo tratamos como doctorado (así estaba en Home)
  return "doctorado";
}

export function StudentSelector({
  students,
  onSelectStudent,
  onReset,
  logoUrl,
  onDeleteBatch,
  onSpecializationUpload,
}: Props) {
  // ✅ Un input oculto y guardamos el estudiante al que se le sube la especialización
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [studentForSpec, setStudentForSpec] = useState<Student | null>(null);

  // Click en botón "Especialización" → abre file picker
  const handleOpenSpecExcel = (student: Student) => {
    setStudentForSpec(student);
    fileInputRef.current?.click();
  };

  // Cargar Excel de especialización → parsear → enviar arriba
  const handleSpecFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !studentForSpec) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      // Tomamos la PRIMERA hoja como lista de cursos de especialización
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { raw: false, defval: "" });

      // Aceptamos encabezados típicos: code,codigo; name,nombre; credits,creditos
      const parsed: Partial<Course>[] = rows.map((row: any) => {
        const m: Record<string, any> = {};
        for (const k in row) m[normalizeKey(k)] = row[k];

        const name =
          m["name"] ||
          m["nombre"] ||
          m["curso"] ||
          m["asignatura"] ||
          m["materia"] ||
          "";

        const code = m["code"] || m["codigo"] || m["cod"] || "";
        const creditsRaw = m["credits"] ?? m["creditos"] ?? m["uv"] ?? m["cr"] ?? "";
        const credits = Number(creditsRaw) || 0;

        return {
          name: String(name).trim(),
          code: String(code).trim(),
          credits,
          // grade/term los rellenará Home cuando cree los spec-* (como ya lo hace)
        };
      }).filter(c => c.name && String(c.name).trim() !== "");

      const gl = mapGradeLevel(studentForSpec);
      onSpecializationUpload(studentForSpec, parsed, gl);
    } catch (err) {
      console.error("Error leyendo Excel de especialización:", err);
      // No usamos toasts aquí para no tocar tu UI; solo consola.
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStudentForSpec(null);
    }
  };

  // Agrupamos por batch para mostrar botón de borrar lote (sin tocar tu diseño original)
  const batches = Array.from(
    students.reduce((map, s) => {
      if (!map.has(s.batchId)) map.set(s.batchId, []);
      map.get(s.batchId)!.push(s);
      return map;
    }, new Map<string, Student[]>())
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Barra superior igual que el resto de pantallas */}
      <Header onReset={onReset} />

      {/* Input oculto para subir Excel de especialización */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSpecFileChange}
        accept=".xlsx,.xls"
        className="hidden"
      />

      <div className="bg-white shadow-2xl p-4 mt-4">
        {/* Encabezado con logo y título */}
        <div className="flex items-center justify-between border-b-4 border-blue-900 pb-2 mb-4">
          <div className="flex items-center gap-3">
            <Image src={logoUrl} alt="Logo" width={56} height={56} className="rounded" crossOrigin="anonymous" />
            <div>
              <h2 className="text-xl font-bold text-blue-900">Consortium Universitas</h2>
              <p className="text-sm text-gray-500">Selecciona un estudiante o carga su especialización</p>
            </div>
          </div>
        </div>

        {/* Tabla: Nombre | Especialización | Ver reporte */}
        <ScrollArea className="w-full">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-3 gap-2 px-2 py-2 bg-gray-50 border-b">
              <div className="font-semibold">Estudiante</div>
              <div className="font-semibold">Especialización</div>
              <div className="font-semibold">Acciones</div>
            </div>

            {batches.map(([batchId, group]) => (
              <div key={batchId} className="border rounded-md my-4">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b">
                  <div className="text-sm font-semibold">Lote: {batchId}</div>
                  <Button variant="outline" size="sm" onClick={() => onDeleteBatch(batchId)}>
                    Eliminar lote
                  </Button>
                </div>

                {group.map((s) => (
                  <div
                    key={s.studentId}
                    className="grid grid-cols-3 gap-2 items-center px-3 py-3 border-b last:border-0"
                  >
                    {/* Columna 1: Nombre */}
                    <div className="truncate">
                      <div className="font-medium">
                        {s.firstName} {s.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {s.studentId} • {s.gradeLevel}
                      </div>
                    </div>

                    {/* Columna 2: Botón Especialización (sube Excel) */}
                    <div>
                      <Button
                        variant="outline"
                        onClick={() => handleOpenSpecExcel(s)}
                        className="w-full"
                      >
                        Especialización
                      </Button>
                    </div>

                    {/* Columna 3: Ver reporte */}
                    <div className="flex justify-start">
                      <Button onClick={() => onSelectStudent(s)}>Ver reporte</Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
