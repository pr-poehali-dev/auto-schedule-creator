import { useState } from 'react';
import { Group, LessonSlot, Subject, Teacher } from '@/types/schedule';
import { DAYS, TIME_SLOTS } from '@/types/schedule';
import Icon from '@/components/ui/icon';

interface Props {
  groups: Group[];
  slots: LessonSlot[];
  subjects: Subject[];
  teachers: Teacher[];
  onUpdate: (groups: Group[]) => void;
}

const emptyGroup = (): Omit<Group, 'id'> => ({
  name: '',
  specialty: '',
  year: 1,
  studentCount: 25,
});

export default function GroupsPanel({ groups, slots, subjects, teachers, onUpdate }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Group, 'id'>>(emptyGroup());
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const startEdit = (g: Group) => {
    setAdding(false);
    setEditing(g.id);
    setExpanded(null);
    setForm({ name: g.name, specialty: g.specialty, year: g.year, studentCount: g.studentCount });
  };

  const saveEdit = () => {
    onUpdate(groups.map(g => g.id === editing ? { ...g, ...form } : g));
    setEditing(null);
  };

  const saveNew = () => {
    onUpdate([...groups, { id: 'g' + Date.now(), ...form }]);
    setAdding(false);
    setForm(emptyGroup());
  };

  const remove = (id: string) => onUpdate(groups.filter(g => g.id !== id));

  const getGroupSlots = (gid: string) => slots.filter(s => s.groupId === gid);

  const getLessonsPerWeek = (gid: string) => getGroupSlots(gid).length;

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-foreground">Учебные группы</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{groups.length} групп в реестре</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); setExpanded(null); setForm(emptyGroup()); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90 transition-opacity"
        >
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      {adding && (
        <div className="mb-4 p-4 border border-primary/30 rounded-lg bg-primary/5 animate-slide-up">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Новая группа</p>
          <GroupForm form={form} setForm={setForm} />
          <div className="flex gap-2 mt-3">
            <button onClick={saveNew} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90">Сохранить</button>
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded hover:bg-muted">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {groups.map(g => (
          <div key={g.id} className="border border-border rounded-lg overflow-hidden bg-card">
            {editing === g.id ? (
              <div className="p-4">
                <GroupForm form={form} setForm={setForm} />
                <div className="flex gap-2 mt-3">
                  <button onClick={saveEdit} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90">Сохранить</button>
                  <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded hover:bg-muted">Отмена</button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium font-mono-data text-primary">{g.name}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{g.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{g.specialty} · {g.year} курс</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Занятий/нед.</p>
                      <p className="text-sm font-medium font-mono-data text-foreground">{getLessonsPerWeek(g.id)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Студентов</p>
                      <p className="text-sm font-medium font-mono-data text-foreground">{g.studentCount}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setExpanded(expanded === g.id ? null : g.id)}
                        className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Icon name={expanded === g.id ? 'ChevronUp' : 'ChevronDown'} size={13} />
                      </button>
                      <button onClick={() => startEdit(g)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Icon name="Pencil" size={13} />
                      </button>
                      <button onClick={() => remove(g.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Icon name="Trash2" size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {expanded === g.id && (
                  <div className="border-t border-border bg-muted/30 p-3 animate-slide-up">
                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Расписание группы</p>
                    <div className="grid grid-cols-6 gap-1">
                      {DAYS.map((day, di) => (
                        <div key={di}>
                          <p className="text-xs text-muted-foreground mb-1 text-center">{day.slice(0, 2)}</p>
                          <div className="space-y-1">
                            {getGroupSlots(g.id).filter(s => s.dayIndex === di).map(s => {
                              const subj = subjects.find(sub => sub.id === s.subjectId);
                              const teacher = teachers.find(t => t.id === s.teacherId);
                              return (
                                <div key={s.id} className="bg-primary/10 rounded p-1 text-center">
                                  <p className="text-xs font-medium text-primary">{subj?.shortName}</p>
                                  <p className="text-[10px] text-muted-foreground">{TIME_SLOTS[s.slotIndex].split('–')[0]}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{teacher?.shortName.split(' ')[0]}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupForm({ form, setForm }: { form: Omit<Group, 'id'>; setForm: React.Dispatch<React.SetStateAction<Omit<Group, 'id'>>> }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Название группы</label>
        <input
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="ИТ-11"
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Курс</label>
        <select
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary"
          value={form.year}
          onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
        >
          {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y} курс</option>)}
        </select>
      </div>
      <div className="col-span-2">
        <label className="block text-xs text-muted-foreground mb-1">Специальность</label>
        <input
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary"
          value={form.specialty}
          onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
          placeholder="Информационные технологии"
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Кол-во студентов</label>
        <input
          type="number"
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary"
          value={form.studentCount}
          onChange={e => setForm(f => ({ ...f, studentCount: Number(e.target.value) }))}
        />
      </div>
    </div>
  );
}
