import { useCars } from '@/hooks/useCars';
import { useEffect, useState } from 'react';
import { DataTable, columns, type CarColumn } from './DataTable';

async function getData(): Promise<CarColumn[]> {
  const { mappedCars } = useCars();
  const carsTable = mappedCars.map((car) => ({
    ...car,
    markModel: `${car.mark}-${car.model}`,
    lastService: car.services[0]?.date || 'No disponible',
  }));
  return carsTable;
}

export default function Search() {
  const [data, setData] = useState<CarColumn[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getData();
      setData(data);
    }

    fetchData();
  }, []);

  if (data.length === 0) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto my-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
