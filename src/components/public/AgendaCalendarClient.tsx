"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

type AgendaItem = { id: string; date: string; title: string };

export default function AgendaCalendarClient({ agendas }: { agendas: AgendaItem[] }) {
  const [value, setValue] = useState(new Date());

  const agendaDates = agendas.map((a) => new Date(a.date).toDateString());

  const tileContent = ({ date }: { date: Date }) => {
    if (agendaDates.includes(date.toDateString())) {
      return (
        <div className="flex justify-center mt-0.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </div>
      );
    }
    return null;
  };

  const selectedAgendas = agendas.filter(
    (a) => new Date(a.date).toDateString() === value.toDateString()
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <Calendar
          onChange={(v) => setValue(v as Date)}
          value={value}
          locale="id-ID"
          tileContent={tileContent}
          className="border-0 w-full"
        />
      </div>
      {selectedAgendas.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-emerald-800 mb-2">
            Agenda {value.toLocaleDateString("id-ID", { day: "numeric", month: "long" })}:
          </p>
          {selectedAgendas.map((a) => (
            <p key={a.id} className="text-sm text-emerald-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
              {a.title}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
