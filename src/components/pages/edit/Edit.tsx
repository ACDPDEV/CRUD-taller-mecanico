import { Button } from '@/components/ui/button';
import { messages } from '@/constants/messages';
import { useSelectedCar } from '@/hooks/useSelectedCar';
import { SaveIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import DataList from './DataList';
import ServiceCard from './ServiceCard';

// Zod schema for car data validation
const carSchema = z.object({
  id: z.string(),
  plate: z
    .string()
    .length(6, 'La placa debe tener 6 caracteres')
    .refine(
      (val) => /^[A-Z]\d[A-Z]\d\d\d$/.test(val),
      'La placa debe seguir el formato: Letra-Número-Letra-Número-Número-Número'
    ),
  owner: z
    .string()
    .min(3, 'El nombre del propietario debe tener al menos 3 caracteres'),
  mark: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
  model: z.string().min(2, 'El modelo debe tener al menos 2 caracteres'),
  ruc: z.string().regex(/^\d+$/, 'El RUC debe contener solo números'),
  services: z.array(
    z.object({
      date: z.string(),
      price: z.number().optional(),
      action: z.string().optional(),
    })
  ),
  servicesLength: z.number(),
  totalPayment: z.number(),
});

export default function Edit() {
  const { selectedCar, setSelectedCar } = useSelectedCar();
  const [isEdited, setIsEdited] = useState(false);
  const [originalCar, setOriginalCar] = useState(selectedCar);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Set original car data when component mounts or selectedCar changes
  useEffect(() => {
    setOriginalCar(selectedCar);
    setIsEdited(false);
  }, [selectedCar?.id]);

  // Update derived properties when services change
  useEffect(() => {
    if (selectedCar && selectedCar.services) {
      // Calculate total payment from all services
      const totalPayment = selectedCar.services.reduce(
        (sum, service) => sum + (service.price || 0),
        0
      );
      
      // Update the derived properties
      setSelectedCar({
        ...selectedCar,
        servicesLength: selectedCar.services.length,
        totalPayment: totalPayment
      });
    }
  }, [selectedCar?.services]);

  // Check if car data has been modified
  useEffect(() => {
    if (originalCar && selectedCar) {
      const hasChanged =
        JSON.stringify(originalCar) !== JSON.stringify(selectedCar);
      setIsEdited(hasChanged);

      // Validate car data
      const result = carSchema.safeParse(selectedCar);
      if (!result.success) {
        const formattedErrors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          const field = error.path[0] as string;
          // Filter out "required" errors
          if (!error.message.includes('Required')) {
            formattedErrors[field] = error.message;
          }
        });
        setValidationErrors(formattedErrors);
      } else {
        setValidationErrors({});
      }
    }
  }, [selectedCar, originalCar]);

  const handleSave = () => {
    // Validate car data before saving
    if (!selectedCar) return;

    const result = carSchema.safeParse(selectedCar);
    if (!result.success) {
      console.error('Errores de validación:', result.error);
      toast(messages.validation.error, {
        description: messages.validation.pleaseFixErrors,
      });
      return;
    }

    try {
      // Here you would typically save the data to your backend
      // For now, we'll just update the original car and show a success message
      setOriginalCar({ ...selectedCar });
      setIsEdited(false);
      toast(messages.operations.saveSuccess, {
        description: messages.operations.vehicleUpdated,
      });
    } catch (error) {
      console.error('Error saving car data:', error);
      toast(messages.operations.saveError, {
        description: messages.operations.errorOccurred,
      });
    }
  };

  return (
    <div className="grid h-full grid-cols-[1fr_2fr] overflow-hidden">
      <div className="flex flex-col gap-8 p-6 md:p-10 overflow-hidden">
        <div className="flex w-full items-center justify-center gap-2">
          <h1 className="text-2xl font-bold">{messages.labels.data}</h1>
        </div>
        <div className="flex flex-col gap-2 h-full overflow-scroll">
          <DataList data={selectedCar} setData={setSelectedCar} />
          {isEdited && Object.keys(validationErrors).length > 0 && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive">
              <h3 className="text-sm font-medium text-destructive mb-1">
                {messages.validation.validationErrors}
              </h3>
              <ul className="text-xs text-destructive list-disc pl-4">
                {Object.entries(validationErrors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button className="bg-destructive-foreground">
            <Trash2Icon className="mr-2" />
            {messages.labels.delete}
          </Button>

          {isEdited && (
            <Button
              className="bg-primary"
              onClick={handleSave}
              disabled={Object.keys(validationErrors).length > 0}
            >
              <SaveIcon className="mr-2" />
              {messages.labels.save}
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col p-6 bg-muted h-full overflow-auto gap-4">
        {selectedCar?.services?.map((service, index) => (
          <ServiceCard
            key={`service-${service.date}-${index}`}
            date={service.date}
            price={service.price ?? 0}
            action={service.action ?? ''}
            setService={(updatedService) => {
              if (selectedCar) {
                const updatedServices = [...selectedCar.services];
                updatedServices[index] = {
                  ...updatedServices[index],
                  ...updatedService,
                };

                setSelectedCar({
                  ...selectedCar,
                  services: updatedServices,
                });
              }
            }}
            onDelete={() => {
              if (selectedCar) {
                const updatedServices = [...selectedCar.services];
                updatedServices.splice(index, 1);

                setSelectedCar({
                  ...selectedCar,
                  services: updatedServices,
                });
              }
            }}
          />
        ))}
        <Button
          onClick={() => {
            if (selectedCar) {
              const newService = {
                date: new Date().toISOString(), // Use current date instead of empty string
                price: 0,
                action: '',
              };

              setSelectedCar({
                ...selectedCar,
                services: [...selectedCar.services, newService],
              });
            }
          }}
        >
          Añadir servicio
        </Button>
      </div>
    </div>
  );
}
