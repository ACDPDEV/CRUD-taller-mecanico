import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { messages } from '@/constants/messages';
import { useAppState } from '@/hooks/useAppState';
import { CarToSelectedCar, useSelectedCar } from '@/hooks/useSelectedCar';
import { getRandomElement } from '@/utils/randomIndex';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { BinaryIcon, CalendarIcon, CarIcon } from 'lucide-react';
import { useMemo } from 'react';
import { plateBadgeColors } from '../../../constants/plateBadgeColors';
import { type Car, useCars } from '../../../hooks/useCars';

function ListRecentCars({ cars }: { cars: Car[] }) {
  const { setSelectedCar } = useSelectedCar();
  const { setAppState } = useAppState();
  const recentCars = useMemo(() => {
    return cars.slice(0, 9);
  }, [cars]);

  const carrouselItems = useMemo(() => {
    return recentCars.map((car) => (
      <CarouselItem
        onClick={() => {
          setSelectedCar(CarToSelectedCar(car));
          setAppState('edit');
        }}
        key={car.id}
        className="md:basis-1/2 lg:basis-1/3 flex flex-col min-w-fit p-4 gap-2 rounded-xl bg-background border border-border shadow-md text-foreground"
      >
        <div className="flex flex-row justify-between mb-4">
          <span
            className={`h-fit px-1 py-0.5 rounded-md ${getRandomElement(plateBadgeColors)}`}
          >
            {car.plate.slice(0, 3)}-{car.plate.slice(3, 6)}
          </span>
          <span className="text-sm font-bold">{car.owner}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground">
            <CarIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
            {messages.labels.brandAndModel}:
          </span>
          <span>
            {car.mark} {car.model}
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground">
            <BinaryIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
            {messages.labels.ruc}:
          </span>
          <span>{car.ruc}</span>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-row gap-2">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground">
              <CalendarIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
              {messages.labels.lastModification}:
            </span>
            <span>
              {car.services[0]?.date
                ? format(new Date(car.services[0].date), 'PPP', { locale: es })
                : ''}
            </span>
          </div>
        </div>
      </CarouselItem>
    ));
  }, [recentCars]);
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="flex flex-col w-full"
    >
      <CarouselContent className="flex flex-row min-h-fit p-2 gap-2">
        {carrouselItems}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default function Recents() {
  const { sortedCars } = useCars();
  const haveCars = sortedCars.length > 0;

  return haveCars ? (
    <ListRecentCars cars={sortedCars} />
  ) : (
    <span>{messages.operations.noResults}</span>
  );
}
