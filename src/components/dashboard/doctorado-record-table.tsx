
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Course, Student } from "@/lib/academic-data";
import { inductionCourses, doctoradoCursosBasicos, doctoradoCursosProfesionales } from "@/lib/academic-data";

type DoctoradoRecordTableProps = {
  records: Course[];
  student: Student;
  onAverageCalculated: (average: number) => void;
  thesisGrade: { numeric: number; alphabetic: string; systemE: string; } | null;
  onEditCourse: (course: Course) => void;
};

const getNewGradeDetails = (numericGrade: number): { alphabetic: string, systemE: string } => {
    if (numericGrade >= 90) return { alphabetic: "A", systemE: "EXCELENTE" };
    if (numericGrade >= 83) return { alphabetic: "A", systemE: "BUENO" };
    if (numericGrade >= 80) return { alphabetic: "B", systemE: "BUENO" };
    if (numericGrade >= 73) return { alphabetic: "B", systemE: "SUFICIENTE" };
    if (numericGrade >= 70) return { alphabetic: "C", systemE: "SUFICIENTE" };
    if (numericGrade >= 1) return { alphabetic: "D", systemE: "INSUFICIENTE" };
    return { alphabetic: "F", systemE: "INSUFICIENTE" };
};

export function DoctoradoRecordTable({ records, student, onAverageCalculated, thesisGrade, onEditCourse }: DoctoradoRecordTableProps) {
  const totalRows = 24; 

  const studentCourses = records.filter(c => c.name.toLowerCase() !== "tesis de graduación");
  const specializationCourses = studentCourses.filter(c => c.id.startsWith('spec-'));
  const fixedCoursesCount = studentCourses.length;
  
  const remainingRows = Math.max(0, totalRows - fixedCoursesCount - (student.thesisCredits > 0 ? 1 : 0));
  const emptyRows = Array(remainingRows).fill(null);
  
  let courseCounter = 0;
  
  const [courseGrades, setCourseGrades] = useState<{ name: string; numericGrade: number; }[]>([]);

  const horasLectivas = 1230;
  const courseCountForAverage = studentCourses.length > 0 ? studentCourses.length : 1;
  const horasPromedio = Math.round(horasLectivas / courseCountForAverage);
  
  const totalCredits = 123;
  const creditosPromedio = studentCourses.length > 0 ? (totalCredits / studentCourses.length).toFixed(2) : '0.00';


  useEffect(() => {
    const grades = studentCourses.map(course => {
        const numericGrade = Math.floor(Math.random() * (100 - 80 + 1)) + 80; // Random grade between 80-100 for doctorate
        return { name: course.name, numericGrade };
    });
    setCourseGrades(grades);
    
    const courseGradesForAvg = grades.map(g => g.numericGrade);
    if (thesisGrade) {
        courseGradesForAvg.push(thesisGrade.numeric);
    }
    
    let totalSum = courseGradesForAvg.reduce((sum, g) => sum + g, 0);
    
    while(courseGradesForAvg.length < totalRows) {
        courseGradesForAvg.push(0);
    }

    totalSum = courseGradesForAvg.slice(0, totalRows).reduce((sum, g) => sum + g, 0);

    const average = totalRows > 0 ? Math.round(totalSum / totalRows) : 0;
    onAverageCalculated(average);

  }, [student.studentId, records, thesisGrade, onAverageCalculated]);

  const renderCourses = (courses: Course[], title: string, isSpecialization = false) => (
    <>
      <TableRow className="bg-gray-200 hover:bg-gray-200">
        <TableCell colSpan={9} className="font-bold text-center text-gray-700 py-1">
          {title}
        </TableCell>
      </TableRow>
      {courses.map((course) => {
        const gradeInfo = courseGrades.find(g => g.name === course.name);
        const numericGrade = gradeInfo ? gradeInfo.numericGrade : 0;
        const { alphabetic: alphabeticGrade, systemE: sistemaEGrade } = getNewGradeDetails(numericGrade);
        const currentIndex = courseCounter;
        courseCounter++;

        return (
          <TableRow key={`${title}-${course.id}`} className="h-[38px] group">
            <TableCell className="font-mono text-center border-x">{currentIndex + 1}</TableCell>
            <TableCell className="border-r">{student.curriculumCloseDate}</TableCell>
            <TableCell className="border-r">En línea</TableCell>
            <TableCell className="font-medium border-r">
              <div className="flex items-center justify-between">
                <span>{course.name}</span>
                {!isSpecialization && (
                   <button onClick={() => onEditCourse(course)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                     {/* No icon here */}
                   </button>
                )}
              </div>
            </TableCell>
            <TableCell className="text-center font-mono border-r">{horasPromedio}</TableCell>
            <TableCell className="text-center font-mono border-r p-0">{alphabeticGrade}</TableCell>
            <TableCell className="text-center font-mono border-r">{sistemaEGrade}</TableCell>
            <TableCell className="text-center font-mono border-r">{numericGrade}</TableCell>
            <TableCell className="text-center font-mono">{creditosPromedio}</TableCell>
          </TableRow>
        );
      })}
    </>
  );

  const renderThesisRow = () => {
    if (!thesisGrade) return null;

    return (
       <TableRow>
          <TableCell className="font-mono text-center border-t-2 border-b-2 border-l-2 border-black">{courseCounter + 1}</TableCell>
          <TableCell className="border-t-2 border-b-2 border-black">{student.curriculumCloseDate}</TableCell>
          <TableCell className="border-t-2 border-b-2 border-r border-black">En línea</TableCell>
          <TableCell className="font-medium border-t-2 border-b-2 border-r border-black">Tesis de Graduación</TableCell>
          <TableCell className="text-center font-mono border-t-2 border-b-2 border-r border-black"></TableCell>
          <TableCell className="text-center font-mono p-0 border-t-2 border-b-2 border-r border-black">{thesisGrade.alphabetic}</TableCell>
          <TableCell className="text-center font-mono border-t-2 border-b-2 border-r border-black">{thesisGrade.systemE}</TableCell>
          <TableCell className="text-center font-mono border-t-2 border-b-2 border-r border-black">{thesisGrade.numeric}</TableCell>
          <TableCell className="text-center font-mono border-t-2 border-b-2 border-r-2 border-black">{student.thesisCredits}</TableCell>
       </TableRow>
    );
  };

  return (
    <div className="border-2 border-gray-300">
        <Table>
            <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-gray-800">
                <TableHead className="w-[50px] text-white text-center border-x">No</TableHead>
                <TableHead className="w-[150px] text-white border-r">Fecha administrativa</TableHead>
                <TableHead className="w-[150px] text-white border-r">Metodología</TableHead>
                <TableHead className="text-white border-r">Nombre del curso</TableHead>
                <TableHead className="w-[120px] text-center text-white border-r">Horas promedio</TableHead>
                <TableHead className="w-[120px] text-center text-white border-r">Nota Alfabética</TableHead>
                <TableHead className="w-[150px] text-center text-white border-r">Sistema E</TableHead>
                <TableHead className="w-[120px] text-center text-white border-r">Nota Numérica</TableHead>
                <TableHead className="w-[80px] text-center text-white">Créditos</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
                {renderCourses(studentCourses.filter(c => inductionCourses.some(ic => ic.name === c.name)), "Cursos de Inducción")}
                {renderCourses(studentCourses.filter(c => doctoradoCursosBasicos.some(dcb => dcb.name === c.name)), "Cursos Básicos")}
                {renderCourses(studentCourses.filter(c => doctoradoCursosProfesionales.some(dcp => dcp.name === c.name)), "Cursos Optativos Profesionales")}
                {renderCourses(specializationCourses, "Cursos Optativos de Especialización", true)}
                
                {student.thesisCredits > 0 && renderThesisRow()}

                {emptyRows.map((_, index) => (
                    <TableRow key={`empty-${index}`} className="h-[38px]">
                        <TableCell className="font-mono text-center border-x">{courseCounter + (student.thesisCredits > 0 ? 1 : 0) + index + 1}</TableCell>
                        <TableCell className="border-r">{student.curriculumCloseDate}</TableCell>
                        <TableCell className="border-r"></TableCell>
                        <TableCell className="font-medium border-r"></TableCell>
                        <TableCell className="text-center font-mono border-r"></TableCell>
                        <TableCell className="text-center font-mono border-r"></TableCell>
                        <TableCell className="text-center font-mono border-r"></TableCell>
                        <TableCell className="text-center font-mono border-r"></TableCell>
                        <TableCell className="text-center font-mono"></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}

    
