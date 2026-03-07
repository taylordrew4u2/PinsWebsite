"use client";

import { useEffect, useMemo, useState } from "react";

type Section = {
  href: string;
  label: string;
  description: string;
};

type Props = {
  sections: Section[];
};

const STORAGE_KEY = "admin-dashboard-section-state-v1";

type StoredState = {
  completedByHref: Record<string, boolean>;
  expandedByHref: Record<string, boolean>;
  notesByHref: Record<string, string>;
};

const defaultState: StoredState = {
  completedByHref: {},
  expandedByHref: {},
  notesByHref: {},
};

export default function AdminSectionsChecklist({ sections }: Props) {
  const [state, setState] = useState<StoredState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredState;
      setState({
        completedByHref: parsed.completedByHref ?? {},
        expandedByHref: parsed.expandedByHref ?? {},
        notesByHref: parsed.notesByHref ?? {},
      });
    } catch {
      setState(defaultState);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, isHydrated]);

  const completedCount = useMemo(
    () => sections.filter((s) => state.completedByHref[s.href]).length,
    [sections, state.completedByHref],
  );

  function toggleExpanded(href: string) {
    setState((prev) => ({
      ...prev,
      expandedByHref: {
        ...prev.expandedByHref,
        [href]: !prev.expandedByHref[href],
      },
    }));
  }

  function toggleCompleted(href: string) {
    setState((prev) => ({
      ...prev,
      completedByHref: {
        ...prev.completedByHref,
        [href]: !prev.completedByHref[href],
      },
    }));
  }

  function updateNotes(href: string, notes: string) {
    setState((prev) => ({
      ...prev,
      notesByHref: {
        ...prev.notesByHref,
        [href]: notes,
      },
    }));
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Admin Sections</h2>
        <p className="text-sm text-gray-600">
          {completedCount}/{sections.length} complete
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = !!state.expandedByHref[section.href];
          const isCompleted = !!state.completedByHref[section.href];
          const notes = state.notesByHref[section.href] ?? "";
          const panelId = `section-panel-${section.href.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

          return (
            <div
              key={section.href}
              className={`rounded-lg border bg-white transition ${
                isCompleted ? "border-green-300 bg-green-50/40" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleExpanded(section.href)}
                  className="flex-1 text-left"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`font-semibold ${
                        isCompleted ? "text-green-800 line-through" : "text-gray-900"
                      }`}
                    >
                      {section.label}
                    </span>
                    <span className="text-xs text-gray-500">{isExpanded ? "Collapse" : "Expand"}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompleted(section.href)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                    isCompleted
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-pressed={isCompleted}
                >
                  {isCompleted ? "Completed" : "Mark complete"}
                </button>
              </div>

              {isExpanded && (
                <div
                  id={panelId}
                  className="border-t border-gray-100 px-4 py-3 text-sm text-gray-700"
                >
                  <p className="mb-3">{section.description}</p>
                  <label htmlFor={`notes-${panelId}`} className="mb-1 block text-xs font-semibold text-gray-600">
                    Details / Notes (editable on this page)
                  </label>
                  <textarea
                    id={`notes-${panelId}`}
                    value={notes}
                    onChange={(e) => updateNotes(section.href, e.target.value)}
                    rows={4}
                    placeholder="Add your info here..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
