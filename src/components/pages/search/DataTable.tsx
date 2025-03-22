'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { plateBadgeColors } from '../../../constants/plateBadgeColors';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppState } from '@/hooks/useAppState';
import { CarColumnToSelectedCar, useSelectedCar } from '@/hooks/useSelectedCar';
import { getRandomElement } from '@/utils/randomIndex';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BinaryIcon,
  CalendarIcon,
  CarIcon,
  RectangleEllipsis,
  UserCircle2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export type CarColumn = {
  id: string;
  plate: string;
  owner: string;
  mark: string;
  model: string;
  ruc: string;
  services: { date: string; action: string; price: number }[];
  markModel: string;
  lastService: string;
};

export const columns: ColumnDef<CarColumn>[] = [
  {
    accessorKey: 'plate',
    header: () => {
      return (
        <span className="flex items-center">
          <RectangleEllipsis className="h-4.5 w-4.5 mr-2 text-muted-foreground" />
          Placa
        </span>
      );
    },
    cell: ({ cell }) => {
      const plate = cell.getValue() as string;
      return (
        <span
          className={`h-fit px-1 py-0.5 rounded-md ${getRandomElement(plateBadgeColors)}`}
        >
          {plate.slice(0, 3)}-{plate.slice(3, 6)}
        </span>
      );
    },
  },
  {
    accessorKey: 'owner',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <UserCircle2 className="h-4.5 w-4.5 mr-2 text-muted-foreground" />
          Propietario
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const owner = cell.getValue() as string;
      return <span className="font-semibold">{owner}</span>;
    },
  },
  {
    accessorKey: 'markModel',
    header: () => {
      return (
        <span className="flex items-center">
          <CarIcon className="h-4.5 w-4.5 mr-2 text-muted-foreground" />
          Marca y modelo
        </span>
      );
    },
    cell: ({ cell }) => {
      const markModel = cell.getValue() as string;
      const [mark, model] = markModel.split('-');
      return (
        <span className="font-light">
          {mark} <span className="text-muted-foreground"> </span> {model}
        </span>
      );
    },
  },
  {
    accessorKey: 'ruc',
    header: () => {
      return (
        <span className="flex items-center">
          <BinaryIcon className="h-4.5 w-4.5 mr-2 text-muted-foreground" />
          RUC
        </span>
      );
    },
    cell: ({ cell }) => {
      const ruc = cell.getValue() as string;
      return <span className="text-accent-foreground font-thin">{ruc}</span>;
    },
  },
  {
    accessorKey: 'lastService',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <CalendarIcon className="h-4.5 w-4.5 mr-2 text-muted-foreground" />
          Último servicio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    // Update the lastService cell renderer
    cell: ({ cell }) => {
      const lastService = cell.getValue() as string;
      return lastService === 'No disponible' ? (
        <span className="text-muted-foreground">No disponible</span>
      ) : (
        <span className="text-accent-foreground bg-primary/10 px-1 py-0.5 font-regular rounded-md">
          {format(new Date(lastService), 'PPP', { locale: es })}
        </span>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { setSelectedCar } = useSelectedCar();
  const { setAppState } = useAppState();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    // Recuperar filtros guardados del localStorage
    const savedFilters = localStorage.getItem('searchFilters');
    return savedFilters ? JSON.parse(savedFilters) : [];
  });

  // Guardar filtros en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('searchFilters', JSON.stringify(columnFilters));
  }, [columnFilters]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full h-full">
      <div className="flex items-center py-4">
        <Tabs defaultValue="plate" className="w-full flex flex-row">
          <TabsList>
            <TabsTrigger value="plate">Placa</TabsTrigger>
            <TabsTrigger value="owner">Propietario</TabsTrigger>
          </TabsList>
          <TabsContent value="plate">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={
                (table.getColumn('plate')?.getFilterValue() as string) ?? ''
              }
              onChange={(value) => {
                value = value.toUpperCase();
                table.getColumn('plate')?.setFilterValue(value);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </TabsContent>
          <TabsContent value="owner">
            <Input
              placeholder="Filtrar por propietario"
              value={
                (table.getColumn('owner')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('owner')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="rounded-md ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    const car = row.original as CarColumn;
                    setSelectedCar(CarColumnToSelectedCar(car));
                    setAppState('edit');
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente <ArrowRight className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
