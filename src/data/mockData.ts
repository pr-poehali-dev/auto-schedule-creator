import { Teacher, Room, Group, Subject, LessonSlot } from '@/types/schedule';

export const subjects: Subject[] = [
  { id: 's1', name: 'Математика', shortName: 'Мат' },
  { id: 's2', name: 'Информатика', shortName: 'Инф' },
  { id: 's3', name: 'Физика', shortName: 'Физ' },
  { id: 's4', name: 'Русский язык', shortName: 'Рус' },
  { id: 's5', name: 'История', shortName: 'Ист' },
  { id: 's6', name: 'Химия', shortName: 'Хим' },
  { id: 's7', name: 'Экономика', shortName: 'Эко' },
  { id: 's8', name: 'Физкультура', shortName: 'ФК' },
];

export const teachers: Teacher[] = [
  { id: 't1', name: 'Иванова Мария Петровна', shortName: 'Иванова М.П.', subjects: ['s1', 's3'], maxHoursPerWeek: 20, currentHours: 14 },
  { id: 't2', name: 'Петров Алексей Сергеевич', shortName: 'Петров А.С.', subjects: ['s2'], maxHoursPerWeek: 18, currentHours: 12 },
  { id: 't3', name: 'Сидорова Елена Николаевна', shortName: 'Сидорова Е.Н.', subjects: ['s4', 's5'], maxHoursPerWeek: 22, currentHours: 18 },
  { id: 't4', name: 'Козлов Дмитрий Андреевич', shortName: 'Козлов Д.А.', subjects: ['s6', 's7'], maxHoursPerWeek: 20, currentHours: 20 },
  { id: 't5', name: 'Новикова Анна Владимировна', shortName: 'Новикова А.В.', subjects: ['s8'], maxHoursPerWeek: 24, currentHours: 16 },
  { id: 't6', name: 'Морозов Сергей Иванович', shortName: 'Морозов С.И.', subjects: ['s3', 's1'], maxHoursPerWeek: 18, currentHours: 10 },
];

export const rooms: Room[] = [
  { id: 'r1', number: '101', type: 'lecture', capacity: 40, available: true },
  { id: 'r2', number: '102', type: 'lecture', capacity: 35, available: true },
  { id: 'r3', number: '201', type: 'computer', capacity: 25, available: true },
  { id: 'r4', number: '202', type: 'lab', capacity: 20, available: false },
  { id: 'r5', number: '203', type: 'lab', capacity: 20, available: true },
  { id: 'r6', number: 'СЗ', type: 'gym', capacity: 60, available: true },
  { id: 'r7', number: '301', type: 'lecture', capacity: 45, available: true },
  { id: 'r8', number: '302', type: 'computer', capacity: 20, available: true },
];

export const groups: Group[] = [
  { id: 'g1', name: 'ИТ-11', specialty: 'Информационные технологии', year: 1, studentCount: 28 },
  { id: 'g2', name: 'ИТ-21', specialty: 'Информационные технологии', year: 2, studentCount: 25 },
  { id: 'g3', name: 'ЭК-11', specialty: 'Экономика и бухучет', year: 1, studentCount: 30 },
  { id: 'g4', name: 'ЭК-21', specialty: 'Экономика и бухучет', year: 2, studentCount: 27 },
  { id: 'g5', name: 'МН-11', specialty: 'Менеджмент', year: 1, studentCount: 24 },
];

export const lessonSlots: LessonSlot[] = [
  { id: 'ls1', dayIndex: 0, slotIndex: 0, subjectId: 's1', teacherId: 't1', roomId: 'r1', groupId: 'g1' },
  { id: 'ls2', dayIndex: 0, slotIndex: 0, subjectId: 's4', teacherId: 't3', roomId: 'r2', groupId: 'g3' },
  { id: 'ls3', dayIndex: 0, slotIndex: 1, subjectId: 's2', teacherId: 't2', roomId: 'r3', groupId: 'g1' },
  { id: 'ls4', dayIndex: 0, slotIndex: 1, subjectId: 's7', teacherId: 't4', roomId: 'r1', groupId: 'g3' },
  { id: 'ls5', dayIndex: 0, slotIndex: 2, subjectId: 's1', teacherId: 't1', roomId: 'r2', groupId: 'g2' },
  { id: 'ls6', dayIndex: 0, slotIndex: 2, subjectId: 's2', teacherId: 't2', roomId: 'r3', groupId: 'g4' },
  { id: 'ls7', dayIndex: 1, slotIndex: 0, subjectId: 's3', teacherId: 't1', roomId: 'r2', groupId: 'g2' },
  { id: 'ls8', dayIndex: 1, slotIndex: 0, subjectId: 's3', teacherId: 't1', roomId: 'r1', groupId: 'g5' }, // КОНФЛИКТ преподавателя
  { id: 'ls9', dayIndex: 1, slotIndex: 1, subjectId: 's8', teacherId: 't5', roomId: 'r6', groupId: 'g1' },
  { id: 'ls10', dayIndex: 1, slotIndex: 1, subjectId: 's6', teacherId: 't4', roomId: 'r5', groupId: 'g2' },
  { id: 'ls11', dayIndex: 1, slotIndex: 2, subjectId: 's5', teacherId: 't3', roomId: 'r1', groupId: 'g3' },
  { id: 'ls12', dayIndex: 1, slotIndex: 2, subjectId: 's7', teacherId: 't4', roomId: 'r1', groupId: 'g4' }, // КОНФЛИКТ аудитории
  { id: 'ls13', dayIndex: 2, slotIndex: 0, subjectId: 's2', teacherId: 't2', roomId: 'r8', groupId: 'g2' },
  { id: 'ls14', dayIndex: 2, slotIndex: 1, subjectId: 's4', teacherId: 't3', roomId: 'r2', groupId: 'g5' },
  { id: 'ls15', dayIndex: 2, slotIndex: 2, subjectId: 's1', teacherId: 't6', roomId: 'r7', groupId: 'g3' },
  { id: 'ls16', dayIndex: 3, slotIndex: 0, subjectId: 's6', teacherId: 't4', roomId: 'r5', groupId: 'g1' },
  { id: 'ls17', dayIndex: 3, slotIndex: 1, subjectId: 's8', teacherId: 't5', roomId: 'r6', groupId: 'g3' },
  { id: 'ls18', dayIndex: 3, slotIndex: 2, subjectId: 's3', teacherId: 't6', roomId: 'r1', groupId: 'g4' },
  { id: 'ls19', dayIndex: 4, slotIndex: 0, subjectId: 's7', teacherId: 't4', roomId: 'r2', groupId: 'g5' },
  { id: 'ls20', dayIndex: 4, slotIndex: 1, subjectId: 's1', teacherId: 't1', roomId: 'r7', groupId: 'g5' },
];
