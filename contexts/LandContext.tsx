import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Land {
  id: string;
  name: string;
  location: string;
  coords?: { latitude: number; longitude: number }[];
  center?: { latitude: number; longitude: number };
  images?: string[]; // multiple images
  soilType?: string;
  temperature?: string;
  area?: { land: string; building?: string }; // misal "500 m²", "200 m²"
  price?: number;
  status?: "available" | "sold" | "rented";
  crop?: string;
  owner?: string;
  isOnline?: boolean;
  fertilizer?: { date: string; type: string; weight: string }[];
  isForSale?: boolean;
  rating?: number;
  type?: "house" | "apartment" | "shop" | "land";
  facilities?: string[];
  description?: string;
}

interface LandContextType {
  lands: Land[];
  setLands: React.Dispatch<React.SetStateAction<Land[]>>;
}

const LandContext = createContext<LandContextType | undefined>(undefined);

export const LandProvider = ({ children }: { children: ReactNode }) => {
  const [lands, setLands] = useState<Land[]>([
    {
      id: "1",
      name: "Rumah Mewah Sleman",
      location: "Sleman, Yogyakarta",
      price: 1200000000,
      area: { land: "350 m²", building: "200 m²" },
      status: "available",
      type: "house",
      rating: 4.8,
      owner: "Budi Santoso",
      isForSale: true,
      facilities: ["3 Bedrooms", "2 Bathrooms", "Garage", "Swimming Pool"],
      description: "Rumah mewah dengan fasilitas lengkap, dekat pusat kota dan sekolah.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      images: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      ],
    },
    {
      id: "2",
      name: "Apartemen Kalasan",
      location: "Kalasan, Sleman",
      price: 850000000,
      area: { land: "n/a", building: "90 m²" },
      status: "available",
      type: "apartment",
      rating: 4.6,
      owner: "Siti Aminah",
      isForSale: true,
      facilities: ["2 Bedrooms", "1 Bathroom", "Balcony", "Gym Access"],
      description: "Apartemen modern dengan akses mudah ke pusat kota dan kampus.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      ],
    },
    {
      id: "3",
      name: "Ruko Strategis Jogja",
      location: "Umbulharjo, Yogyakarta",
      price: 1500000000,
      area: { land: "150 m²", building: "120 m²" },
      status: "available",
      type: "shop",
      rating: 4.7,
      owner: "Agus Santoso",
      isForSale: true,
      facilities: ["2 Lantai", "1 Garage", "Parkir Luas"],
      description: "Ruko strategis di pusat kota, cocok untuk usaha atau kantor.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      ],
    },
    {
      id: "4",
      name: "Tanah Kavling Bantul",
      location: "Bantul, Yogyakarta",
      price: 50000000,
      area: { land: "100 m²" },
      status: "available",
      type: "land",
      rating: 4.4,
      owner: "Rina Wulandari",
      isForSale: true,
      facilities: ["Dekat Jalan Raya", "Akses Air & Listrik"],
      description: "Tanah kavling siap bangun, cocok untuk rumah atau investasi.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      images: [
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=800",
      ],
    },
  ]);

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
