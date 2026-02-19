import { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, MapPin, Link as LinkIcon, Loader2, ExternalLink, Calendar, Users, BookOpen, Info } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { teacherScheduleService, type TeacherScheduleCalendarItem } from '../../services/teacherSchedule.service';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'theory' | 'practical' | 'exam' | 'meeting';
  courseId: string;
  courseCode: string;
  courseName: string;
  categoryName?: string;
  startDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  meetingLink?: string;
  status: string;
  color: string;
  bgColor: string;
  enrolledStudentsCount: number;
  maxCapacity?: number;
}

// Helper function to format date as YYYY-MM-DD in local timezone
const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getEventTypeLabel = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'theory': return 'Theory Class';
    case 'practical': return 'Practical Session';
    case 'exam': return 'Exam';
    default: return 'General';
  }
};

function CalendarCell({ events, onEventClick }: { date: Date; events: ScheduleEvent[]; onEventClick: (event: ScheduleEvent) => void }) {
  return (
    <div className="min-h-[120px] p-2 bg-white hover:bg-blue-50/30 transition-colors">
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <motion.div
            key={event.id}
            className={`${event.bgColor} ${event.color} rounded px-2 py-1 text-xs cursor-pointer hover:shadow-md transition-all border-l-2 border-current`}
            whileHover={{ scale: 1.02 }}
            onClick={() => onEventClick(event)}
          >
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{event.title}</span>
            </div>
          </motion.div>
        ))}
        {events.length > 3 && (
          <div className="text-xs text-gray-500 px-2">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}

// Week View Cell Component
function WeekCell({ events, onEventClick }: { date: Date; events: ScheduleEvent[]; onEventClick: (event: ScheduleEvent) => void }) {
  return (
    <div className="min-h-[400px] p-2 border-r border-gray-200 last:border-r-0 bg-white hover:bg-blue-50/30 transition-colors">
      <div className="space-y-2">
        {events.map((event) => (
          <motion.div
            key={event.id}
            className={`${event.bgColor} ${event.color} rounded-lg p-3 cursor-pointer hover:shadow-md transition-all border-l-4 border-current`}
            whileHover={{ scale: 1.02 }}
            onClick={() => onEventClick(event)}
          >
            <div className="font-medium text-sm truncate">{event.title}</div>
            <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
              <Clock className="w-3 h-3" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
              <span className="truncate">{event.courseCode}</span>
              <span className="flex items-center gap-0.5">
                <Users className="w-3 h-3" />
                {event.enrolledStudentsCount}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Day View Cell Component
function DayCell({ events, onEventClick }: { date: Date; events: ScheduleEvent[]; onEventClick: (event: ScheduleEvent) => void }) {
  return (
    <div className="min-h-[500px] p-4 bg-white">
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No classes scheduled for this day</p>
          </div>
        ) : (
          events.map((event) => (
            <motion.div
              key={event.id}
              className={`${event.bgColor} ${event.color} rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all border-l-4 border-current`}
              whileHover={{ scale: 1.01 }}
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{event.title}</div>
                  <div className="text-sm mt-1 opacity-90">{event.courseName}</div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.enrolledStudentsCount}
                        {event.maxCapacity && ` / ${event.maxCapacity}`}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={`${event.bgColor} ${event.color} border-0`}>
                  {event.courseCode}
                </Badge>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// List View Row Component
function ListRow({ date, events, onEventClick }: { date: Date; events: ScheduleEvent[]; onEventClick: (event: ScheduleEvent) => void }) {
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-AU', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="flex">
        {/* Date Column */}
        <div className={`w-32 p-4 flex-shrink-0 ${isToday(date) ? 'bg-blue-50' : 'bg-gray-50'}`}>
          <div className={`font-semibold ${isToday(date) ? 'text-blue-600' : 'text-gray-700'}`}>
            {formatDate(date)}
          </div>
          {isToday(date) && (
            <Badge className="mt-1 bg-blue-600 text-white text-xs">Today</Badge>
          )}
        </div>
        
        {/* Events Column */}
        <div className="flex-1 p-4 space-y-2">
          {events.length === 0 ? (
            <div className="text-gray-400 text-sm py-2">No classes</div>
          ) : (
            events.map((event) => (
              <motion.div
                key={event.id}
                className={`${event.bgColor} ${event.color} rounded-lg p-3 cursor-pointer hover:shadow-md transition-all border-l-4 border-current flex items-center gap-4`}
                whileHover={{ scale: 1.01 }}
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-center gap-2 w-24 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{event.startTime}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm opacity-75">{event.courseCode} - {event.courseName}</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{event.enrolledStudentsCount}{event.maxCapacity && `/${event.maxCapacity}`}</span>
                </div>
                <Badge className={`${event.bgColor} ${event.color} border border-current/20`}>
                  {getEventTypeLabel(event.type)}
                </Badge>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function TeacherSchedule() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventDetailDialog, setShowEventDetailDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const weekDaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch schedules when component mounts or date changes
  useEffect(() => {
    if (user?.userId) {
      fetchSchedules();
    }
  }, [user?.userId, currentDate]);

  const fetchSchedules = async () => {
    if (!user?.userId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Get the first and last day of the current month view (including overflow days)
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      const lastDay = new Date(year, month + 1, 0);
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      
      const response = await teacherScheduleService.getTeacherScheduleForCalendar(
        user.userId,
        formatDateToLocalString(startDate),
        formatDateToLocalString(endDate)
      );
      
      if (response.success && response.data) {
        const mappedEvents: ScheduleEvent[] = response.data.map((item: TeacherScheduleCalendarItem) => ({
          id: item.scheduleId,
          title: item.eventTitle,
          type: item.eventType.toLowerCase() as 'theory' | 'practical' | 'exam' | 'meeting',
          courseId: item.courseId,
          courseCode: item.courseCode,
          courseName: item.courseName,
          categoryName: item.categoryName,
          startDate: new Date(item.scheduledDate),
          startTime: item.startTime || '09:00',
          endTime: item.endTime || '17:00',
          location: item.location || 'TBD',
          meetingLink: item.meetingLink,
          status: item.status,
          color: item.color || 'text-gray-700',
          bgColor: item.bgColor || 'bg-gray-200',
          enrolledStudentsCount: item.enrolledStudentsCount,
          maxCapacity: item.maxCapacity
        }));
        setEvents(mappedEvents);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load your schedule. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const day = startDate.getDay();
    startDate.setDate(startDate.getDate() - day);

    const days = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  // Get week days for current week
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const days = [];
    const current = new Date(startOfWeek);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  // Get days for list view (current month)
  const getListDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const current = new Date(firstDay);
    while (current <= lastDay) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const monthDays = getMonthDays();
  const weekDaysArray = getWeekDays();
  const listDays = getListDays();

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month' || view === 'list') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month' || view === 'list') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setShowEventDetailDialog(true);
  };

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-AU', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getViewTitle = () => {
    if (view === 'month' || view === 'list') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === 'week') {
      const weekStart = weekDaysArray[0];
      const weekEnd = weekDaysArray[6];
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      } else {
        return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      }
    } else if (view === 'day') {
      return formatDateForDisplay(currentDate);
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Teaching Schedule
        </h1>
        <p className="text-gray-600">View your assigned classes and exams</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <span className="font-semibold">Schedule Information:</span> This calendar shows all classes and exams assigned to you. Click on any event to view details including enrolled students count and meeting links for online sessions.
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {/* Calendar Controls */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={goToToday}
                variant="outline"
                className="border-2 hover:border-blue-600 hover:text-blue-600"
              >
                today
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  onClick={goToPrevious}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={goToNext}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              <div className="text-2xl font-semibold">
                {getViewTitle()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {(['month', 'week', 'day', 'list'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      view === v
                        ? 'bg-white text-gray-900 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Types Legend */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-sm font-medium text-gray-600">Event Types:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded border-l-2 border-blue-700" />
              <span className="text-sm">Theory Class</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-200 rounded border-l-2 border-purple-700" />
              <span className="text-sm">Practical Session</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded border-l-2 border-green-700" />
              <span className="text-sm">Exam</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded border-l-2 border-gray-700" />
              <span className="text-sm">General</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Month View */}
      {view === 'month' && (
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading your schedule...</span>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* Month Header */}
                {weekDays.map((day) => (
                  <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}

                {/* Month Days */}
                {monthDays.map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const inCurrentMonth = isCurrentMonth(date);
                  const today = isToday(date);

                  return (
                    <div
                      key={index}
                      className={`${!inCurrentMonth ? 'opacity-40' : ''}`}
                    >
                      <div className="bg-white p-2">
                        <div
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full mb-2 ${
                            today
                              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold'
                              : 'text-gray-700'
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      </div>
                      <CalendarCell
                        date={date}
                        events={dayEvents}
                        onEventClick={handleEventClick}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Week View */}
      {view === 'week' && (
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading your schedule...</span>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Week Header */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                  {weekDaysArray.map((date, index) => {
                    const today = isToday(date);
                    return (
                      <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
                        <div className="text-sm font-medium text-gray-500">{weekDays[index]}</div>
                        <div className={`mt-1 text-2xl font-semibold ${
                          today 
                            ? 'w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center' 
                            : 'text-gray-700'
                        }`}>
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Week Days Events */}
                <div className="grid grid-cols-7">
                  {weekDaysArray.map((date, index) => {
                    const dayEvents = getEventsForDate(date);
                    return (
                      <WeekCell
                        key={index}
                        date={date}
                        events={dayEvents}
                        onEventClick={handleEventClick}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Day View */}
      {view === 'day' && (
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading your schedule...</span>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Day Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">{weekDaysFull[currentDate.getDay()]}</div>
                    <div className={`mt-1 text-4xl font-bold ${
                      isToday(currentDate) 
                        ? 'w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center' 
                        : 'text-gray-700'
                    }`}>
                      {currentDate.getDate()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                  </div>
                </div>

                {/* Day Events */}
                <DayCell
                  date={currentDate}
                  events={getEventsForDate(currentDate)}
                  onEventClick={handleEventClick}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {view === 'list' && (
        <Card className="border-0 shadow-xl">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading your schedule...</span>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* List Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 flex">
                  <div className="w-32 font-medium text-gray-600">Date</div>
                  <div className="flex-1 font-medium text-gray-600">Classes</div>
                </div>

                {/* List Days */}
                <div className="max-h-[600px] overflow-y-auto">
                  {listDays.map((date, index) => {
                    const dayEvents = getEventsForDate(date);
                    // Only show days that have events or are today or in the future
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const showDay = dayEvents.length > 0 || date >= today;
                    
                    if (!showDay) return null;
                    
                    return (
                      <ListRow
                        key={index}
                        date={date}
                        events={dayEvents}
                        onEventClick={handleEventClick}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Detail Dialog */}
      <Dialog open={showEventDetailDialog} onOpenChange={(open) => {
        setShowEventDetailDialog(open);
        if (!open) setSelectedEvent(null);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent && (
                <div className={`w-3 h-3 rounded-full ${selectedEvent.bgColor.replace('bg-', 'bg-').replace('200', '500')}`} />
              )}
              Class Details
            </DialogTitle>
            <DialogDescription>
              View details of your scheduled class
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              {/* Event Type Badge */}
              <div className="flex items-center gap-2">
                <Badge className={`${selectedEvent.bgColor} ${selectedEvent.color} border-0`}>
                  {getEventTypeLabel(selectedEvent.type)}
                </Badge>
                <Badge variant="outline" className={
                  selectedEvent.status === 'Scheduled' ? 'text-blue-600 border-blue-200' :
                  selectedEvent.status === 'Completed' ? 'text-green-600 border-green-200' :
                  'text-gray-600 border-gray-200'
                }>
                  {selectedEvent.status}
                </Badge>
              </div>

              {/* Event Title */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
              </div>

              {/* Course Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Course:</span>
                  <span className="font-medium">{selectedEvent.courseCode}</span>
                </div>
                <div className="text-gray-700">{selectedEvent.courseName}</div>
                {selectedEvent.categoryName && (
                  <div className="text-sm text-gray-500">Category: {selectedEvent.categoryName}</div>
                )}
              </div>

              {/* Enrollment Info */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Enrolled Students</div>
                    <div className="font-medium text-gray-900">
                      {selectedEvent.enrolledStudentsCount}
                      {selectedEvent.maxCapacity && (
                        <span className="text-gray-500"> / {selectedEvent.maxCapacity} (max capacity)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium">{formatDateForDisplay(selectedEvent.startDate)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {selectedEvent.location}
                </div>
              </div>

              {/* Meeting Link (if online) */}
              {selectedEvent.meetingLink && (
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Meeting Link</div>
                  <a 
                    href={selectedEvent.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="truncate">{selectedEvent.meetingLink}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEventDetailDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
