import response from "../mock/response.json";

export type Car = {
	id: string;
	plate: string;
	owner: string;
	mark: string;
	model: string;
	ruc: string;
	services: { date: string; action: string; price: number }[];
};

export function useCars() {
	const cars = response.cars || [];

	const mappedCars: Car[] = cars.map((car) => ({
		id: car.id.toString(),
		plate: car.plate,
		owner: car.owner,
		mark: car.mark,
		model: car.model,
		ruc: car.ruc,
		services: car.services
			.slice()
			.sort((s1, s2) => new Date(s2.date).getTime() - new Date(s1.date).getTime()),
	}));

	const sortedCars = [...mappedCars].sort(
		(a, b) =>
			new Date(b.services[0].date).getTime() - new Date(a.services[0].date).getTime(),
	);

	// Agrupar servicios por fecha con total de servicios y ganancias
	const serviceDataByDate: Record<string, { services: number; earnings: number }> = {};

	mappedCars.forEach((car) => {
		car.services.forEach((service) => {
			if (!serviceDataByDate[service.date]) {
				serviceDataByDate[service.date] = { services: 0, earnings: 0 };
			}
			serviceDataByDate[service.date].services += 1;
			serviceDataByDate[service.date].earnings += service.price;
		});
	});

	// Convertir a array de objetos y ordenar por fecha
	const servicesByDate = Object.entries(serviceDataByDate)
		.map(([date, { services, earnings }]) => ({ date, services, earnings }))
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	return { mappedCars, sortedCars, servicesByDate };
}
