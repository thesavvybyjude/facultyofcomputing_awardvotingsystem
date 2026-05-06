"use client";

import { useRouter } from "next/navigation";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export function ScreenHeader({ title, subtitle, showBack = true }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <div className="sh">
      {showBack && (
        <button onClick={() => router.back()} className="sh-back" aria-label="Go back">
          <i className="ti ti-arrow-left" />
        </button>
      )}
      <div>
        <div className="sh-title">{title}</div>
        {subtitle && <div className="sh-sub">{subtitle}</div>}
      </div>
    </div>
  );
}
