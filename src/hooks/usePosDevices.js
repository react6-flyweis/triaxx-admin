import { useQuery } from "@tanstack/react-query";
import { posDeviceService } from "@/services/posDeviceService";

export function usePosDevices(options = {}) {
  return useQuery({
    queryKey: ["pos_hardware_devices_dashboard"],
    queryFn: async () => {
      const res = await posDeviceService.getHardwareDevicesDashboard();
      return res?.data ?? res; // keep compatibility with other hooks comments
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
  });
}
