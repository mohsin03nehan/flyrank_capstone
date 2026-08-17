import React, { useState } from "react";

interface DisclosureProps {
  buttonLabel: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function Disclosure({
  buttonLabel,
  children,
  defaultExpanded = false,
}: DisclosureProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [panelId] = useState<string>(() => `disclosure-panel-${Math.random().toString(36).slice(2, 9)}`);

  return (
    <div>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((previous) => !previous)}
      >
        {buttonLabel}
      </button>

      <div id={panelId} hidden={!isExpanded}>
        {children}
      </div>
    </div>
  );
}
