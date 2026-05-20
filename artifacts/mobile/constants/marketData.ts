export type CommodityPrice = {
  id: string;
  name: string;
  unit: string;
  price: number;
  change: number;
  icon: string;
};

export const commodities: CommodityPrice[] = [
  { id: "1", name: "Maize", unit: "per 100kg", price: 42000, change: 2.3, icon: "leaf" },
  { id: "2", name: "Soybean", unit: "per 100kg", price: 98000, change: -1.1, icon: "seed" },
  { id: "3", name: "Cassava", unit: "per tonne", price: 85000, change: 0.8, icon: "nutrition" },
  { id: "4", name: "Broiler", unit: "per bird", price: 4800, change: 5.2, icon: "egg" },
  { id: "5", name: "Tomato", unit: "per basket", price: 25000, change: -3.4, icon: "leaf" },
  { id: "6", name: "Rice (local)", unit: "per 50kg", price: 38000, change: 1.7, icon: "grain" },
];

export const featuredCommodities = commodities.slice(0, 4);
