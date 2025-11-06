import type { Student, Course } from "@/lib/academic-data";

type InfoCardsProps = {
  student: Student;
  courses: Course[];
  calculatedAverage: number;
};

const InfoItem = ({ label, value }: { label: string; value: string | number | undefined }) => {
    if (!value || value === 'N/A') return null;
    return (
        <div className="flex border-b">
            <p className="w-32 flex-shrink-0 bg-gray-100 p-1 font-semibold text-gray-700 text-sm border-r">{label}</p>
            <p className="p-1 font-medium text-sm text-gray-900">{value}</p>
        </div>
    );
};

const CreditItem = ({ label, value }: { label: string, value: string | number | undefined }) => (
    <div className="flex justify-between items-center text-sm border-b last:border-b-0">
      <span className="p-1">{label}</span>
      <span className="font-mono font-semibold bg-gray-200 px-2 py-0.5">{value}</span>
    </div>
);


export function InfoCards({ student, courses, calculatedAverage }: InfoCardsProps) {
  
  const getTotalCredits = () => {
    const gradeLevelLower = student.gradeLevel.toLowerCase();
    if (gradeLevelLower.includes('licenciatura')) return 285;
    if (gradeLevelLower.includes('maestria')) return 135;
    if (gradeLevelLower.includes('doctorado')) return 123;
    return 0;
  };
  const totalCredits = getTotalCredits();

  const getHorasLectivas = () => {
    const gradeLevelLower = student.gradeLevel.toLowerCase();
    if (gradeLevelLower.includes('licenciatura')) return '2850 horas';
    if (gradeLevelLower.includes('maestria')) return '1350 horas';
    if (gradeLevelLower.includes('doctorado')) return '1230 horas';
    return 'N/A';
  };

  return (
    <div className="grid grid-cols-12 border-y-2 border-gray-300">
      
      {/* Student & Credits Info */}
      <div className="col-span-4 border-r-2 border-gray-300">
        <div className="bg-white">
            <CreditItem label="Créditos transferidos previamente" value={student.transferCredits} />
            <CreditItem label="Créditos por experiancia laboral" value={student.workExperienceCredits} />
            <CreditItem label="Créditos obtenidos por merito de estudio" value={student.meritCredits} />
            <CreditItem label="Créditos por tesis de graduación" value={student.thesisCredits} />
             <div className="flex justify-between items-center text-sm font-bold border-t-2 mt-1">
                <span className="p-1">Total de créditos</span>
                <span className="bg-gray-800 text-white text-base px-3 py-1">{totalCredits}</span>
            </div>
            {student.careerName && student.careerName !== 'N/A' && (
              <div className="border-t-2 mt-1 p-1">
                  <p className="text-xs text-gray-500">Carrera</p>
                  <p className="font-semibold text-sm">{student.careerName}</p>
              </div>
            )}
             <div className="p-1">
                <p className="text-xs text-gray-500">Horas lectivas</p>
                <p className="font-semibold text-sm">{getHorasLectivas()}</p>
            </div>
        </div>
      </div>
      
      <div className="col-span-8">
          <div className="grid grid-cols-2">
            <InfoItem label="Facultad" value={student.school} />
            <InfoItem label="País" value={student.country} />
            <InfoItem label="Nombre" value={student.firstName} />
            <InfoItem label="Ciudad" value={student.city} />
            <InfoItem label="Apellido" value={student.lastName} />
            <InfoItem label="ID de estudiante" value={student.studentId} />
            <InfoItem label="Dirección" value={student.address} />
            <InfoItem label="Fecha de Nac." value={student.birthDate} />
          </div>
          <div className="grid grid-cols-4 bg-gray-800 text-white text-center font-semibold">
              <div className="p-1">
                <p className="text-xs">Grado</p>
                <p className="text-lg">{student.gradeLevel}</p>
              </div>
              <div className="p-1 border-x-2 border-gray-500">
                <p className="text-xs">Afectación</p>
                <p className="text-lg">{student.affectation}</p>
              </div>
              <div className="p-1 border-r-2 border-gray-500">
                <p className="text-xs">Fecha de cierre</p>
                <p className="text-lg">{student.curriculumCloseDate}</p>
              </div>
              <div className="p-1">
                <p className="text-xs">Promedio</p>
                <p className="text-lg">{calculatedAverage}</p>
              </div>
           </div>
      </div>

    </div>
  );
}
