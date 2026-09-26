"use client";

import { useState } from "react";

type BehaviorCategory = "positive" | "redirect" | "incident";

type Student = {
  id: number;
  name: string;
};

type Behavior = {
  name: string;
  category: BehaviorCategory;
};

type BehaviorEvent = {
  id: string;
  studentId: number;
  studentName: string;
  behavior: string;
  category: BehaviorCategory;
  timestamp: Date;
  behaviorCount: number;
};

const students: Student[] = [
  { id: 1, name: "Jordan Lee" },
  { id: 2, name: "Maya Thompson" },
  { id: 3, name: "Chris Rivera" },
  { id: 4, name: "Avery Brooks" },
  { id: 5, name: "Sam Patel" },
  { id: 6, name: "Morgan Davis" },
  { id: 7, name: "Riley Carter" },
  { id: 8, name: "Casey Nguyen" },
];

const behaviors: Behavior[] = [
  { name: "On Task", category: "positive" },
  { name: "Good Question", category: "positive" },
  { name: "Participation", category: "positive" },
  { name: "Helping Others", category: "positive" },
  { name: "Great Effort", category: "positive" },
  { name: "Improvement", category: "positive" },

  { name: "Talking", category: "redirect" },
  { name: "Phone", category: "redirect" },
  { name: "Earbuds", category: "redirect" },
  { name: "Off Task", category: "redirect" },
  { name: "Movement", category: "redirect" },
  { name: "Disruption", category: "redirect" },

  { name: "Refusal", category: "incident" },
  { name: "Profanity", category: "incident" },
  { name: "Disrespect", category: "incident" },
  { name: "Other", category: "incident" },
];

function getRedirectStage(count: number) {
  if (count === 0) return "No reminders yet";
  if (count === 1) return "1st reminder logged";
  if (count === 2) return "2nd reminder logged";
  if (count === 3) return "Final warning reached";

  return "Follow-up needed";
}

export default function Home() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<BehaviorEvent | null>(null);

  function recordBehavior(behavior: Behavior) {
    if (!selectedStudent) return;

    const previousCount = events.filter(
      (event) =>
        event.studentId === selectedStudent.id &&
        event.behavior === behavior.name
    ).length;

    const newCount = previousCount + 1;

    const newEvent: BehaviorEvent = {
      id: `${Date.now()}-${Math.random()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      behavior: behavior.name,
      category: behavior.category,
      timestamp: new Date(),
      behaviorCount: newCount,
    };

    setEvents((currentEvents) => [...currentEvents, newEvent]);
    setLastEvent(newEvent);
    setSelectedStudent(null);
  }

  function undoLastEvent() {
    if (!lastEvent) return;

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== lastEvent.id)
    );

    setLastEvent(null);
  }

  function getStudentCounts(studentId: number) {
    const studentEvents = events.filter(
      (event) => event.studentId === studentId
    );

    return {
      positive: studentEvents.filter(
        (event) => event.category === "positive"
      ).length,

      redirect: studentEvents.filter(
        (event) => event.category === "redirect"
      ).length,

      incident: studentEvents.filter(
        (event) => event.category === "incident"
      ).length,
    };
  }

  const positiveBehaviors = behaviors.filter(
    (behavior) => behavior.category === "positive"
  );

  const redirectBehaviors = behaviors.filter(
    (behavior) => behavior.category === "redirect"
  );

  const incidentBehaviors = behaviors.filter(
    (behavior) => behavior.category === "incident"
  );

  const selectedStudentEvents = selectedStudent
    ? events.filter((event) => event.studentId === selectedStudent.id)
    : [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Classroom Observation Tracker
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Class Companion
              </h1>

              <p className="mt-2 text-slate-600">
                Tap a student, then tap the behavior you want to record.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Current Class
              </p>

              <p className="font-semibold">Sample Class</p>
            </div>
          </div>
        </header>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Students</h2>

            <p className="text-sm text-slate-500">
              {events.length} observation{events.length === 1 ? "" : "s"} today
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {students.map((student) => {
              const counts = getStudentCounts(student.id);

              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => setSelectedStudent(student)}
                  className="min-h-36 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition active:scale-[0.98]"
                >
                  <p className="text-lg font-semibold leading-tight">
                    {student.name}
                  </p>

                  <div className="mt-5 space-y-1 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Positive</span>
                      <span className="font-semibold">{counts.positive}</span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Redirects</span>
                      <span className="font-semibold">{counts.redirect}</span>
                    </div>

                    {counts.incident > 0 && (
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Incidents</span>
                        <span className="font-semibold">{counts.incident}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div>
            <h2 className="font-semibold">Today&apos;s observations</h2>

            <p className="text-sm text-slate-500">
              Temporary for now - refreshing the page will clear these.
            </p>
          </div>

          {events.length === 0 ? (
            <p className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
              Nothing recorded yet. Tap a student to try it.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {[...events].reverse().map((event) => (
                <div
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{event.studentName}</p>

                    <p className="text-sm text-slate-500">
                      {event.behavior} · {event.category}
                      {event.category === "redirect" &&
                        ` · ${getRedirectStage(event.behaviorCount)}`}
                    </p>
                  </div>

                  <p className="text-sm text-slate-500">
                    {event.timestamp.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Record observation for
                </p>

                <h2 className="text-2xl font-bold">
                  {selectedStudent.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="min-h-11 rounded-xl bg-slate-100 px-4 font-medium"
              >
                Cancel
              </button>
            </div>

            <BehaviorSection
              title="Positive"
              description="Something worth recognizing"
              behaviors={positiveBehaviors}
              studentEvents={selectedStudentEvents}
              onSelect={recordBehavior}
            />

            <BehaviorSection
              title="Redirect"
              description="A reminder or correction"
              behaviors={redirectBehaviors}
              studentEvents={selectedStudentEvents}
              onSelect={recordBehavior}
            />

            <BehaviorSection
              title="Incident"
              description="Something significant you want documented"
              behaviors={incidentBehaviors}
              studentEvents={selectedStudentEvents}
              onSelect={recordBehavior}
            />
          </div>
        </div>
      )}

      {lastEvent && (
        <div className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium">
                {lastEvent.behavior} recorded for {lastEvent.studentName}.
              </p>

              <p className="text-sm text-slate-300">
                {lastEvent.category === "redirect"
                  ? getRedirectStage(lastEvent.behaviorCount)
                  : `${lastEvent.behaviorCount} ${
                      lastEvent.behaviorCount === 1
                        ? "observation"
                        : "observations"
                    } today`}
              </p>
            </div>

            <button
              type="button"
              onClick={undoLastEvent}
              className="min-h-11 shrink-0 rounded-xl bg-white px-4 font-semibold text-slate-900"
            >
              Undo
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function BehaviorSection({
  title,
  description,
  behaviors,
  studentEvents,
  onSelect,
}: {
  title: string;
  description: string;
  behaviors: Behavior[];
  studentEvents: BehaviorEvent[];
  onSelect: (behavior: Behavior) => void;
}) {
  return (
    <section className="mb-6 last:mb-0">
      <div className="mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {behaviors.map((behavior) => {
          const count = studentEvents.filter(
            (event) => event.behavior === behavior.name
          ).length;

          return (
            <button
              key={behavior.name}
              type="button"
              onClick={() => onSelect(behavior)}
              className="min-h-20 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold">{behavior.name}</span>

                {count > 0 && (
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-bold">
                    {count}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {behavior.category === "redirect"
                  ? getRedirectStage(count)
                  : count === 0
                    ? "Not logged today"
                    : `${count} ${
                        count === 1 ? "observation" : "observations"
                      } today`}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}