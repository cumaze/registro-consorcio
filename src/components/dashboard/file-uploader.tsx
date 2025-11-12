"use client";

import { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, Edit } from "lucide-react";
import * as XLSX from "xlsx";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Student, Course } from "@/lib/academic-data";
import {
  professionalCourses,
  inductionCourses,
  maestriaCursosBasicos,
  licenciaturaCursosBasicos,
  licenciaturaCursosProfesionales,
  doctoradoCursosBasicos,
  doctoradoCursosProfesionales,
  tecnicoCursosProfesionales,
} from "@/lib/academic-data";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

type FileUploaderProps = {
  onUpload: (data: {
    students: Student[];
    coursesByStudent: Record<string, Course[]>;
  }) => void;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  logoUrl: string;
  onSignatureUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
  setCounselorSignature: React.Dispatch<React.SetStateAction<string | null>>;
  setSecretarySignature: React.Dispatch<React.SetStateAction<string | null>>;
  setCoordinatorSignature: React.Dispatch<React.SetStateAction<string | null>>;
};

type GradeLevel =
  | "Licenciatura"
  | "Maestria"
  | "Doctorado"
  | "Técnico"
  | "Posdoctorado";

// shuffle determinístico por seed
const getRandomSubarray = (arr: any[], n: number, seed: string) => {
  let a = 1;
  for (let i = 0; i < seed.length; i++) a = (a + seed.charCodeAt(i)) % 1000;
  const rnd = () => {
    a = (a * 9301 + 49297) % 233280;
    return a / 233280;
  };
  const shuffled = [...arr].sort(() => rnd() - 0.5);
  return shuffled.slice(0, n);
};

const normalizeKey = (key: string): string => {
  if (!key) return "";
  return key
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/\s+/g, "");
};

export function FileUploader({
  onUpload,
  onLogoUpload,
  logoUrl,
  onSignatureUpload,
  setCounselorSignature,
  setSecretarySignature,
  setCoordinatorSignature,
}: FileUploaderProps) {
  // -------- estado nombre visible en pantalla inicial --------
  const DEFAULT_NAME = "Consortium Universitas";
  const [displayName, setDisplayName] = useState<string>(DEFAULT_NAME);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [tempName, setTempName] = useState<string>(displayName);
  // -----------------------------------------------------------

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const counselorSignatureRef = useRef<HTMLInputElement>(null);
  const secretarySignatureRef = useRef<HTMLInputElement>(null);
  const coordinatorSignatureRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const currentGradeLevelRef = useRef<GradeLevel>("Maestria");

  const handleExcelButtonClick = (gradeLevel: GradeLevel) => {
    currentGradeLevelRef.current = gradeLevel;
    fileInputRef.current?.click();
  };

  const handleLogoButtonClick = () => {
    logoInputRef.current?.click();
  };

  const handleNameSave = () => {
    const val = (tempName || "").trim();
    setDisplayName(val.length ? val : DEFAULT_NAME);
    setOpenNameDialog(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const gradeLevelForUpload = currentGradeLevelRef.current;

    if (file) {
      const fileName = file
        .name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      let isValid = false;
      let expectedKeyword = "";

      switch (gradeLevelForUpload) {
        case "Licenciatura":
          isValid = fileName.includes("licenciatura");
          expectedKeyword = "licenciatura";
          break;
        case "Maestria":
          isValid = fileName.includes("maestria");
          expectedKeyword = "maestria";
          break;
        case "Doctorado":
          isValid = fileName.includes("doctorado");
          expectedKeyword = "doctorado";
          break;
        case "Técnico":
          isValid = fileName.includes("tecnico");
          expectedKeyword = "tecnico";
          break;
        case "Posdoctorado":
          isValid =
            fileName.includes("posdoctorado") ||
            fileName.includes("pos doctorado") ||
            fileName.includes("postdoctorado");
          expectedKeyword = "posdoctorado";
          break;
      }

      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Archivo incorrecto",
          description: `El nombre del archivo debe contener la palabra '${expectedKeyword}'.`,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      try {
        const batchId = `${gradeLevelForUpload}-${Date.now()}`;
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        const studentSheetName = workbook.SheetNames[0];
        const studentWorksheet = workbook.Sheets[studentSheetName];
        if (!studentWorksheet) {
          throw new Error(`La primera hoja de cálculo no pudo ser leída.`);
        }
        const studentsJsonArray = XLSX.utils.sheet_to_json(studentWorksheet, {
          raw: false,
          defval: "",
        });

        if (studentsJsonArray.length === 0) {
          throw new Error(
            `La primera hoja de cálculo (Estudiantes) está vacía.`
          );
        }

        const students: Student[] = studentsJsonArray.map(
          (studentRaw: any, index) => {
            const lookupStudent: { [key: string]: any } = {};
            for (const key in studentRaw) {
              const newKey = normalizeKey(key);
              lookupStudent[newKey] = studentRaw[key];
            }

            const studentId =
              lookupStudent["iddeestudiante"] ||
              `temp-id-${index}-${Date.now()}`;

            const spanishGrades = [
              lookupStudent["sistemaespanoldenotas"],
              lookupStudent["sistemaespanoldenotas_1"],
              lookupStudent["sistemaespanoldenotas_2"],
              lookupStudent["sistemaespanoldenotas_3"],
            ].filter((grade) => grade && String(grade).trim() !== "");

            return {
              batchId: batchId,
              university: lookupStudent["nombredelauniversidad"] || "N/A",
              school: lookupStudent["nombredelafacultad"] || "N/A",
              firstName: lookupStudent["nombrealumno"] || "N/A",
              lastName: lookupStudent["apellidoalumno"] || "N/A",
              address: lookupStudent["direccion"] || "N/A",
              country: lookupStudent["pais"] || "N/A",
              city: lookupStudent["ciudad"] || "N/A",
              studentId: studentId,
              birthDate: lookupStudent["fechadenacimiento"] || "N/A",
              assignedTutor: "N/A",
              emphasis: "N/A",
              transferCredits:
                Number(lookupStudent["creditostransferidospreviamente"]) || 0,
              workExperienceCredits:
                Number(
                  lookupStudent["creditosporexpiritualaboral"] ||
                    lookupStudent["creditosporexperiencialaboral"]
                ) || 0,
              meritCredits:
                Number(lookupStudent["creditosobtenidospormeritodeestudio"]) ||
                0,
              gradeLevel: gradeLevelForUpload,
              thesisCredits:
                Number(lookupStudent["creditosportesisdegraduacion"]) ||
                (gradeLevelForUpload === "Técnico"
                  ? 10
                  : gradeLevelForUpload === "Posdoctorado"
                  ? 10
                  : 0),
              curriculumCloseDate:
                lookupStudent["nofechadecierredelpensum"] || "N/A",
              affectation: lookupStudent["nombredelafacultad"] || "N/A",
              average: Number(lookupStudent["promedio"]) || 0,
              spanishGrades: spanishGrades.length > 0 ? spanishGrades : [],
              careerName:
                lookupStudent["nombredelacarrera"] ||
                lookupStudent["carrera"] ||
                "N/A",
            };
          }
        );

        const coursesSheetName = workbook.SheetNames[1];
        const coursesWorksheet = workbook.Sheets[coursesSheetName];
        let coursesByStudent: Record<string, Course[]> = {};

        // inicializar
        students.forEach((student) => {
          coursesByStudent[student.studentId] = [];
        });

        // cursos automáticos por nivel
        students.forEach((student) => {
          const gradeLevel = student.gradeLevel.toLowerCase();
          let studentCourses: Partial<Course>[] = [];

          if (gradeLevel.includes("licenciatura")) {
            studentCourses = [
              ...inductionCourses.map((c) => ({ ...c, id: `ind-${c.name}` })),
              ...licenciaturaCursosBasicos.map((c) => ({
                ...c,
                id: `lic-bas-${c.name}`,
              })),
              ...getRandomSubarray(
                licenciaturaCursosProfesionales,
                10,
                student.studentId + "lic-prof"
              ).map((c) => ({ ...c, id: `lic-prof-${c.name}` })),
            ];
          } else if (
            gradeLevel.includes("doctorado") ||
            gradeLevel.includes("posdoctorado")
          ) {
            const mandatoryInduction = inductionCourses.map((c) => ({
              ...c,
              id: `ind-${c.name}`,
            }));
            const mandatoryBasic = doctoradoCursosBasicos.map((c) => ({
              ...c,
              id: `doc-bas-${c.name}`,
            }));
            const randomProfessional = getRandomSubarray(
              doctoradoCursosProfesionales,
              4,
              student.studentId + "doc-prof"
            ).map((c) => ({ ...c, id: `doc-prof-${c.name}` }));

            let allDoctorateCourses = [
              ...mandatoryInduction,
              ...mandatoryBasic,
              ...randomProfessional,
            ];

            allDoctorateCourses = allDoctorateCourses.sort(
              () => Math.random() - 0.5
            );
            studentCourses = allDoctorateCourses;
          } else if (gradeLevel.includes("técnico")) {
            studentCourses = [
              ...inductionCourses.map((c) => ({ ...c, id: `ind-${c.name}` })),
              ...getRandomSubarray(
                tecnicoCursosProfesionales,
                5,
                student.studentId + "tec-prof"
              ).map((c) => ({ ...c, id: `tec-prof-${c.name}` })),
            ];
          } else {
            // Maestría
            studentCourses = [
              ...inductionCourses.map((c) => ({ ...c, id: `ind-${c.name}` })),
              ...maestriaCursosBasicos.map((c) => ({
                ...c,
                id: `bas-${c.name}`,
              })),
              ...getRandomSubarray(
                professionalCourses,
                5,
                student.studentId + "prof"
              ).map((c) => ({ ...c, id: `prof-${c.name}` })),
            ];
          }
          coursesByStudent[student.studentId].push(
            ...(studentCourses as Course[])
          );
        });

        if (coursesWorksheet) {
          const allCourses: Course[] = XLSX.utils
            .sheet_to_json<any>(coursesWorksheet, {
              raw: false,
              defval: "",
            })
            .map((course, index) => {
              const normalizedCourse: { [key: string]: any } = {};
              for (const key in course) {
                const newKey = normalizeKey(key);
                normalizedCourse[newKey] = course[key];
              }
              return {
                id: String(index + 1),
                code: normalizedCourse["code"] || "",
                name: normalizedCourse["name"] || "",
                credits: Number(normalizedCourse.credits) || 0,
                grade: normalizedCourse["grade"] || "N/A",
                term: normalizedCourse["term"] || "",
                studentId: normalizedCourse["iddeestudiante"] || "",
              };
            });

          allCourses.forEach((course) => {
            if (course.studentId && coursesByStudent[course.studentId]) {
              coursesByStudent[course.studentId].push(course);
            }
          });
        }

        onUpload({ students, coursesByStudent });
      } catch (error: any) {
        console.error("Error processing Excel file:", error);
        toast({
          variant: "destructive",
          title: "Error al procesar el archivo",
          description:
            error.message ||
            "Hubo un problema al leer tu archivo de Excel. Revisa el formato y los nombres de las hojas.",
        });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      {/* Diálogo Cambiar nombre */}
      <AlertDialog open={openNameDialog} onOpenChange={setOpenNameDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiar nombre</AlertDialogTitle>
            <AlertDialogDescription>
              Este nombre solo dura mientras la app esté abierta.
              Al reiniciar, vuelve a <b>{DEFAULT_NAME}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-3">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Escribe el nombre a mostrar"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleNameSave}>
              Guardar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="w-full max-w-lg animate-fade-in-up shadow-2xl">
        <CardHeader className="text-center">
          {/* Encabezado: favicon + texto + botón cambiar nombre */}
          <div className="mx-auto mb-2 flex items-center justify-center gap-3">
            <Image
              src="/favicon.png"
              alt="Favicon"
              width={32}
              height={32}
              priority
            />
            <CardTitle className="font-headline text-3xl text-primary">
              {displayName}
            </CardTitle>
            <Button
              onClick={() => {
                setTempName(displayName);
                setOpenNameDialog(true);
              }}
              className="ml-2"
            >
              Cambiar nombre
            </Button>
          </div>

          <CardDescription className="text-md">
            Sube tu archivo de Excel, el logo y las firmas para generar los
            reportes.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 p-6 pt-2">
          {/* inputs ocultos */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".xlsx, .xls"
          />
          <input
            type="file"
            ref={logoInputRef}
            onChange={onLogoUpload}
            className="hidden"
            accept="image/png, image/jpeg, image/svg+xml"
          />
          <input
            type="file"
            ref={counselorSignatureRef}
            onChange={(e) => onSignatureUpload(e, setCounselorSignature)}
            className="hidden"
            accept="image/*"
          />
          <input
            type="file"
            ref={secretarySignatureRef}
            onChange={(e) => onSignatureUpload(e, setSecretarySignature)}
            className="hidden"
            accept="image/*"
          />
          <input
            type="file"
            ref={coordinatorSignatureRef}
            onChange={(e) => onSignatureUpload(e, setCoordinatorSignature)}
            className="hidden"
            accept="image/*"
          />

          {/* Botones importar */}
          <div className="grid grid-cols-1 gap-2 w-full">
            <Button
              onClick={() => handleExcelButtonClick("Técnico")}
              size="lg"
              className="w-full font-bold"
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              Importar Técnico (Excel)
            </Button>
            <Button
              onClick={() => handleExcelButtonClick("Licenciatura")}
              size="lg"
              className="w-full font-bold"
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              Importar Licenciatura (Excel)
            </Button>
            <Button
              onClick={() => handleExcelButtonClick("Maestria")}
              size="lg"
              className="w-full font-bold"
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              Importar Maestría (Excel)
            </Button>
            <Button
              onClick={() => handleExcelButtonClick("Doctorado")}
              size="lg"
              className="w-full font-bold"
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              Importar Doctorado (Excel)
            </Button>
            <Button
              onClick={() => handleExcelButtonClick("Posdoctorado")}
              size="lg"
              className="w-full font-bold"
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              Importar Pos Doctorado (Excel)
            </Button>
          </div>

          {/* PREVIEW del logo SUBIDO (centrado) */}
          <div className="w-full flex justify-center pt-2">
            <Image
              src={logoUrl}
              alt="Logo cargado"
              width={96}
              height={96}
              className="rounded-md shadow"
              crossOrigin="anonymous"
            />
          </div>

          {/* Zona de subir logo y firmas (dos columnas) */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              onClick={handleLogoButtonClick}
              size="lg"
              variant="outline"
              className="w-full font-bold"
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              Subir Logo
            </Button>
            <Button
              onClick={() => counselorSignatureRef.current?.click()}
              size="lg"
              variant="outline"
              className="w-full font-bold"
            >
              <Edit className="mr-2 h-5 w-5" />
              Firma Consejero
            </Button>
            <Button
              onClick={() => secretarySignatureRef.current?.click()}
              size="lg"
              variant="outline"
              className="w-full font-bold"
            >
              <Edit className="mr-2 h-5 w-5" />
              Firma Secretaria
            </Button>
            <Button
              onClick={() => coordinatorSignatureRef.current?.click()}
              size="lg"
              variant="outline"
              className="w-full font-bold"
            >
              <Edit className="mr-2 h-5 w-5" />
              Firma Coordinador
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
