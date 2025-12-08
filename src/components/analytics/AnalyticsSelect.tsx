import { Datepicker, Select } from "flowbite-react";
import { useState } from "react";
import { Mode, Period } from "../../models/analytic";



interface AnalyticsSelectProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  month?: number;
  year?: number;
  onMonthChange?: (month: number) => void;
  onYearChange?: (year: number) => void;
  onRangeChange?: (range: { startDate: Date; endDate: Date }) => void;
}

export const AnalyticsSelect = ({
  period,
  onPeriodChange,
  mode,
  onModeChange,
  month,
  year,
  onMonthChange,
  onYearChange,
  onRangeChange,
}: AnalyticsSelectProps) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleRangeChange = (type: "start" | "end", value: string) => {
    if (type === "start") setStartDate(value);
    if (type === "end") setEndDate(value);

    if (type === "end" && startDate && value) {
      onRangeChange?.({
        startDate: new Date(startDate),
        endDate: new Date(value),
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2 items-center ">
      {/* Selector de modo */}
      <Select
        value={mode}
        onChange={(e) => onModeChange(e.target.value as Mode)}
        className="sm:w-full lg:w-sm"
      >
        <option value="period">Por período</option>
        <option value="monthly">Por meses</option>
        <option value="yearly">Por años</option>
        <option value="range">Por rango de fechas</option>
      </Select>

      {/* Modo período */}
      {mode === "period" && (
        <Select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as Period)}
          className="sm:w-full lg:w-sm"
        >
          <option value="day">Ventas del día</option>
          <option value="week">Ventas de la semana</option>
          <option value="month">Ventas del mes</option>
          <option value="year">Ventas del año</option>
        </Select>
      )}

      {/* Modo mensual */}
      {mode === "monthly" && (
        <div className="flex gap-2 w-full">
          <Select
            value={month ?? new Date().getMonth()}
            onChange={(e) => onMonthChange?.(parseInt(e.target.value))}
            className="sm:w-full lg:w-full"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </Select>

          <Select
            value={year ?? new Date().getFullYear()}
            onChange={(e) => onYearChange?.(parseInt(e.target.value))}
            className="sm:w-full lg:w-xs"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Modo anual */}
      {mode === "yearly" && (
        <Select
          value={year ?? new Date().getFullYear()}
          onChange={(e) => onYearChange?.(parseInt(e.target.value))}
          className="sm:w-full lg:w-46"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      )}

      {/* Modo rango */}
      {mode === "range" && (
        <div className="flex gap-2 w-full">
          <div className="w-full">
            <Datepicker
              inline={false}
              language="es-ES"
              placeholder="Desde"
              value={startDate ? new Date(startDate) : undefined}
              onChange={(date: Date | null) => {
                if (date) handleRangeChange("start", date.toISOString());
              }}
              labelTodayButton="Hoy"
              labelClearButton="Limpiar"
            />
          </div>

          <div className="w-full">
            <Datepicker
              inline={false}
              language="es-ES"
              placeholder="Hasta"
              value={endDate ? new Date(endDate) : undefined}
              onChange={(date: Date | null) => {
                if (date) handleRangeChange("end", date.toISOString());
              }}
              labelTodayButton="Hoy"
              labelClearButton="Limpiar"
            />
          </div>
        </div>
      )}
    </div>
  );
};
