"use client";

import { generateFlightLog } from "@/app/lib/flight-log-events";
import { Goal } from "@/app/lib/definitions";

interface FlightLogProps {
  goal: Goal;
}

export default function FlightLog({ goal }: FlightLogProps) {
  const startDate = new Date(goal.start_date);
  const logEntries = generateFlightLog(
    startDate, 
    goal.completions, 
    goal.flight_log_events || {},
    7
  );

  return (
    <div className="w-full generic-bordered-container h-full font-pixelify-sans">
      <h3 className="text-white mb-2">Journal de vol</h3>
      <div className="flex flex-col-reverse gap-2 md:gap-1 overflow-y-auto">
        {logEntries.map((entry, index) => {
          const dateStr = entry.date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit' 
          });
          
          return (
            <div key={index} className="flex flex-col md:flex-row gap-0 md:gap-2 text-xs">
              <div className="flex gap-2">
                <span className={entry.completed ? "text-green-400" : "text-red-400"}>
                  {entry.completed ? ">" : "~"}
                </span>
                <span className="text-white opacity-70">{dateStr}</span>
              </div>
              <span className="text-white flex-1">{entry.event}</span>
            </div>
          );
        })}
        {
          logEntries.length === 0 && (
            <p className="text-white opacity-50 text-xs">
              Aucun journal de vol disponible.
            </p>
          )
        }
      </div>
    </div>
  );
}
