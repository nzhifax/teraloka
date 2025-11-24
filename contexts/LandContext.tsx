import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Land {
  id: string;
  name: string;
  location: string;
  coords?: { latitude: number; longitude: number }[];
  center?: { latitude: number; longitude: number };
  image?: string;
  soilType?: string;
  temperature?: string;
  area?: string;
  price?: number;
  status?: string;
  crop?: string;
  owner?: string;
  isOnline?: boolean;
  fertilizer?: { date: string; type: string; weight: string }[];
  isForSale?: boolean;
  rating?: number;
  type?: string;
}

interface LandContextType {
  lands: Land[];
  setLands: React.Dispatch<React.SetStateAction<Land[]>>;
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export const LandProvider = ({ children }: { children: ReactNode }) => {
  const [lands, setLands] = useState<Land[]>([]);
  return (
    <LandContext.Provider value={{ lands, setLands }}>
      {children}
    </LandContext.Provider>
  );
};

export const useLands = (): LandContextType => {
  const context = useContext(LandContext);
  if (!context) {
    throw new Error("useLands must be used within a LandProvider");
  }
  return context;
};
