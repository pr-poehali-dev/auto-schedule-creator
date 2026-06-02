import { LessonSlot, Conflict } from '@/types/schedule';

export function detectConflicts(slots: LessonSlot[]): Conflict[] {
  const conflicts: Conflict[] = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];

      if (a.dayIndex !== b.dayIndex || a.slotIndex !== b.slotIndex) continue;

      if (a.teacherId === b.teacherId) {
        const existing = conflicts.find(
          c => c.type === 'teacher' && c.slotIds.includes(a.id) && c.slotIds.includes(b.id)
        );
        if (!existing) {
          conflicts.push({
            type: 'teacher',
            slotIds: [a.id, b.id],
            description: 'Преподаватель ведёт два занятия одновременно',
          });
        }
      }

      if (a.roomId === b.roomId) {
        const existing = conflicts.find(
          c => c.type === 'room' && c.slotIds.includes(a.id) && c.slotIds.includes(b.id)
        );
        if (!existing) {
          conflicts.push({
            type: 'room',
            slotIds: [a.id, b.id],
            description: 'Аудитория занята двумя группами одновременно',
          });
        }
      }

      if (a.groupId === b.groupId) {
        const existing = conflicts.find(
          c => c.type === 'group' && c.slotIds.includes(a.id) && c.slotIds.includes(b.id)
        );
        if (!existing) {
          conflicts.push({
            type: 'group',
            slotIds: [a.id, b.id],
            description: 'У группы два занятия в одно время',
          });
        }
      }
    }
  }

  return conflicts;
}

export function getConflictSlotIds(conflicts: Conflict[]): Set<string> {
  const ids = new Set<string>();
  conflicts.forEach(c => c.slotIds.forEach(id => ids.add(id)));
  return ids;
}
