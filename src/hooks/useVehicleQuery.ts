import { useQuery } from "@tanstack/react-query";
import {
  vehicleService,
  Vehicle,
  MaintenanceExpense,
} from "@/lib/services/vehicle.service";

export function useVehicleQuery(initialData: Vehicle[]) {
  return useQuery({
    queryKey: ["vehicles_data"],
    queryFn: () => vehicleService.getVehicles(),
    initialData,
    staleTime: 1000 * 60 * 3,
  });
}

export function useExpenseQuery(initialData?: MaintenanceExpense[]) {
  return useQuery({
    queryKey: ["expenses_data"],
    queryFn: () => vehicleService.getExpenses(),
    initialData,
    staleTime: 1000 * 60 * 3,
  });
}
