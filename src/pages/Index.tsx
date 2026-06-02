import { useState, useMemo } from 'react';
import { Teacher, Room, Group, LessonSlot } from '@/types/schedule';
import { subjects as initSubjects, teachers as initTeachers, rooms as initRooms, groups as initGroups, lessonSlots as initSlots } from '@/data/mockData';
import { detectConflicts } from '@/utils/conflicts';
import TeachersPanel from '@/components/TeachersPanel';
import RoomsPanel from '@/components/RoomsPanel';
import GroupsPanel from '@/components/GroupsPanel';
import ScheduleGrid from '@/components/ScheduleGrid';
import Icon from '@/components/ui/icon';

type Tab = 'schedule' | 'teachers' | 'rooms' | 'groups';

const TAB_CONFIG: { id: Tab; label: string; icon: string }[] = [
  { id: 'schedule', label: 'Расписание', icon: 'CalendarDays' },
  { id: 'teachers', label: 'Преподаватели', icon: 'GraduationCap' },
  { id: 'rooms', label: 'Аудитории', icon: 'DoorOpen' },
  { id: 'groups', label: 'Группы', icon: 'Users' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule');
  const [subjects] = useState(initSubjects);
  const [teachers, setTeachers] = useState<Teacher[]>(initTeachers);
  const [rooms, setRooms] = useState<Room[]>(initRooms);
  const [groups, setGroups] = useState<Group[]>(initGroups);
  const [slots, setSlots] = useState<LessonSlot[]>(initSlots);

  const conflicts = useMemo(() => detectConflicts(slots), [slots]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Icon name="CalendarDays" size={13} className="text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">РасписаниеПро</span>
            <span className="text-xs text-muted-foreground hidden md:block">/ Колледж</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="hidden sm:flex items-center gap-1.5">
              <Icon name="GraduationCap" size={12} />
              {teachers.length} преп.
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Icon name="DoorOpen" size={12} />
              {rooms.filter(r => r.available).length}/{rooms.length} ауд.
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="Users" size={12} />
              {groups.length} групп
            </span>
            {conflicts.length > 0 && (
              <span className="flex items-center gap-1 text-destructive font-medium">
                <Icon name="AlertTriangle" size={12} />
                {conflicts.length} конфл.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border rounded text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
              <Icon name="Download" size={12} />
              <span className="hidden sm:block">Экспорт</span>
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
              <Icon name="Wand2" size={12} />
              <span className="hidden sm:block">Автозаполнить</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 flex-1 flex flex-col">
        {/* Tabs */}
        <nav className="flex gap-0 border-b border-border pt-1">
          {TAB_CONFIG.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
              {tab.id === 'schedule' && conflicts.length > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-destructive text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                  {conflicts.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 py-6">
          {activeTab === 'schedule' && (
            <ScheduleGrid
              slots={slots}
              teachers={teachers}
              rooms={rooms}
              groups={groups}
              subjects={subjects}
              conflicts={conflicts}
              onUpdate={setSlots}
            />
          )}
          {activeTab === 'teachers' && (
            <TeachersPanel
              teachers={teachers}
              subjects={subjects}
              onUpdate={setTeachers}
            />
          )}
          {activeTab === 'rooms' && (
            <RoomsPanel
              rooms={rooms}
              onUpdate={setRooms}
            />
          )}
          {activeTab === 'groups' && (
            <GroupsPanel
              groups={groups}
              slots={slots}
              subjects={subjects}
              teachers={teachers}
              onUpdate={setGroups}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>РасписаниеПро · {new Date().getFullYear()}</span>
          <span className="font-mono-data">{slots.length} занятий · {conflicts.length} конфликтов</span>
        </div>
      </footer>
    </div>
  );
}
