import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type EnterpriseType = "poultry" | "crop" | "livestock";

export type WorksheetEntry = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "revenue" | "expense";
};

export type Enterprise = {
  id: string;
  name: string;
  type: EnterpriseType;
  createdAt: string;
  numberOfUnits: number;
  farmSize?: number;
  entries: WorksheetEntry[];
};

type EnterpriseContextType = {
  enterprises: Enterprise[];
  addEnterprise: (e: Omit<Enterprise, "id" | "createdAt" | "entries">) => Promise<Enterprise>;
  addEntry: (enterpriseId: string, entry: Omit<WorksheetEntry, "id">) => Promise<void>;
  deleteEntry: (enterpriseId: string, entryId: string) => Promise<void>;
  deleteEnterprise: (id: string) => Promise<void>;
};

const EnterpriseContext = createContext<EnterpriseContextType | null>(null);
const STORAGE_KEY = "@greenedin_enterprises";

export function EnterpriseProvider({ children }: { children: React.ReactNode }) {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setEnterprises(JSON.parse(data));
    });
  }, []);

  const persist = useCallback(async (list: Enterprise[]) => {
    setEnterprises(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addEnterprise = useCallback(
    async (data: Omit<Enterprise, "id" | "createdAt" | "entries">) => {
      const newEnterprise: Enterprise = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        entries: [],
      };
      await persist([...enterprises, newEnterprise]);
      return newEnterprise;
    },
    [enterprises, persist]
  );

  const addEntry = useCallback(
    async (enterpriseId: string, entry: Omit<WorksheetEntry, "id">) => {
      const newEntry: WorksheetEntry = {
        ...entry,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      };
      const updated = enterprises.map((e) =>
        e.id === enterpriseId ? { ...e, entries: [...e.entries, newEntry] } : e
      );
      await persist(updated);
    },
    [enterprises, persist]
  );

  const deleteEntry = useCallback(
    async (enterpriseId: string, entryId: string) => {
      const updated = enterprises.map((e) =>
        e.id === enterpriseId
          ? { ...e, entries: e.entries.filter((en) => en.id !== entryId) }
          : e
      );
      await persist(updated);
    },
    [enterprises, persist]
  );

  const deleteEnterprise = useCallback(
    async (id: string) => {
      await persist(enterprises.filter((e) => e.id !== id));
    },
    [enterprises, persist]
  );

  return (
    <EnterpriseContext.Provider
      value={{ enterprises, addEnterprise, addEntry, deleteEntry, deleteEnterprise }}
    >
      {children}
    </EnterpriseContext.Provider>
  );
}

export function useEnterprise() {
  const ctx = useContext(EnterpriseContext);
  if (!ctx) throw new Error("useEnterprise must be used within EnterpriseProvider");
  return ctx;
}
