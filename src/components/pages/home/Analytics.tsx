'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCars } from '@/hooks/useCars';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export default function Analytics() {
  const { servicesByDate: chartData } = useCars();
  const [timeRange, setTimeRange] = React.useState('todo'); // Valor por defecto

  // Mapeo de rangos de tiempo en días para filtrar los datos
  const periodMapping: { [key: string]: number } = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '6m': 180,
    '1y': 365,
    '3y': 1095,
  };

  // Mapeo de umbrales para habilitar las opciones en el selector
  const enableThresholdMapping: { [key: string]: number } = {
    '7d': 0,
    '30d': 8,
    '90d': 31,
    '6m': 91,
    '1y': 181,
    '3y': 366,
    todo: 0,
  };

  // Opciones del selector
  const options = [
    { value: '7d', label: 'Última semana' },
    { value: '30d', label: 'Último mes' },
    { value: '90d', label: 'Últimos 3 meses' },
    { value: '6m', label: 'Últimos 6 meses' },
    { value: '1y', label: 'Último año' },
    { value: '3y', label: 'Últimos 3 años' },
    { value: 'todo', label: 'Todo' },
  ];

  // Suponemos que chartData está ordenado ascendentemente (el primero es el más antiguo)
  const earliestDate = React.useMemo(() => {
    if (!chartData.length) return null;
    return new Date(chartData[0].date);
  }, [chartData]);

  // Fecha de referencia: último dato de chartData
  const referenceDate = React.useMemo(() => {
    if (!chartData.length) return new Date();
    return new Date(chartData[chartData.length - 1].date);
  }, [chartData]);

  // Total de días disponibles en los datos
  const availableDays = React.useMemo(() => {
    if (!earliestDate) return 0;
    return Math.floor(
      (referenceDate.getTime() - earliestDate.getTime()) / (1000 * 3600 * 24)
    );
  }, [earliestDate, referenceDate]);

  // Filtrado de datos según el rango seleccionado; si es "todo", se muestran todos los datos
  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];
    if (timeRange === 'todo') return chartData;
    const daysToSubtract = periodMapping[timeRange] || 30;
    const startDate = new Date(referenceDate);
    startDate.setDate(referenceDate.getDate() - daysToSubtract);
    return chartData.filter(({ date }) => new Date(date) >= startDate);
  }, [chartData, timeRange, referenceDate]);

  const chartConfig = {
    services: { label: 'Servicios', color: 'hsl(var(--chart-1))' },
    earnings: { label: 'Ganancias', color: 'hsl(var(--chart-2))' },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-3xl font-bold">
            Servicios y Ganancias
          </CardTitle>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Selecciona un rango"
          >
            <SelectValue placeholder="Selecciona un rango" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {options.map((option) => {
              const disabled =
                option.value !== 'todo' &&
                availableDays < enableThresholdMapping[option.value];
              return (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={disabled}
                  className="rounded-lg"
                >
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillServices" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-services)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-services)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-earnings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-earnings)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="hsl(var(--chart-1))"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--chart-2))"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              yAxisId="left"
              dataKey="services"
              type="monotone"
              fill="url(#fillServices)"
              stroke="var(--color-services)"
            />
            <Area
              yAxisId="right"
              dataKey="earnings"
              type="monotone"
              fill="url(#fillEarnings)"
              stroke="var(--color-earnings)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
