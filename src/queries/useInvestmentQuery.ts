import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { investmentService } from "../services/investmentService";
import { InvestmentCreate } from "../models/investment";

export const useInvestmentQuery = (supplierId?: number) => {
  const queryClient = useQueryClient();

  const investmentsQuery = useQuery({
    queryKey: ["investments", supplierId],
    queryFn: () =>
      supplierId
        ? investmentService.getInvestmentsBySupplier(supplierId)
        : investmentService.getAllInvestments(),
    staleTime: 0,
  });

  const createInvestmentMutation = useMutation({
    mutationFn: (inv: InvestmentCreate) => investmentService.createInvestment(inv),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
      await queryClient.refetchQueries({ queryKey: ["investments"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["supplierProducts"] });
    },
  });

  const deleteInvestmentMutation = useMutation({
    mutationFn: (id: number) => investmentService.deleteInvestment(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investments"] });
      await queryClient.refetchQueries({ queryKey: ["investments"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["supplierProducts"] });
    },
  });

  return {
    investmentsQuery,
    createInvestmentMutation,
    deleteInvestmentMutation,
  };
};
