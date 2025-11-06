
"use client";

import type { Course, Student } from "@/lib/academic-data";
import { inductionCourses, professionalCourses, licenciaturaCursosProfesionales, doctoradoCursosProfesionales } from "@/lib/academic-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type HomologacionCursosProps = {
    student: Student;
    courses: Course[];
};

export function HomologacionCursos({ student, courses }: HomologacionCursosProps) {

    const inductionCourseNames = new Set(inductionCourses.map(ic => ic.name));
    
    // We want to show only "Cursos Básicos" and "Cursos Optativos Profesionales"
    const professionalCourseSet = new Set([
        ...professionalCourses.map(c => c.name),
        ...licenciaturaCursosProfesionales.map(c => c.name),
        ...doctoradoCursosProfesionales.map(c => c.name)
    ]);
    
    const filteredCourses = courses.filter(course => 
        !inductionCourseNames.has(course.name) &&
        !course.id.startsWith('spec-') && // Exclude specialization courses by id prefix
        !course.name.toLowerCase().includes("tesis")
    );
    
    const tableRows = filteredCourses.map(course => {
        return {
            niuCourse: course,
            usmCourse: course, 
        };
    });

    const studentName = `${student.firstName} ${student.lastName}`;

    return (
        <div className="p-4 bg-white text-gray-800">

            <div className="text-sm space-y-1 mb-6">
                <p><span className="font-semibold">PARA:</span> DEPARTAMENTO DE ADMISIONES</p>
                <p><span className="font-semibold">DE:</span> VICERRECTORIA ACADEMICA</p>
                <p><span className="font-semibold">ASUNTO:</span> Propuesta de Homologación de Cursos</p>
                <p><span className="font-semibold">FECHA:</span> {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 {student.careerName && student.careerName !== 'N/A' && (
                    <p><span className="font-semibold">CARRERA:</span> {student.careerName}</p>
                 )}
            </div>
            
            <p className="mb-6">
                Presento a continuación la propuesta de homologación de cursos del programa de <span className="font-bold">{student.gradeLevel} en {student.affectation}</span>, para el estudiante <span className="font-bold">{studentName}</span> con número de ID <span className="font-bold">{student.studentId}</span>.
            </p>

            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-800 hover:bg-gray-800">
                        <TableHead className="text-white font-bold text-center">Cursos NIU</TableHead>
                        <TableHead className="text-white font-bold text-center">Cursos USM</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableRows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell className="border p-2">{row.niuCourse?.name || ''}</TableCell>
                            <TableCell className="border p-2">{row.usmCourse?.name || ''}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
