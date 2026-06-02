import { useState } from 'react';
import { LessonSlot, Teacher, Room, Group, Subject, Conflict } from '@/types/schedule';
import { DAYS, TIME_SLOTS } from '@/types/schedule';
import { getConflictSlotIds } from '@/utils/conflicts';
import Icon from '@/components/ui/icon';

interface Props {
  slots: LessonSlot[];
  teachers: Teacher[];
  rooms: Room[];
  groups: Group[];
  subjects: Subject[];
  conflicts: Conflict[];
  onUpdate: (slots: LessonSlot[]) => void;
}

type FilterMode = 'all' | 'group' | 'teacher' | 'room';

export default function ScheduleGrid({ slots, teachers, rooms, groups, subjects, conflicts, onUpdate }: Props) {
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [filterId, setFilterId] = useState<string>('');
  const [editingSlot, setEditingSlot] = useState<LessonSlot | null>(null);
  const [addingAt, setAddingAt] = useState<{ day: number; slot: number } | null>(null);
  const [form, setForm] = useState<Partial<LessonSlot>>({});

  const conflictIds = getConflictSlotIds(conflicts);

  const visibleSlots = slots.filter(s => {
    if (filterMode === 'all' || !filterId) return true;
    if (filterMode === 'group') return s.groupId === filterId;
    if (filterMode === 'teacher') return s.teacherId === filterId;
    if (filterMode === 'room') return s.roomId === filterId;
    return true;
  });

  const getSlotsAt = (day: number, slot: number) =>
    visibleSlots.filter(s => s.dayIndex === day && s.slotIndex === slot);

  const startAdd = (day: number, slot: number) => {
    setAddingAt({ day, slot });
    setEditingSlot(null);
    setForm({ dayIndex: day, slotIndex: slot, subjectId: subjects[0]?.id, teacherId: teachers[0]?.id, roomId: rooms.find(r => r.available)?.id, groupId: groups[0]?.id });
  };

  const saveNew = () => {
    if (!form.subjectId || !form.teacherId || !form.roomId || !form.groupId) return;
    onUpdate([...slots, {
      id: 'ls' + Date.now(),
      dayIndex: addingAt!.day,
      slotIndex: addingAt!.slot,
      subjectId: form.subjectId,
      teacherId: form.teacherId,
      roomId: form.roomId,
      groupId: form.groupId,
    }]);
    setAddingAt(null);
    setForm({});
  };

  const saveEdit = () => {
    if (!editingSlot) return;
    onUpdate(slots.map(s => s.id === editingSlot.id ? { ...s, ...form } : s));
    setEditingSlot(null);
    setForm({});
  };

  const removeSlot = (id: string) => {
    onUpdate(slots.filter(s => s.id !== id));
    if (editingSlot?.id === id) setEditingSlot(null);
  };

  const startEdit = (s: LessonSlot) => {
    setAddingAt(null);
    setEditingSlot(s);
    setForm({ subjectId: s.subjectId, teacherId: s.teacherId, roomId: s.roomId, groupId: s.groupId });
  };

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-medium text-foreground">Расписание</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{slots.length} занятий · {conflicts.length > 0 ? <span className="text-destructive font-medium">{conflicts.length} конфликт{conflicts.length === 1 ? '' : conflicts.length < 5 ? 'а' : 'ов'}</span> : <span className="text-success font-medium">конфликтов нет</span>}</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'group', 'teacher', 'room'] as FilterMode[]).map(m => (
            <button
              key={m}
              onClick={() => { setFilterMode(m); setFilterId(''); }}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${filterMode === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
            >
              {{ all: 'Все', group: 'Группа', teacher: 'Преподаватель', room: 'Аудитория' }[m]}
            </button>
          ))}
          {filterMode !== 'all' && (
            <select
              className="px-2 py-1 text-xs border border-border rounded bg-background focus:outline-none focus:border-primary"
              value={filterId}
              onChange={e => setFilterId(e.target.value)}
            >
              <option value="">— выбрать —</option>
              {filterMode === 'group' && groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              {filterMode === 'teacher' && teachers.map(t => <option key={t.id} value={t.id}>{t.shortName}</option>)}
              {filterMode === 'room' && rooms.map(r => <option key={r.id} value={r.id}>№{r.number}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Conflicts banner */}
      {conflicts.length > 0 && (
        <div className="mb-4 p-3 rounded-lg border border-conflict/30 bg-conflict-bg flex items-start gap-2">
          <Icon name="AlertTriangle" size={15} className="text-conflict mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-conflict">Обнаружены конфликты расписания</p>
            <div className="mt-1 space-y-0.5">
              {conflicts.map((c, i) => (
                <p key={i} className="text-xs text-muted-foreground">
                  <span className="capitalize">{c.type === 'teacher' ? '👤 Преподаватель' : c.type === 'room' ? '🚪 Аудитория' : '👥 Группа'}</span> — {c.description}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit form */}
      {(editingSlot || addingAt) && (
        <div className="mb-4 p-4 border border-primary/30 rounded-lg bg-primary/5 animate-slide-up">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            {editingSlot ? `Редактировать: ${DAYS[editingSlot.dayIndex]}, ${TIME_SLOTS[editingSlot.slotIndex]}` : `Добавить: ${DAYS[addingAt!.day]}, ${TIME_SLOTS[addingAt!.slot]}`}
          </p>
          <SlotForm form={form} setForm={setForm} subjects={subjects} teachers={teachers} rooms={rooms} groups={groups} />
          <div className="flex gap-2 mt-3">
            <button onClick={editingSlot ? saveEdit : saveNew} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90">Сохранить</button>
            <button onClick={() => { setEditingSlot(null); setAddingAt(null); }} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded hover:bg-muted">Отмена</button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Day headers */}
          <div className="grid gap-px mb-px" style={{ gridTemplateColumns: '80px repeat(6, 1fr)' }}>
            <div />
            {DAYS.map((d, i) => (
              <div key={i} className="text-xs font-medium text-center text-muted-foreground py-2 bg-muted/50 rounded">
                {d.slice(0, 2).toUpperCase()}
                <span className="hidden sm:inline">{d.slice(2)}</span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {TIME_SLOTS.map((time, si) => (
            <div key={si} className="grid gap-px mb-px" style={{ gridTemplateColumns: '80px repeat(6, 1fr)' }}>
              {/* Time */}
              <div className="flex flex-col justify-center px-2 py-2">
                <p className="text-[10px] font-medium font-mono-data text-muted-foreground">{time.split('–')[0]}</p>
                <p className="text-[10px] text-muted-foreground/60">–{time.split('–')[1]}</p>
                <p className="text-[9px] text-muted-foreground/40 mt-0.5">{si + 1} пара</p>
              </div>

              {/* Cells */}
              {DAYS.map((_, di) => {
                const cellSlots = getSlotsAt(di, si);
                return (
                  <div
                    key={di}
                    className="min-h-[72px] bg-card border border-border/60 rounded relative group"
                  >
                    <div className="p-1 space-y-1 h-full">
                      {cellSlots.map(s => {
                        const subj = subjects.find(sub => sub.id === s.subjectId);
                        const teacher = teachers.find(t => t.id === s.teacherId);
                        const room = rooms.find(r => r.id === s.roomId);
                        const group = groups.find(g => g.id === s.groupId);
                        const hasConflict = conflictIds.has(s.id);
                        return (
                          <div
                            key={s.id}
                            onClick={() => startEdit(s)}
                            className={`rounded px-1.5 py-1 cursor-pointer transition-colors text-left w-full ${
                              hasConflict
                                ? 'bg-conflict-bg border border-conflict/40 conflict-pulse'
                                : 'bg-primary/8 border border-primary/20 hover:bg-primary/15'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className={`text-[11px] font-medium leading-tight ${hasConflict ? 'text-conflict' : 'text-primary'}`}>
                                {subj?.shortName}
                              </p>
                              <button
                                onClick={e => { e.stopPropagation(); removeSlot(s.id); }}
                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                              >
                                <Icon name="X" size={10} />
                              </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-tight truncate">{teacher?.shortName}</p>
                            <p className="text-[10px] text-muted-foreground/70 leading-tight">
                              {group?.name} · №{room?.number}
                            </p>
                          </div>
                        );
                      })}

                      {/* Add button */}
                      <button
                        onClick={() => startAdd(di, si)}
                        className="w-full h-5 rounded border border-dashed border-border opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity hover:border-primary/40 hover:bg-primary/5"
                      >
                        <Icon name="Plus" size={10} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlotForm({ form, setForm, subjects, teachers, rooms, groups }: {
  form: Partial<LessonSlot>;
  setForm: React.Dispatch<React.SetStateAction<Partial<LessonSlot>>>;
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  groups: Group[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Предмет</label>
        <select className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary" value={form.subjectId || ''} onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Группа</label>
        <select className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary" value={form.groupId || ''} onChange={e => setForm(f => ({ ...f, groupId: e.target.value }))}>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Преподаватель</label>
        <select className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary" value={form.teacherId || ''} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.shortName}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Аудитория</label>
        <select className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary" value={form.roomId || ''} onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))}>
          {rooms.filter(r => r.available).map(r => <option key={r.id} value={r.id}>№{r.number} ({r.capacity} мест)</option>)}
        </select>
      </div>
    </div>
  );
}
