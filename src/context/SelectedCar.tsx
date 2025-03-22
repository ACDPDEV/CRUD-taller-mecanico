import { createContext, useState } from 'react';

export type SelectedCar = {
  id: string;
  plate: string;
  owner: string;
  mark: string;
  model: string;
  ruc: string;
  lastServiceDate: string;
  servicesLength: number;
  totalPayment: number;
  services: { date: string; action: string; price: number }[];
};

interface SelectedCarContextProps {
  selectedCar: SelectedCar | undefined;
  setSelectedCar: React.Dispatch<React.SetStateAction<SelectedCar | undefined>>;
}

export const SelectedCarContext = createContext<
  SelectedCarContextProps | undefined
>(undefined);

export function SelectedCarProvider({ children }: { children: JSX.Element }) {
  const [selectedCar, setSelectedCar] = useState<SelectedCar | undefined>(
    undefined
  );
  return (
    <SelectedCarContext.Provider value={{ selectedCar, setSelectedCar }}>
      {children}
    </SelectedCarContext.Provider>
  );
}
