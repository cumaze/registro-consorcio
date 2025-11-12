

export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
  term: string;
  studentId: string; // Added to link course to student
};

export type Student = {
  batchId: string; // To identify the upload batch
  university: string;
  school: string; // Facultad
  firstName: string; // Nombre
  lastName: string; // Apellido
  address: string;
  country: string;
  city: string;
  studentId: string;
  birthDate: string; // Fecha de Nac.
  assignedTutor: string; // Tutor Asignado
  emphasis: string; // Enfasis
  transferCredits: number;
  workExperienceCredits: number;
  meritCredits: number;
  thesisCredits: number;
  gradeLevel: string; // Grado
  affectation: string; // Afectación
  curriculumCloseDate: string; // Fecha de cierre
  average: number; // Promedio
  spanishGrades: string[]; // New field for Spanish grade system notes
  careerName: string; // Nombre de la Carrera
};

export const studentInfo: Student = {
  batchId: 'initial-load',
  university: 'Northern International University',
  school: 'Ciencias Económicas y Empresariales',
  firstName: 'Blanca Stivalis',
  lastName: 'Alvarado Rincon',
  address: 'Calle 4C No.24-29 Barrio la Alborada',
  country: 'Colombia',
  city: 'Villavicencio - Meta.',
  studentId: 'BALVARADO1162COL',
  birthDate: '5 de Mayo 1981',
  assignedTutor: 'Irma Yolanda Florian',
  emphasis: 'Enfasis',
  transferCredits: 0,
  workExperienceCredits: 0,
  meritCredits: 115,
  thesisCredits: 8,
  gradeLevel: 'Doctorado',
  affectation: 'Ciencias Administrativas',
  curriculumCloseDate: '25 de enero 2025',
  average: 89,
  spanishGrades: [],
  careerName: 'Doctorado en Ciencias Administrativas',
};


// The course list is empty as requested, to be filled later.
export const academicRecords: Course[] = [];

// Cursos de Inducción - Común para todos
export const inductionCourses: Partial<Course>[] = [
    { name: "Formación virtual", credits: 5.4 },
    { name: "Epistemología del conocimiento científico", credits: 5.4 },
    { name: "Técnicas de enseñanza y aprendizaje", credits: 5.4 },
    { name: "Metodologías de la investigación científica", credits: 5.4 },
    { name: "Entorno económico, social y ambiental en el ámbito mundial y nacional", credits: 5.4 },
];

// --- Cursos de Maestría ---
export const maestriaCursosBasicos: Partial<Course>[] = [
    { name: "Teorías Administrativas y desarrollo organizacional", credits: 5.4 },
    { name: "Metodología de la investigación", credits: 5.4 },
    { name: "Análisis del entorno económico", credits: 5.4 },
    { name: "Marco legal y derecho corporativo", credits: 5.4 },
    { name: "Desarrollo de competencias directivas y liderazgo", credits: 5.4 },
    { name: "Contabilidad general y financiera", credits: 5.4 },
    { name: "Definición del proyecto de investigación", credits: 5.4 },
];

export const professionalCourses: Partial<Course>[] = [
  { name: "Entorno Tecnológico y Sistemas de Información", credits: 5.4 },
  { name: "Gestión de Proyectos Y plan de negocios", credits: 5.4 },
  { name: "Ética Empresarial y Responsabilidad Social Corporación", credits: 5.4 },
  { name: "Marketing y Gestión comercial", credits: 5.4 },
  { name: "Planeación financiera y Control de Presupuesto", credits: 5.4 },
  { name: "Gestión de Capital Humano", credits: 5.4 },
  { name: "Decisiones de Inversión y Financiamiento", credits: 5.4 },
  { name: "Dirección y gobierno de la empresa familiar", credits: 5.4 },
  { name: "Estrategias Fiscales y Financieras", credits: 5.4 },
  { name: "Innovación y Desarrollo de Negocios", credits: 5.4 },
  { name: "Derechos de las Obligaciones y Contratos", credits: 5.4 }
];


// --- Cursos de Licenciatura ---
export const licenciaturaCursosBasicos: Partial<Course>[] = [
    { name: "Teoría Económica", credits: 5.7 },
    { name: "Economía Aplicada a los negocios", credits: 5.7 },
    { name: "Bases Jurídicas de la empresa", credits: 5.7 },
    { name: "Fundamentos de la administración", credits: 5.7 },
    { name: "Fundamentos de Contabilidad", credits: 5.7 },
    { name: "Contabilidad Aplicada a los Negocios", credits: 5.7 },
    { name: "Derecho Mercantil", credits: 5.7 },
    { name: "Desarrollo de Habilidades digitales", credits: 5.7 },
    { name: "Estadística Aplicada a los Negocios", credits: 5.7 },
    { name: "Contabilidad de Costos", credits: 5.7 },
    { name: "Ética y Responsabilidad Social Empresarial", credits: 5.7 },
    { name: "Contabilidad Administrativa", credits: 5.7 },
    { name: "Programación y Presupuestos", credits: 5.7 },
    { name: "Derecho Fiscal", credits: 5.7 },
    { name: "Productividad y Calidad total", credits: 5.7 },
    { name: "Estrategias competitivas y Plan de Negocios", credits: 5.7 },
    { name: "Cultura Emprendedora", credits: 5.7 },
    { name: "Formulación y Evaluación de Proyectos I", credits: 5.7 },
    { name: "Formulación y Evaluación de Proyectos II", credits: 5.7 },
    { name: "Inteligencia de los Negocios", credits: 5.7 },
];

export const licenciaturaCursosProfesionales: Partial<Course>[] = [
    { name: "Marketing digital", credits: 5.7 },
    { name: "Publicidad, promoción y manejo de medios", credits: 5.7 },
    { name: "Aspectos legales y etica en la mercadotecnia", credits: 5.7 },
    { name: "Cadena de suministros", credits: 5.7 },
    { name: "Finanzas internacionales", credits: 5.7 },
    { name: "Finanzas corporativas", credits: 5.7 },
    { name: "Administración fiscal financiera", credits: 5.7 },
    { name: "Provisión y capacitación del factor humano", credits: 5.7 },
    { name: "Administración de nóminas", credits: 5.7 },
    { name: "Derecho laboral", credits: 5.7 },
    { name: "Seguridad social", credits: 5.7 },
    { name: "Teoría del comercio internacional", credits: 5.7 },
    { name: "Cotizaciones y contratos internacionales", credits: 5.7 },
    { name: "Legislación aduanera y aranceles", credits: 5.7 },
    { name: "Fuentes e instrumentos de financiamiento a empresas", credits: 5.7 },
    { name: "Competencias gerenciales", credits: 5.7 },
    { name: "Liderazgo y conducción de equipos", credits: 5.7 },
    { name: "Comunicación eficaz", credits: 5.7 },
    { name: "Innovaciones tecnológicas en la administración", credits: 5.7 },
    { name: "Ingeniería financiera y valuación", credits: 5.7 },
    { name: "Creatividad e innovación aplicada", credits: 5.7 },
    { name: "Psicología y conducta del consumidor", credits: 5.7 },
    { name: "Estrategias de negociación y ventas", credits: 5.7 },
];

// --- Cursos de Técnico ---
export const tecnicoCursosProfesionales: Partial<Course>[] = [
    { name: "Marketing digital", credits: 4.33 },
    { name: "Publicidad, promoción y manejo de medios", credits: 4.33 },
    { name: "Liderazgo y conducción de equipos", credits: 4.33 },
    { name: "Comunicación eficaz", credits: 4.33 },
    { name: "Finanzas internacionales y corporativas", credits: 4.33 },
    { name: "Competencias gerenciales", credits: 4.33 },
    { name: "Administración fiscal financiera", credits: 4.33 },
    { name: "Provisión y capacitación del factor humano", credits: 4.33 },
    { name: "Innovaciones tecnológicas en la administración", credits: 4.33 },
    { name: "Derecho laboral", credits: 4.33 },
    { name: "Seguridad social", credits: 4.33 },
    { name: "Teoría del comercio internacional", credits: 4.33 },
    { name: "Ingeniería financiera y valuación", credits: 4.33 },
    { name: "Creatividad e innovación aplicada", credits: 4.33 },
    { name: "Estrategias de negociación y ventas", credits: 4.33 },
];

// --- Cursos de Doctorado ---
export const doctoradoCursosBasicos: Partial<Course>[] = [
    { name: "Ingeniería económica", credits: 5.4 },
    { name: "Métodos y diseño del protocolo de investigación", credits: 5.4 },
    { name: "Instrumento para la toma de decisiones (Contables y Financieras)", credits: 5.4 },
    { name: "Análisis cuantitativos aplicados", credits: 5.4 },
    { name: "Liderazgo y talento empresarial", credits: 5.4 },
    { name: "Proceso del proyecto de investigación", credits: 5.4 },
];

export const doctoradoCursosProfesionales: Partial<Course>[] = [
    { name: "Tópicos de gestión fiscal y financiera", credits: 5.4 },
    { name: "Tópicos sobre la empresa corporativa o familiar", credits: 5.4 },
    { name: "Marketing e inteligencia en los negocios", credits: 5.25 },
    { name: "Gobierno, empresa y corporativismo", credits: 5.25 },
    { name: "Innovación y emprendimiento", credits: 5.25 },
    { name: "Tópicos de humanismo y empresa", credits: 5.25 },
    { name: "Ética y responsabilidad social empresarial", credits: 5.25 },
    { name: "Tópicos sobre el estado del arte y la globalidad", credits: 5.25 },
];

export const usmCourses: Partial<Course>[] = [
  { name: "Teorías Administrativas y Desarrollo Organizacional", credits: 3 },
  { name: "Metodología de la Investigación", credits: 3 },
  { name: "Análisis del Entorno Económico", credits: 3 },
  { name: "Marco Legal y Derecho Corporativo", credits: 3 },
  { name: "Desarrollo de Competencias Directivas y Liderazgo", credits: 3 },
  { name: "Contabilidad General y Financiera", credits: 3 },
  { name: "Definición del Proyecto de Investigación", credits: 3 },
  { name: "Entorno Tecnológico y Sistemas de Información", credits: 3 },
  { name: "Gestión de Proyectos y Plan de Negocios", credits: 3 },
  { name: "Ética Empresarial y Responsabilidad Social Corporativa", credits: 3 },
  { name: "Marketing y Gestión Comercial", credits: 3 },
  { name: "Planeación Financiera y Control de Presupuesto", credits: 3 },
  { name: "Gestión de Capital Humano", credits: 3 },
  { name: "Decisiones de Inversión y Financiamiento", credits: 3 },
  { name: "Dirección y Gobierno de la Empresa Familiar", credits: 3 },
  { name: "Estrategias Fiscales y Financieras", credits: 3 },
  { name: "Innovación y Desarrollo de Negocios", credits: 3 },
  { name: "Derechos de las Obligaciones y Contratos", credits: 3 },
  { name: "Trabajo de Grado I", credits: 3 },
  { name: "Trabajo de Grado II", credits: 3 },
];


export const validateCourse = (course: Course): string[] => {
  const errors: string[] = [];
  if (course.credits <= 0) {
    errors.push('Créditos inválidos: El valor debe ser positivo.');
  }
  if (!course.grade || course.grade.trim() === '') {
    errors.push('Calificación faltante.');
  } else {
    const validGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F', 'P', 'W'];
    if (!validGrades.includes(course.grade) && course.grade !== 'N/A') {
      errors.push(`Calificación inválida: "${course.grade}" no es un valor reconocido.`);
    }
  }
  return errors;
};

// No longer used, but kept for reference
export const specializationCourses: Partial<Course>[] = [];
