import React from "react";
import useLanguages from "@/hooks/useLanguages";

/**
 * LanguageSelect - a wrapper component to render a select for languages
 * Props:
 * - name: form field name (default 'preferredLanguage')
 * - label: optional label to show (string)
 * - placeholder: optional placeholder option
 * - value/onChange: controlled props
 */
export const LanguageSelect = ({
  name = "preferredLanguage",
  label,
  placeholder = "Select Language",
  value,
  onChange,
}) => {
  const { data: languagesResponse, isLoading, isError } = useLanguages();
  const list = Array.isArray(languagesResponse?.data)
    ? languagesResponse.data
    : [];

  const isControlled =
    typeof value !== "undefined" && typeof onChange === "function";

  return (
    <div>
      {label && (
        <label className="block text-lg font-medium text-[#2E2A40] mb-2">
          {label}
        </label>
      )}
      <select
        name={name}
        value={isControlled ? value : undefined}
        onChange={isControlled ? onChange : undefined}
        disabled={isLoading}
        className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
      >
        <option value="">
          {isLoading ? "Loading languages..." : placeholder}
        </option>
        {list.map((l) => (
          <option key={l._id ?? l.Language_id} value={l.Language_id ?? l._id}>
            {l.Language_name}
          </option>
        ))}
      </select>
      {isError && (
        <p className="text-xs text-red-600 mt-1">Failed to load languages</p>
      )}
    </div>
  );
};

export default LanguageSelect;
