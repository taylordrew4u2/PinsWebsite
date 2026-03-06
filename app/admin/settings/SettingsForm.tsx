"use client";

import { useActionState, useState } from "react";
import { saveSettings, SaveSettingsState } from "./actions";
import type { SiteSettings } from "@/db/types";

type Settings = SiteSettings;

const initialState: SaveSettingsState = { ok: false };

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  targetBlank?: boolean;
}

export default function SettingsForm({ settings }: { settings: Settings | null }) {
  const [state, formAction, pending] = useActionState(saveSettings, initialState);
  const [navItems, setNavItems] = useState<NavItem[]>(
    (settings?.navItems as NavItem[]) ?? []
  );

  function addNavItem() {
    setNavItems([...navItems, { label: "", href: "" }]);
  }

  function removeNavItem(i: number) {
    setNavItems(navItems.filter((_, idx) => idx !== i));
  }

  function updateNavItem(i: number, field: keyof NavItem, value: string | boolean) {
    const updated = [...navItems];
    updated[i] = { ...updated[i], [field]: value };
    setNavItems(updated);
  }

  const socialLinks = settings?.socialLinks as { instagram?: string } | null;

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="navItemsJson" value={JSON.stringify(navItems)} />

      {state.ok && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded px-4 py-3 text-sm">
          ✓ Settings saved successfully.
        </div>
      )}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          Error: {state.error}
        </div>
      )}

      {/* SEO Defaults */}
      <Section title="SEO Defaults">
        <Field label="Site Name" name="siteName" defaultValue={settings?.siteName ?? ""} />
        <Field label="Default Meta Description" name="defaultMetaDescription" defaultValue={settings?.defaultMetaDescription ?? ""} />
        <Field label="Default OG Image URL" name="defaultOgImageUrl" defaultValue={settings?.defaultOgImageUrl ?? ""} />
      </Section>

      {/* Links */}
      <Section title="Links">
        <Field label="Primary Ticket Link (Partiful)" name="primaryTicketLink" defaultValue={settings?.primaryTicketLink ?? ""} />
        <Field label="Fundraising Link (GoFundMe)" name="fundraisingLink" defaultValue={settings?.fundraisingLink ?? ""} />
        <Field label="Instagram URL" name="instagramUrl" defaultValue={socialLinks?.instagram ?? ""} />
      </Section>

      {/* Content */}
      <Section title="Home Page Content">
        <TextareaField label="Home Body Markdown" name="homeBodyMarkdown" defaultValue={settings?.homeBodyMarkdown ?? ""} rows={8} />
      </Section>

      {/* About Canonical */}
      <Section title="About Page">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About Canonical Path</label>
          <select
            name="aboutCanonicalPath"
            defaultValue={settings?.aboutCanonicalPath ?? ""}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">— none —</option>
            <option value="/pages/about-us">/pages/about-us</option>
            <option value="/blogs/news/about-us-pins-needles-comedy">/blogs/news/about-us-pins-needles-comedy</option>
          </select>
        </div>
      </Section>

      {/* Inject HTML */}
      <Section title="Custom HTML Injection">
        <TextareaField label="&lt;head&gt; Inject HTML" name="headInjectHtml" defaultValue={settings?.headInjectHtml ?? ""} rows={4} />
        <TextareaField label="Body End Inject HTML" name="bodyEndInjectHtml" defaultValue={settings?.bodyEndInjectHtml ?? ""} rows={4} />
      </Section>

      {/* Nav Items */}
      <Section title="Navigation Items">
        <div className="space-y-3">
          {navItems.map((item, i) => (
            <div key={i} className="flex gap-2 items-center flex-wrap">
              <input
                type="text"
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateNavItem(i, "label", e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
              />
              <input
                type="text"
                placeholder="Href"
                value={item.href}
                onChange={(e) => updateNavItem(i, "href", e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-48"
              />
              <label className="flex items-center gap-1 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={!!item.external}
                  onChange={(e) => updateNavItem(i, "external", e.target.checked)}
                />
                External
              </label>
              <label className="flex items-center gap-1 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={!!item.targetBlank}
                  onChange={(e) => updateNavItem(i, "targetBlank", e.target.checked)}
                />
                _blank
              </label>
              <button
                type="button"
                onClick={() => removeNavItem(i)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addNavItem}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            + Add Nav Item
          </button>
        </div>
      </Section>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {pending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border border-gray-200 rounded-lg p-5">
      <legend className="px-2 text-sm font-semibold text-gray-700">{title}</legend>
      <div className="space-y-4 mt-2">{children}</div>
    </fieldset>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700 mb-1"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
  );
}
