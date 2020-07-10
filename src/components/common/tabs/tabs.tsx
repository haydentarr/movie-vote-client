import React, {
  useMemo,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";

interface ITabsContext {
  activeTab: string;
  setActiveTab: (label: string) => void;
}

export interface IPanelProps {
  /**
   * Unique identifier for this tab.
   */
  label: string;
}

export interface ITabProps {
  /**
   * Unique label of Tab to show when clicked.
   */
  label: string;
}

const TabsContext = createContext<ITabsContext | undefined>(undefined);

/**
 * This component maintains internal state and provides those
 * pieces of state & functions to its children.
 *
 * Note that this component itself does not directly update state.
 */
const Tabs: React.FC = props => {
  const [activeTab, setActiveTab] = useState(`fight`);

  /**
   * Memoize the context to prevent unecessary renders.
   */
  const memoizedContextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
    }),
    [activeTab, setActiveTab],
  );

  useEffect(() => {}, [activeTab, setActiveTab]);

  return (
    <TabsContext.Provider value={memoizedContextValue}>
      {props.children}
    </TabsContext.Provider>
  );
};

/**
 * This component allows changing of the active Tab.
 */
const Tab: React.FC<ITabProps> = props => {
  const { setActiveTab } = useTabs();
  return (
    <div className="tab">
      <button onClick={() => setActiveTab(props.label)}>
        {props.children}
      </button>
    </div>
  );
};

/**
 * Individual panel component.
 */
const Panel: React.FC<IPanelProps> = props => {
  const { activeTab } = useTabs();
  return activeTab === props.label ? <div>{props.children}</div> : null;
};

/**
 * This Context hook allows our child components to easily reach
 * into the Tabs context and get the pieces it needs.
 *
 * Bonus: it even makes sure the component is used within a
 * Tabs component!
 */
const useTabs = (): ITabsContext => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("This component must be used within a <Tabs> component.");
  }
  return context;
};

export { Tabs, Tab, Panel };
