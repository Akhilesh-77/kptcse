
import { Faculty, Notice, Resource, Milestone } from './types';

export const FACULTIES: Faculty[] = [
  {
    id: 'hod-1',
    name: 'Prof. Parashuram D Talwar',
    role: 'Head of Department',
    category: 'HOD',
    image: 'https://ik.imagekit.io/akhileshu/parashuram%20talawar%20sir.png',
    description: 'Provides academic guidance and leadership to both students and faculty.',
    interests: ['Java', 'Python']
  },
  {
    id: 'perm-1',
    name: 'Leelavathi R',
    role: 'Permanent Lecturer',
    category: 'PERMANENT',
    description: 'Teaches and mentors students in fundamental computer science subjects.',
    interests: ['Full Stack Development']
  },
  {
    id: 'perm-2',
    name: 'Mr. Satish',
    role: 'Permanent Lecturer',
    category: 'PERMANENT',
    description: 'Actively participates in academic and student development activities.',
    interests: ['Cyber Security']
  },
  {
    id: 'guest-1',
    name: 'Mrs. Akshitha',
    role: 'Guest Lecturer',
    category: 'GUEST',
    subjects: ['Software Engineering', 'DBMS']
  },
  {
    id: 'guest-2',
    name: 'Mrs. Likhitha',
    role: 'Guest Lecturer',
    category: 'GUEST',
    subjects: ['IT Skills', 'Computer Hardware Management System']
  },
  {
    id: 'guest-3',
    name: 'Mrs. Sheetal J Shet',
    role: 'Guest Lecturer',
    category: 'GUEST',
    subjects: ['Computer Networking']
  },
  {
    id: 'guest-4',
    name: 'Mrs. Akshatha D',
    role: 'Guest Lecturer',
    category: 'GUEST',
    subjects: ['FOC — Fundamentals of Computer']
  }
];

export const NOTICES: Notice[] = [
  { id: 'n1', title: 'Internal Assessment - 1', date: '2024-05-15', description: 'IA-1 for all 2nd and 4th semester students starts next week.', important: true },
  { id: 'n2', title: 'Campus Placement Drive', date: '2024-05-20', description: 'A tech company is visiting for recruitment of final year students.', important: true },
  { id: 'n3', title: 'Holiday Notice', date: '2024-06-01', description: 'College remains closed for local festival.', important: false }
];

export const RESOURCES: Resource[] = [
  { id: 'r1', title: 'C-20 Syllabus - Computer Science', type: 'PDF', url: '#' },
  { id: 'r2', title: 'Data Structures Lab Manual', type: 'PDF', url: '#' },
  { id: 'r3', title: 'Python Programming Guide', type: 'PDF', url: '#' }
];

export const MILESTONES: Milestone[] = [
  { year: '1985', event: 'Computer Science Department Established at KPT.' },
  { year: '2000', event: 'Upgraded with high-speed internet and modern labs.' },
  { year: '2015', event: 'Introduced industry-aligned C-15 curriculum.' },
  { year: '2021', event: 'Adopted C-20 curriculum focusing on project-based learning.' }
];
