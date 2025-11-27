import React from "react";
import useCurrencies from "@/hooks/useCurrencies";

/**
 * CurrencySelect - a small wrapper to render a select for currencies
 * Props:
 * - name: form field name (default 'preferredCurrency')
 * - label: optional label to show (string)
 * - placeholder: optional placeholder option
 * - value/onChange: optional controlled props
 */
export const CurrencySelect = ({
  label,
  placeholder = "Select Currency",
  value,
  onChange,
  ...props
}) => {
  const { data: currenciesResponse, isLoading, isError } = useCurrencies();
  const list = Array.isArray(currenciesResponse?.data)
    ? currenciesResponse.data
    : [];

  // If the caller provides value/onChange we render a controlled select otherwise rely on register
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
        value={isControlled ? value : undefined}
        onChange={isControlled ? onChange : undefined}
        disabled={isLoading}
        className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
        {...props}
      >
        <option value="">
          {isLoading ? "Loading currencies..." : placeholder}
        </option>
        {list.map((c) => (
          <option key={c._id ?? c.currency_id} value={c.currency_id ?? c._id}>
            {c.icon ? `${c.icon} - ${c.name}` : c.name}
          </option>
        ))}
      </select>
      {isError && (
        <p className="text-xs text-red-600 mt-1">Failed to load currencies</p>
      )}
    </div>
  );
};

export default CurrencySelect;
