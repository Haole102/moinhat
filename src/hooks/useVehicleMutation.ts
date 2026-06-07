import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  vehicleService,
  Vehicle,
  MaintenanceExpense,
} from "@/lib/services/vehicle.service";

export function useVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Vehicle>) => vehicleService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles_data"] });
    },
  });
}

export function useExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MaintenanceExpense>) =>
      vehicleService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses_data"] });
    },
  });
}

export function useApproveExpenseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) => vehicleService.approveExpense(expenseId),
    onSuccess: () => {
      // Ép cả bảng xe và bảng dòng tiền tài chính tính toán lại ngầm đồng bộ
      queryClient.invalidateQueries({ queryKey: ["expenses_data"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles_data"] });
    },
  });
}
