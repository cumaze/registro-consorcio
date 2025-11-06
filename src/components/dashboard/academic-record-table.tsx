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
import { inductionCourses, maestriaCursosBasicos, professionalCourses, specializationCourses } from "@/lib/academic-data";

type AcademicRecordTableProps = {
  records: Course[];
  student: Student;
  onAverageCalculated: (average: number) => void;
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

export function AcademicRecordTable({ records, student, onAverageCalculated }: AcademicRecordTableProps) {
  const totalRows = 25; 

  const studentCourses = records;

  const fixedCoursesCount = studentCourses.length;
  
  const remainingRows = Math.max(0, totalRows - fixedCoursesCount);
  const emptyRows = Array(remainingRows).fill(null);
  
  let courseCounter = 0;
  
  const [courseGrades, setCourseGrades] = useState< { name: string; numericGrade: number; }[]>([]);

  useEffect(() => {
    const grades: { name: string; numericGrade: number; }[] = [];
    studentCourses.forEach(course => {
        let numericGrade: number;

        if (course.name === "Hombre Trabajo y Sociedad") {
             numericGrade = Math.floor(Math.random() * (79 - 70 + 1)) + 70; // CC: 70-79
        } else if (course.name === "Microeconomía") {
             numericGrade = Math.floor(Math.random() * (69 - 1 + 1)) + 1; // C: 1-69
        } else if (["Dirección del Factor Humano", "Logística Administrativa", "Operaciones Financieras"].includes(course.name!)) {
            numericGrade = Math.floor(Math.random() * (89 - 80 + 1)) + 80; // BB: 80-89
        } else if (course.name?.startsWith("Análisis") || course.name?.startsWith("Marco")) {
             numericGrade = Math.floor(Math.random() * (89 - 73 + 1)) + 73; // B: 73-89
        } else if (course.name === "Metodología de la investigación") {
            numericGrade = Math.floor(Math.random() * (100 - 83 + 1)) + 83; // A: 83-100
        }
        else {
             numericGrade = Math.floor(Math.random() * (100 - 90 + 1)) + 90; // AA: 90-100
        }
        grades.push({ name: course.name, numericGrade });
    });
    setCourseGrades(grades);
    
    if (grades.length > 0) {
        const average = Math.round(grades.reduce((sum, g) => sum + g.numericGrade, 0) / 25);
        onAverageCalculated(average);
    }

  }, [records, student.studentId, onAverageCalculated]);


  const renderCourses = (courses: Course[], title: string) => (
    <>
      <TableRow className="bg-gray-200 hover:bg-gray-200">
        <TableCell colSpan={8} className="font-bold text-center text-gray-700 py-1">
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
          <TableRow key={`${title}-${course.name}`} className="h-[38px]">
            <TableCell className="font-mono text-center border-x">{currentIndex + 1}</TableCell>
            <TableCell className="border-r">{student.curriculumCloseDate}</TableCell>
            <TableCell className="border-r">En línea</TableCell>
            <TableCell className="font-medium border-r">{course.name}</TableCell>
            <TableCell className="text-center font-mono border-r p-0">
               {alphabeticGrade}
            </TableCell>
            <TableCell className="text-center font-mono border-r">
              {sistemaEGrade}
            </TableCell>
            <TableCell className="text-center font-mono border-r">{numericGrade}</TableCell>
            <TableCell className="text-center font-mono">{course.credits}</TableCell>
          </TableRow>
        );
      })}
    </>
  );

  const renderThesisRow = () => {
    const numericGrade = Math.floor(Math.random() * (100 - 83 + 1)) + 83;
    const { alphabetic: alphabeticGrade, systemE: sistemaEGrade } = getNewGradeDetails(numericGrade);

    return (
       <TableRow>
          <TableCell className="font-mono text-center border-t-2 border-b-2 border-l-2 border-black">{courseCounter + 1}</TableCell>
          <TableCell className="border-t-2 border-b-2 border-black">{student.curriculumCloseDate}</TableCell>
          <TableCell className="border-t-2 border-b-2 border-r border-black">En línea</TableCell>
          <TableCell className="font-medium border-t-2 border-b-2 border-r border-black">Tesis de Graduación</TableCell>
          <TableCell className="text-center font-mono p-0 border-t-2 border-b-2 border-r border-black">{alphabeticGrade}</TableCell>
          <TableCell className="text-center font-mono border-t-2 border-b-2 border-r border-black">{sistemaEGrade}</TableCell>
          <TableCell className="text-center font-mono border-t-2 border-b-2 border-r border-black">{numericGrade}</TableCell>
          <TableCell className="text-center font-mono border-t-2 border-b-2 border-r-2 border-black">{student.thesisCredits}</TableCell>
       </TableRow>
    );
  };


  return (
    <div className="border-2 border-gray-300">
        <div className="grid grid-cols-12">
            <div className="col-span-12 p-0">
                 <Table>
                    <TableHeader>
                    <TableRow className="bg-gray-800 hover:bg-gray-800">
                        <TableHead className="w-[50px] text-white text-center border-x">No</TableHead>
                        <TableHead className="w-[150px] text-white border-r">Fecha administrativa</TableHead>
                        <TableHead className="w-[150px] text-white border-r">Metodología</TableHead>
                        <TableHead className="text-white border-r">Nombre del curso</TableHead>
                        <TableHead className="w-[120px] text-center text-white border-r">Nota Alfabética</TableHead>
                        <TableHead className="w-[150px] text-center text-white border-r">Sistema E</TableHead>
                        <TableHead className="w-[120px] text-center text-white border-r">Nota Numérica</TableHead>
                        <TableHead className="w-[80px] text-center text-white">Créditos</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderCourses(studentCourses.filter(c => inductionCourses.some(ic => ic.name === c.name)), "Cursos de Inducción")}
                        {renderCourses(studentCourses.filter(c => maestriaCursosBasicos.some(mbc => mbc.name === c.name)), "Cursos Básicos")}
                        {renderCourses(studentCourses.filter(c => professionalCourses.some(pc => pc.name === c.name)), "Cursos Optativos Profesionales")}
                        {renderCourses(studentCourses.filter(c => specializationCourses.some(sc => sc.name === c.name)), "Cursos de Especialización")}
                        
                        {fixedCoursesCount < totalRows + 1 && renderThesisRow()}

                        {emptyRows.map((_, index) => (
                             <TableRow key={`empty-${index}`} className="h-[38px]">
                                <TableCell className="font-mono text-center border-x">{courseCounter + (student.thesisCredits > 0 ? 1: 0) + index + 1}</TableCell>
                                <TableCell className="border-r">{student.curriculumCloseDate}</TableCell>
                                <TableCell className="border-r"></TableCell>
                                <TableCell className="font-medium border-r"></TableCell>
                                <TableCell className="text-center font-mono border-r"></TableCell>
                                <TableCell className="text-center font-mono border-r"></TableCell>
                                <TableCell className="text-center font-mono border-r"></TableCell>
                                <TableCell className="text-center font-mono"></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
  );
}
