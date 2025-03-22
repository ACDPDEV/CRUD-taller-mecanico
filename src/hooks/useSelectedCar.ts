import { CarColumn } from "@/components/pages/search/DataTable";
import { SelectedCarContext, type SelectedCar } from "@/context/SelectedCar";
import { type Car } from "@/hooks/useCars";
import { useContext } from "react";

export type { SelectedCar };

export function CarToSelectedCar(car: Car): SelectedCar {
    return {
        id: car.id,
        plate: car.plate,
        owner: car.owner,
        mark: car.mark,
        model: car.model,
        ruc: car.ruc,
        lastServiceDate: car.services[0].date,
        servicesLength: car.services.length,
        totalPayment: car.services.reduce((total, service) => total + service.price, 0),
        services: car.services,
    };
}

export function CarColumnToSelectedCar(car: CarColumn): SelectedCar {
    return {
        id: car.id,
        plate: car.plate,
        owner: car.owner,
        mark: car.mark,
        model: car.model,
        ruc: car.ruc,
        lastServiceDate: car.lastService,
        servicesLength: car.services.length,
        totalPayment: car.services.reduce((total, service) => total + service.price, 0),
        services: car.services,
    };
}

export function useSelectedCar() {
    const context = useContext(SelectedCarContext);
    if (!context) {
        throw new Error("useSelectedCar must be used within a SelectedCarProvider");
    }
    const { selectedCar, setSelectedCar } = context;
    return { selectedCar, setSelectedCar };
}
