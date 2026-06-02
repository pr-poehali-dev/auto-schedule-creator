import { useState } from 'react';
import { Teacher, Subject } from '@/types/schedule';
import Icon from '@/components/ui/icon';

interface Props {
  teachers: Teacher[];
  subjects: Subject[];
  onUpdate: (teachers: Teacher[]) => void;
}

const emptyTeacher = (): Omit<Teacher, 'id'> => ({
  name: '',
  shortName: '',
  subjects: [],
  maxHoursPerWeek: 18,
  currentHours: 0,
});

export default function TeachersPanel({ teachers, subjects, onUpdate }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Teacher, 'id'>>(emptyTeacher());
  const [adding, setAdding] = useState(false);

  const startEdit = (t: Teacher) => {
    setAdding(false);
    setEditing(t.id);
    setForm({ name: t.name, shortName: t.shortName, subjects: t.subjects, maxHoursPerWeek: t.maxHoursPerWeek, currentHours: t.currentHours });
  };

  const saveEdit = () => {
    onUpdate(teachers.map(t => t.id === editing ? { ...t, ...form } : t));
    setEditing(null);
  };

  const saveNew = () => {
    const id = 't' + Date.now();
    onUpdate([...teachers, { id, ...form }]);
    setAdding(false);
    setForm(emptyTeacher());
  };

  const remove = (id: string) => {
    onUpdate(teachers.filter(t => t.id !== id));
  };

  const toggleSubject = (sid: string) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(sid) ? f.subjects.filter(s => s !== sid) : [...f.subjects, sid],
    }));
  };

  const loadPercent = (t: Teacher) => Math.round((t.currentHours / t.maxHoursPerWeek) * 100);

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-foreground">Преподаватели</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{teachers.length} преподавателей в реестре</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); setForm(emptyTeacher()); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90 transition-opacity"
        >
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      {adding && (
        <div className="mb-4 p-4 border border-primary/30 rounded-lg bg-primary/5 animate-slide-up">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Новый преподаватель</p>
          <FormFields form={form} setForm={setForm} subjects={subjects} toggleSubject={toggleSubject} />
          <div className="flex gap-2 mt-3">
            <button onClick={saveNew} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90 transition-opacity">Сохранить</button>
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded hover:bg-muted transition-colors">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {teachers.map(t => (
          <div key={t.id} className="border border-border rounded-lg overflow-hidden bg-card">
            {editing === t.id ? (
              <div className="p-4">
                <FormFields form={form} setForm={setForm} subjects={subjects} toggleSubject={toggleSubject} />
                <div className="flex gap-2 mt-3">
                  <button onClick={saveEdit} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90 transition-opacity">Сохранить</button>
                  <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded hover:bg-muted transition-colors">Отмена</button>
                </div>
              </div>
            ) : (
              <div className="p-3 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary">{t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.subjects.map(sid => subjects.find(s => s.id === sid)?.shortName).filter(Boolean).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${loadPercent(t) >= 100 ? 'bg-destructive' : loadPercent(t) >= 80 ? 'bg-conflict' : 'bg-success'}`}
                          style={{ width: `${Math.min(loadPercent(t), 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-mono-data font-medium ${loadPercent(t) >= 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {t.currentHours}/{t.maxHoursPerWeek}ч
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(t)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Icon name="Pencil" size={13} />
                    </button>
                    <button onClick={() => remove(t.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Icon name="Trash2" size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormFields({ form, setForm, subjects, toggleSubject }: {
  form: Omit<Teacher, 'id'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Teacher, 'id'>>>;
  subjects: Subject[];
  toggleSubject: (sid: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className="block text-xs text-muted-foreground mb-1">ФИО</label>
        <input
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary transition-colors"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value, shortName: e.target.value.split(' ').map((w, i) => i === 0 ? w : w[0] + '.').join(' ') }))}
          placeholder="Иванова Мария Петровна"
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Макс. часов/нед.</label>
        <input
          type="number"
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary transition-colors"
          value={form.maxHoursPerWeek}
          onChange={e => setForm(f => ({ ...f, maxHoursPerWeek: Number(e.target.value) }))}
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Текущих часов</label>
        <input
          type="number"
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary transition-colors"
          value={form.currentHours}
          onChange={e => setForm(f => ({ ...f, currentHours: Number(e.target.value) }))}
        />
      </div>
      <div className="col-span-2">
        <label className="block text-xs text-muted-foreground mb-1.5">Предметы</label>
        <div className="flex flex-wrap gap-1.5">
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => toggleSubject(s.id)}
              className={`px-2 py-0.5 text-xs rounded border transition-colors ${form.subjects.includes(s.id) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
            >
              {s.shortName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}