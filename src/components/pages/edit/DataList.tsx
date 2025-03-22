import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { plateBadgeColors } from '@/constants/plateBadgeColors';
import { type SelectedCar } from '@/hooks/useSelectedCar';
import { getRandomElement } from '@/utils/randomIndex';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import {
  BinaryIcon,
  CalendarIcon,
  CarIcon,
  ClipboardListIcon,
  CoinsIcon,
  RectangleEllipsisIcon,
  UserCircle2Icon,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function DataList({
  data,
  setData,
}: {
  data: SelectedCar | undefined;
  setData: React.Dispatch<React.SetStateAction<SelectedCar | undefined>>;
}) {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button className="flex flex-row gap-2 p-1 h-fit bg-transparent hover:bg-muted w-full justify-start">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground items-center">
              <RectangleEllipsisIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
              Placa
            </span>
            <span
              className={`h-fit px-[2px] py-[1px] rounded-md text-foreground ${getRandomElement(plateBadgeColors)}`}
            >
              {data?.plate.slice(0, 3)}-{data?.plate.slice(3, 6)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-row gap-2 items-center">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground">
              <RectangleEllipsisIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
              Placa
            </span>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={data?.plate}
              onChange={(value) => {
                const upperValue = value.toUpperCase();
                if (data) {
                  setData({
                    ...data,
                    plate: upperValue,
                  });
                }
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
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <Button className="flex flex-row gap-2 p-1 h-fit bg-transparent hover:bg-muted w-full justify-start">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground items-center">
              <UserCircle2Icon className="w-4.5 h-4.5 stroke-muted-foreground" />
              Propietario
            </span>
            <span className="text-foreground">{data?.owner}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-row gap-2 items-center">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground">
              <UserCircle2Icon className="w-4.5 h-4.5 stroke-muted-foreground" />
              Propietario
            </span>
            <input
              type="text"
              value={data?.owner || ''}
              onChange={(e) => {
                if (data) {
                  setData({
                    ...data,
                    owner: e.target.value,
                  });
                }
              }}
              className="border rounded px-2 py-1"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <Button className="flex flex-row gap-2 p-1 h-fit bg-transparent hover:bg-muted w-full justify-start">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground items-center">
              <CarIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
              Marca y modelo:
            </span>
            <span className="text-foreground">
              {data?.mark} {data?.model}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground">
              <CarIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
              Marca:
            </span>
            <input
              type="text"
              value={data?.mark || ''}
              onChange={(e) => {
                if (data) {
                  setData({
                    ...data,
                    mark: e.target.value,
                  });
                }
              }}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground">
              <CarIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
              Modelo:
            </span>
            <input
              type="text"
              value={data?.model || ''}
              onChange={(e) => {
                if (data) {
                  setData({
                    ...data,
                    model: e.target.value,
                  });
                }
              }}
              className="border rounded px-2 py-1"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <Button className="flex flex-row gap-2 p-1 h-fit bg-transparent hover:bg-muted w-full justify-start">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground items-center">
              <BinaryIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
              RUC:
            </span>
            <span className="text-foreground">{data?.ruc}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-row gap-2 items-center">
            <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground">
              <BinaryIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
              RUC:
            </span>
            <input
              type="text"
              value={data?.ruc || ''}
              onChange={(e) => {
                if (data) {
                  setData({
                    ...data,
                    ruc: e.target.value,
                  });
                }
              }}
              className="border rounded px-2 py-1"
            />
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex flex-row gap-2 p-1">
        <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground items-center">
          <CalendarIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
          Última servicio:
        </span>
        <span className="text-foreground">
          {data?.services[0]?.date ? format(new Date(data.services[0].date), 'PPP', { locale: es }) : ''}
        </span>
      </div>

      <div className="flex flex-row gap-2 p-1">
        <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground items-center">
          <ClipboardListIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
          Nº Servicios:
        </span>
        <span className="text-foreground">{data?.servicesLength}</span>
      </div>

      <div className="flex flex-row gap-2 p-1">
        <span className="flex flex-row gap-1 font-semibold text-sm text-muted-foreground items-center">
          <CoinsIcon className="w-4.5 h-4.5 stroke-muted-foreground" />
          Total pagado:
        </span>
        <span className="text-foreground">s/ {data?.totalPayment}</span>
      </div>
    </>
  );
}
