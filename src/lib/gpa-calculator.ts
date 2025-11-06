import type { Course } from './academic-data';

const gradePoints: { [key: string]: number } = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
};

export function calculateGPA(courses: Course[]): { gpa: number; totalCredits: number } {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    if (gradePoints.hasOwnProperty(course.grade) && course.credits > 0) {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    }
  });

  if (totalCredits === 0) {
    return { gpa: 0, totalCredits: 0 };
  }

  const gpa = totalPoints / totalCredits;
  return { gpa, totalCredits };
}
