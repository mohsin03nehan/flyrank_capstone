import React, { useEffect, useRef, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveId?: string;
}

// Tabs component following WAI-ARIA Authoring Practices for Tabs
const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveId }) => {
  const firstId = tabs[0]?.id ?? '';
  const getInitialActive = (): string => {
    if (defaultActiveId && tabs.some((t) => t.id === defaultActiveId)) return defaultActiveId;
    return firstId;
  };

  const [activeId, setActiveId] = useState<string>(getInitialActive);

  // refs to all tab buttons for focus management
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // Ensure activeId stays valid if tabs change
  useEffect(() => {
    if (!tabs.some((t) => t.id === activeId)) {
      setActiveId(firstId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  const focusTabByIndex = (index: number): void => {
    const btn = tabsRef.current[index];
    btn?.focus();
  };

  // Roving tabindex + automatic activation keyboard handling
  // Explanation: Using the roving tabindex pattern, only the currently "active" tab
  // has tabIndex=0 and is in the natural tab order; all other tabs have tabIndex=-1.
  // Arrow/Home/End keys move focus to another tab by focusing its button element and
  // updating the activeId so that the newly focused tab becomes the single focusable
  // element (the roving tabindex target) and its panel is shown. This prevents the
  // Tab key from moving between tabs and instead moves focus out of the tablist.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const key = event.key;
    const count = tabs.length;
    let newIndex = index;

    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        newIndex = (index + 1) % count;
        setActiveId(tabs[newIndex].id);
        focusTabByIndex(newIndex);
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        newIndex = (index - 1 + count) % count;
        setActiveId(tabs[newIndex].id);
        focusTabByIndex(newIndex);
        break;
      }
      case 'Home': {
        event.preventDefault();
        newIndex = 0;
        setActiveId(tabs[0].id);
        focusTabByIndex(0);
        break;
      }
      case 'End': {
        event.preventDefault();
        newIndex = count - 1;
        setActiveId(tabs[newIndex].id);
        focusTabByIndex(newIndex);
        break;
      }
      case 'Enter':
      case ' ': {
        // With automatic activation, Enter/Space should still ensure activation
        event.preventDefault();
        setActiveId(tabs[index].id);
        break;
      }
      default:
        break;
    }
  };

  const handleClick = (id: string, index: number): void => {
    setActiveId(id);
    // focus clicked tab so roving tabindex stays consistent
    focusTabByIndex(index);
  };

  return (
    <div>
      <div role="tablist" aria-label="Tabs">
        {tabs.map((tab, idx) => {
          const isSelected = tab.id === activeId;
          const panelId = `${tab.id}-panel`;
          return (
            <button
              key={tab.id}
              id={tab.id}
              ref={(el) => {
                tabsRef.current[idx] = el;
              }}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleClick(tab.id, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => {
        const isSelected = tab.id === activeId;
        const panelId = `${tab.id}-panel`;
        return (
          <div
            key={panelId}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tab.id}
            hidden={!isSelected}
          >
            {isSelected ? tab.content : null}
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
