"use client";

import { useState } from "react";
import { MainDashboard } from '@/components/dashboard/main-dashboard';
import { FileUploader } from "@/components/dashboard/file-uploader";
import { StudentSelector } from "@/components/dashboard/student-selector";
import { type Student, type Course } from '@/lib/academic-data';
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
import { Label } from "@/components/ui/label";


type AcademicData = {
  students: Student[];
  coursesByStudent: Record<string, Course[]>;
};

export type SpecializationCourses = {
  licenciatura: Partial<Course>[];
  maestria: Partial<Course>[];
  doctorado: Partial<Course>[];
};

const DEFAULT_LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/test-project-96eea.appspot.com/o/ni-logo.png?alt=media&token=89437976-96b5-4b0d-a36c-941c39050f4a";


export default function Home() {
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO_URL);

  const [counselorSignature, setCounselorSignature] = useState<string | null>(null);
  const [secretarySignature, setSecretarySignature] = useState<string | null>(null);
  const [coordinatorSignature, setCoordinatorSignature] = useState<string | null>(null);

  const [specializationCourses, setSpecializationCourses] = useState<SpecializationCourses>({
    licenciatura: [],
    maestria: [],
    doctorado: [],
  });
  
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourseName, setNewCourseName] = useState("");

  const handleStartEditingCourse = (course: Course) => {
    setEditingCourse(course);
    setNewCourseName(course.name);
  };
  
  const handleUpdateCourseName = () => {
    if (!editingCourse || !academicData || !selectedStudent) return;
    
    const studentId = selectedStudent.studentId;

    setAcademicData(prevData => {
      if (!prevData) return null;

      const newCoursesByStudent = JSON.parse(JSON.stringify(prevData.coursesByStudent));
      
      const studentCourses = newCoursesByStudent[studentId];
      if (studentCourses) {
        const courseIndex = studentCourses.findIndex((c: Course) => c.id === editingCourse.id);
        if (courseIndex > -1) {
          studentCourses[courseIndex].name = newCourseName.trim();
        }
      }

      return {
        ...prevData,
        coursesByStudent: newCoursesByStudent
      };
    });

    setEditingCourse(null);
    setNewCourseName("");
  };


  const handleUpload = (newData: AcademicData) => {
    setAcademicData(prevData => {
      if (!prevData) {
        return newData;
      }

      const studentMap = new Map(prevData.students.map(s => [s.studentId, s]));
      newData.students.forEach(newStudent => {
        studentMap.set(newStudent.studentId, newStudent);
      });
      const allStudents = Array.from(studentMap.values());

      const allCoursesByStudent = {
        ...prevData.coursesByStudent,
        ...newData.coursesByStudent,
      };

      return {
        students: allStudents,
        coursesByStudent: allCoursesByStudent,
      };
    });
    setSelectedStudent(null);
  };
  
  const handleSpecializationUpload = (
    student: Student,
    courses: Partial<Course>[],
    gradeLevel: keyof SpecializationCourses
  ) => {
    setSpecializationCourses(prev => ({
      ...prev,
      [gradeLevel]: courses
    }));
    
    setAcademicData(prevData => {
      if (!prevData) return null;

      const gradeLevelLower = student.gradeLevel?.toLowerCase() || '';
      let numToSelect = 0;

      if (gradeLevelLower.includes('licenciatura')) {
        numToSelect = 15;
      } else if (gradeLevelLower.includes('maestria')) {
        numToSelect = 8;
      } else if (gradeLevelLower.includes('doctorado')) {
        numToSelect = 8;
      }

      if (courses.length > 0 && numToSelect > 0) {
        const shuffled = [...courses].sort(() => 0.5 - Math.random());
        const selectedSpecCourses = shuffled.slice(0, numToSelect).map((course, index) => ({
          ...course,
          id: `spec-${gradeLevel}-${index}-${Date.now()}`,
          grade: '',
          term: '',
          studentId: student.studentId
        }));
        
        const newCoursesByStudent = JSON.parse(JSON.stringify(prevData.coursesByStudent));
        const existingCourses = newCoursesByStudent[student.studentId] || [];
        const nonSpecCourses = existingCourses.filter(c => !c.id.startsWith('spec-'));
        newCoursesByStudent[student.studentId] = [...nonSpecCourses, ...selectedSpecCourses as Course[]];

        return {
          ...prevData,
          coursesByStudent: newCoursesByStudent,
        };
      }
      
      return prevData;
    });
  };

  const handleReset = () => {
    setAcademicData(null);
    setSelectedStudent(null);
    setLogoUrl(DEFAULT_LOGO_URL);
    setCounselorSignature(null);
    setSecretarySignature(null);
    setCoordinatorSignature(null);
    setSpecializationCourses({ licenciatura: [], maestria: [], doctorado: [] });
  };

  const handleDeleteBatch = (batchId: string) => {
    setAcademicData(prevData => {
      if (!prevData) return null;

      const remainingStudents = prevData.students.filter(s => s.batchId !== batchId);
      
      if (remainingStudents.length === 0) {
        return null;
      }

      const remainingCoursesByStudent: Record<string, Course[]> = {};
      remainingStudents.forEach(student => {
        if (prevData.coursesByStudent[student.studentId]) {
          remainingCoursesByStudent[student.studentId] = prevData.coursesByStudent[student.studentId];
        }
      });
      
      return {
        students: remainingStudents,
        coursesByStudent: remainingCoursesByStudent,
      };
    });
  };
  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  }

  // 1. Show file uploader if no data
  if (!academicData) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4 font-body">
        <FileUploader 
          onUpload={handleUpload} 
          onLogoUpload={handleLogoUpload} 
          logoUrl={logoUrl}
          onSignatureUpload={handleSignatureUpload}
          setCounselorSignature={setCounselorSignature}
          setSecretarySignature={setSecretarySignature}
          setCoordinatorSignature={setCoordinatorSignature}
        />
      </div>
    );
  }

  // 2. Show student selector if data is loaded but no student is selected
  if (!selectedStudent) {
    return (
       <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 p-4 font-body">
        <StudentSelector 
          students={academicData.students} 
          onSelectStudent={handleSelectStudent}
          onReset={handleReset}
          logoUrl={logoUrl}
          onDeleteBatch={handleDeleteBatch}
          onSpecializationUpload={handleSpecializationUpload}
        />
       </div>
    );
  }
  
  // 3. Show dashboard for the selected student
  const coursesToDisplay = academicData.coursesByStudent[selectedStudent.studentId] || [];

  return (
    <>
      {editingCourse && (
        <AlertDialog open={!!editingCourse} onOpenChange={(isOpen) => !isOpen && setEditingCourse(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Editar Nombre del Curso</AlertDialogTitle>
              <AlertDialogDescription>
                Estás editando: <span className="font-semibold">{editingCourse.name}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course-name" className="text-right">
                    Nuevo Nombre
                </Label>
                <Input
                    id="course-name"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="col-span-3"
                />
                </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEditingCourse(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdateCourseName}>Guardar Cambios</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="min-h-screen w-full bg-gray-100 font-body">
        <MainDashboard
          student={selectedStudent}
          courses={coursesToDisplay}
          onReset={handleReset}
          onBackToList={handleBackToList}
          logoUrl={logoUrl}
          counselorSignature={counselorSignature}
          secretarySignature={secretarySignature}
          coordinatorSignature={coordinatorSignature}
          onEditCourse={handleStartEditingCourse}
        />
      </div>
    </>
  );
}