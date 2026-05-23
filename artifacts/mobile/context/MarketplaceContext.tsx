import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type MarketProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  imageUri?: string;
  sellerName: string;
  sellerPhone: string;
  createdAt: string;
};

type MarketplaceContextType = {
  products: MarketProduct[];
  addProduct: (p: Omit<MarketProduct, "id" | "createdAt">) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);
const STORAGE_KEY = "@greenedin_marketplace";

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<MarketProduct[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setProducts(JSON.parse(data));
    });
  }, []);

  const persist = useCallback(async (list: MarketProduct[]) => {
    setProducts(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addProduct = useCallback(
    async (data: Omit<MarketProduct, "id" | "createdAt">) => {
      const newProduct: MarketProduct = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
      };
      await persist([newProduct, ...products]);
    },
    [products, persist]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await persist(products.filter((p) => p.id !== id));
    },
    [products, persist]
  );

  return (
    <MarketplaceContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}
