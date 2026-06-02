export type Subject = {
  id: string;
  name: string;
  shortName: string;
};

export type Teacher = {
  id: string;
  name: string;
  shortName: string;
  subjects: string[];
  maxHoursPerWeek: number;
  currentHours: number;
};

export type Room = {
  id: string;
  number: string;
  type: 'lecture' | 'lab' | 'computer' | 'gym';
  capacity: number;
  available: boolean;
};

export type Group = {
  id: string;
  name: string;
  specialty: string;
  year: number;
  studentCount: number;
};

export type LessonSlot = {
  id: string;
  dayIndex: number;
  slotIndex: number;
  subjectId: string;
  teacherId: string;
  roomId: string;
  groupId: string;
};

export type Conflict = {
  type: 'teacher' | 'room' | 'group';
  slotIds: string[];
  description: string;
};

export const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
export const TIME_SLOTS = [
  '08:00–09:35',
  '09:45–11:20',
  '11:30–13:05',
  '13:35–15:10',
  '15:20–16:55',
  '17:05–18:40',
];

export const ROOM_TYPE_LABELS: Record<Room['type'], string> = {
  lecture: 'Лекционная',
  lab: 'Лаборатория',
  computer: 'Компьютерный',
  gym: 'Спортивный зал',
};
