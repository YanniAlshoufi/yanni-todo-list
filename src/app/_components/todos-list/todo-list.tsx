"use client";

import { ActiveTodosSection } from "./active-todos-section";
import { DoneTodosSection } from "./done-todos-section";

export function TodoList() {
  return (
    <div className="w-full space-y-6">
      {/* Active Todos Section */}
      <ActiveTodosSection />

      {/* Done Todos Section */}
      <DoneTodosSection />
    </div>
  );
}
