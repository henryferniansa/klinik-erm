import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Action {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
}

interface Props {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: Action[];
}

export default function PageHeader({
  title,
  subtitle,
  backTo,
  actions,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
          >
            <ArrowLeft size={15} />
          </button>
        )}
        <div>
          <h1 className="text-base font-semibold" style={{ color: "#1A1A2E" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-opacity hover:opacity-90 ${
                action.variant === "secondary"
                  ? "border border-gray-200 text-gray-600 bg-white"
                  : "text-white"
              }`}
              style={
                action.variant !== "secondary"
                  ? { backgroundColor: "#6B2D4E" }
                  : {}
              }
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
