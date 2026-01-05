export interface StudentData {
  fullName: string;
  course: string;
  admissionDate: string; // MM/YYYY
  validityDate: string; // MM/YYYY
  fatherName: string;
  motherName: string;
  cpf: string;
  rg: string;
  birthDate: string;
  birthPlace: string;
  photoUrl: string | null;
  matricula: string;
}

export const INITIAL_DATA: StudentData = {
  fullName: '',
  course: '',
  admissionDate: '',
  validityDate: '',
  fatherName: '',
  motherName: '',
  cpf: '',
  rg: '',
  birthDate: '',
  birthPlace: '',
  photoUrl: null,
  matricula: '61090716703', // Default or random
};