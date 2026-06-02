import { useState } from 'react';
import { Room, ROOM_TYPE_LABELS } from '@/types/schedule';
import Icon from '@/components/ui/icon';

interface Props {
  rooms: Room[];
  onUpdate: (rooms: Room[]) => void;
}

const emptyRoom = (): Omit<Room, 'id'> => ({
  number: '',
  type: 'lecture',
  capacity: 30,
  available: true,
});

const TYPE_ICONS: Record<Room['type'], string> = {
  lecture: 'BookOpen',
  lab: 'FlaskConical',
  computer: 'Monitor',
  gym: 'Dumbbell',
};

export default function RoomsPanel({ rooms, onUpdate }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Room, 'id'>>(emptyRoom());
  const [adding, setAdding] = useState(false);

  const startEdit = (r: Room) => {
    setAdding(false);
    setEditing(r.id);
    setForm({ number: r.number, type: r.type, capacity: r.capacity, available: r.available });
  };

  const saveEdit = () => {
    onUpdate(rooms.map(r => r.id === editing ? { ...r, ...form } : r));
    setEditing(null);
  };

  const saveNew = () => {
    onUpdate([...rooms, { id: 'r' + Date.now(), ...form }]);
    setAdding(false);
    setForm(emptyRoom());
  };

  const remove = (id: string) => onUpdate(rooms.filter(r => r.id !== id));

  const toggleAvail = (id: string) => {
    onUpdate(rooms.map(r => r.id === id ? { ...r, available: !r.available } : r));
  };

  const availCount = rooms.filter(r => r.available).length;

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-foreground">Аудитории</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            <span className="text-success font-medium">{availCount}</span> доступно · <span className="text-destructive font-medium">{rooms.length - availCount}</span> недоступно
          </p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); setForm(emptyRoom()); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90 transition-opacity"
        >
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      {adding && (
        <div className="mb-4 p-4 border border-primary/30 rounded-lg bg-primary/5 animate-slide-up">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Новая аудитория</p>
          <RoomForm form={form} setForm={setForm} />
          <div className="flex gap-2 mt-3">
            <button onClick={saveNew} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90">Сохранить</button>
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded hover:bg-muted">Отмена</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {rooms.map(r => (
          <div key={r.id} className={`border rounded-lg overflow-hidden bg-card transition-colors ${!r.available ? 'opacity-60 border-dashed' : 'border-border'}`}>
            {editing === r.id ? (
              <div className="p-4">
                <RoomForm form={form} setForm={setForm} />
                <div className="flex gap-2 mt-3">
                  <button onClick={saveEdit} className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded hover:opacity-90">Сохранить</button>
                  <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded hover:bg-muted">Отмена</button>
                </div>
              </div>
            ) : (
              <div className="p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded flex items-center justify-center flex-shrink-0 ${r.available ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Icon name={TYPE_ICONS[r.type]} fallback="Door" size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium font-mono-data text-foreground">№ {r.number}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{ROOM_TYPE_LABELS[r.type]}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <Icon name="Users" size={10} className="inline mr-1" />
                    {r.capacity} мест
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAvail(r.id)}
                    className={`px-2 py-0.5 text-xs rounded border transition-colors ${r.available ? 'border-success/40 bg-success-bg text-success' : 'border-destructive/30 bg-destructive/5 text-destructive'}`}
                  >
                    {r.available ? 'Доступна' : 'Закрыта'}
                  </button>
                  <button onClick={() => startEdit(r)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <Icon name="Pencil" size={13} />
                  </button>
                  <button onClick={() => remove(r.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomForm({ form, setForm }: { form: Omit<Room, 'id'>; setForm: React.Dispatch<React.SetStateAction<Omit<Room, 'id'>>> }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Номер / название</label>
        <input
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary"
          value={form.number}
          onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
          placeholder="101"
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Вместимость</label>
        <input
          type="number"
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary"
          value={form.capacity}
          onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))}
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Тип</label>
        <select
          className="w-full px-2.5 py-1.5 text-sm border border-border rounded bg-background focus:outline-none focus:border-primary"
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value as Room['type'] }))}
        >
          {(Object.keys(ROOM_TYPE_LABELS) as Room['type'][]).map(t => (
            <option key={t} value={t}>{ROOM_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.available}
            onChange={e => setForm(f => ({ ...f, available: e.target.checked }))}
            className="w-3.5 h-3.5 accent-primary"
          />
          <span className="text-sm text-foreground">Доступна</span>
        </label>
      </div>
    </div>
  );
}