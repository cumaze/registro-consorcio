
"use client";

import { useState, useRef } from "react";
import * as XLSX from 'xlsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Search, FileText, Trash2, ShieldAlert, UploadCloud } from "lucide-react";
import { Header } from "@/components/layout/header";
import type { Student, Course } from "@/lib/academic-data";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { SpecializationCourses } from "@/app/page";

type StudentSelectorProps = {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onReset: () => void;
  logoUrl: string;
  onDeleteBatch: (batchId: string) => void;
  onSpecializationUpload: (
    student: Student,
    courses: Partial<Course>[],
    gradeLevel: keyof SpecializationCourses
  ) => void;
};

type GradeLevelFilter = 'Licenciatura' | 'Maestria' | 'Doctorado' | 'Todos';

export function StudentSelector({ students, onSelectStudent, onReset, logoUrl, onDeleteBatch, onSpecializationUpload }: StudentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeLevelFilter, setGradeLevelFilter] = useState<GradeLevelFilter>('Todos');
  const specializationFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const currentStudentRef = useRef<Student | null>(null);

  const handleSpecializationUploadClick = (student: Student) => {
    currentStudentRef.current = student;
    specializationFileInputRef.current?.click();
  };

  const handleSpecializationFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const studentForUpload = currentStudentRef.current;

    if (!file || !studentForUpload) return;

    const fileName = file.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let isValid = false;
    let gradeLevel: keyof SpecializationCourses | null = null;

    if (fileName.startsWith('especializacion licenciatura')) {
      isValid = true;
      gradeLevel = 'licenciatura';
    } else if (fileName.startsWith('especializacion maestria') || fileName.startsWith('especializacion maestria')) {
      isValid = true;
      gradeLevel = 'maestria';
    } else if (fileName.startsWith('especializacion doctorado')) {
      isValid = true;
      gradeLevel = 'doctorado';
    }

    if (!isValid || !gradeLevel) {
      toast({
        variant: "destructive",
        title: "Archivo de especialización incorrecto",
        description: "El nombre debe ser 'especialización [licenciatura|maestria|doctorado].xlsx'",
      });
      if (specializationFileInputRef.current) {
        specializationFileInputRef.current.value = "";
      }
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);

      const courses = json.map(row => ({ name: row.name, credits: 5.4 }));

      if (gradeLevel) {
        onSpecializationUpload(studentForUpload, courses, gradeLevel);
      }

      toast({
        title: "Éxito",
        description: `Cursos de especialización para ${gradeLevel} cargados correctamente y asignados a ${studentForUpload.firstName}.`
      });

    } catch (error: any) {
      console.error("Error processing specialization file:", error);
      toast({
        variant: "destructive",
        title: "Error al procesar archivo de especialización",
        description: error.message || "Hubo un problema al leer el archivo.",
      });
    } finally {
      if (specializationFileInputRef.current) {
        specializationFileInputRef.current.value = "";
      }
    }
  };


  const filteredStudents = students.filter(student => {
    const matchesSearchTerm = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGradeLevel = 
      gradeLevelFilter === 'Todos' || 
      student.gradeLevel.toLowerCase().includes(gradeLevelFilter.toLowerCase());

    return matchesSearchTerm && matchesGradeLevel;
  });

  const getBatchDisplayName = (batchId: string) => {
    const parts = batchId.split('-');
    const grade = parts[0];
    const timestamp = new Date(parseInt(parts[1])).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Lote: ${grade} @ ${timestamp}`;
  }

  return (
    <div className="w-full max-w-4xl">
        <input type="file" ref={specializationFileInputRef} onChange={handleSpecializationFileChange} className="hidden" accept=".xlsx, .xls" />
        <Header onReset={onReset} />
        <Card className="mt-8 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Lista de Estudiantes Cargados</CardTitle>
                <CardDescription>
                Busca y selecciona un estudiante para ver su reporte académico detallado.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center gap-2 mb-4">
                    <Button variant={gradeLevelFilter === 'Todos' ? 'default' : 'outline'} onClick={() => setGradeLevelFilter('Todos')}>Todos</Button>
                    <Button variant={gradeLevelFilter === 'Licenciatura' ? 'default' : 'outline'} onClick={() => setGradeLevelFilter('Licenciatura')}>Licenciatura</Button>
                    <Button variant={gradeLevelFilter === 'Maestria' ? 'default' : 'outline'} onClick={() => setGradeLevelFilter('Maestria')}>Maestría</Button>
                    <Button variant={gradeLevelFilter === 'Doctorado' ? 'default' : 'outline'} onClick={() => setGradeLevelFilter('Doctorado')}>Doctorado</Button>
                </div>
                <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Buscar por nombre, apellido o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                </div>
                <ScrollArea className="h-96 w-full rounded-md border">
                <div className="p-4">
                    {filteredStudents.length > 0 ? (
                    <ul className="space-y-2">
                        {filteredStudents.map((student) => (
                        <li key={student.studentId}>
                            <div className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-md">{`${student.firstName} ${student.lastName}`}</p>
                                        <p className="text-sm text-gray-500">{`ID: ${student.studentId} | ${student.gradeLevel}`}</p>
                                        <div className="flex items-center gap-2">
                                          <p className="text-xs font-mono text-gray-400">{getBatchDisplayName(student.batchId)}</p>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <button className="text-red-500 hover:text-red-700 transition-colors">
                                                <Trash2 className="h-3 w-3"/>
                                              </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                  <div className="flex items-center gap-2">
                                                    <ShieldAlert className="h-6 w-6 text-destructive"/>
                                                    ¿Estás seguro de eliminar este lote?
                                                  </div>
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Esta acción es irreversible. Se eliminarán todos los estudiantes asociados al lote <strong>{getBatchDisplayName(student.batchId)}</strong>. Esto puede incluir estudiantes que no están visibles actualmente si tienes filtros aplicados.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => onDeleteBatch(student.batchId)} className="bg-destructive hover:bg-destructive/90">
                                                  Sí, eliminar lote
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" onClick={() => handleSpecializationUploadClick(student)}>
                                      <UploadCloud className="mr-2 h-4 w-4" />
                                      Especialización
                                  </Button>
                                  <Button onClick={() => onSelectStudent(student)}>
                                      <FileText className="mr-2 h-4 w-4" />
                                      Ver Reporte
                                  </Button>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                        <Search className="h-12 w-12 mb-4" />
                        <p className="font-semibold">No se encontraron estudiantes</p>
                        <p className="text-sm">Intenta con otro término de búsqueda o cambia el filtro de nivel.</p>
                    </div>
                    )}
                </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                 <p className="text-sm text-gray-500">{`${filteredStudents.length} de ${students.length} estudiante(s) mostrados.`}</p>
            </CardFooter>
        </Card>
    </div>
  );
}
