import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
('use client');

import { format } from 'date-fns';
import { es } from 'date-fns/locale/es'; // Añadir este import
import { CalendarIcon, Trash2Icon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function DatePicker({
  defaultDate,
  onChange,
}: {
  defaultDate?: Date | string;
  onChange?: (date: Date | undefined) => void;
}) {
  // Safely convert string to Date, using current date as fallback for empty/invalid dates
  const initialDate = React.useMemo(() => {
    if (!defaultDate) return new Date();
    if (typeof defaultDate === 'string') {
      try {
        const date = new Date(defaultDate);
        // Check if date is valid
        return isNaN(date.getTime()) ? new Date() : date;
      } catch (e) {
        return new Date();
      }
    }
    return defaultDate;
  }, [defaultDate]); // This dependency ensures recalculation when defaultDate changes

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  
  // Update internal state when defaultDate changes
  React.useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'PPP', { locale: es })
          ) : (
            <span>Seleccionar fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            onChange?.(newDate); // Llamar al callback aquí
          }}
          locale={es}
          weekStartsOn={1}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default function ServiceCard({
  date,
  price,
  action,
  setService,
  onDelete,
}: {
  date: string;
  price: number;
  action: string;
  setService: (
    updatedService: Partial<{ date: string; price: number; action: string }>
  ) => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex flex-row w-full h-fit p-2 gap-2 bg-background border border-border rounded-lg">
      <div className="flex flex-col gap-2">
        <DatePicker
          defaultDate={date || ''}
          onChange={(newDate) => {
            if (newDate) {
              setService({ date: newDate.toISOString() });
            }
          }}
        />
        <div className="flex flex-row">
          <span className="flex items-center justify-center p-1 bg-primary-foreground rounded-l-sm">
            s/
          </span>
          <Input
            className="rounded-l-none"
            value={price === 0 ? '' : price}
            onChange={(e) => {
              const value = e.target.value;
              // If empty, set to 0 but allow the input to show empty
              setService({ price: value === '' ? 0 : Number(value) });
            }}
            type="number"
          />
        </div>
        <Button 
          className="w-fit bg-destructive-foreground"
          onClick={onDelete}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Textarea
        className="h-full"
        value={action || ''}
        onChange={(e) => {
          setService({ action: e.target.value });
        }}
      />
    </div>
  );
}
