import { store } from "@/shared/lib/store";

/** Совпадает с дефолтом в `MessengerLayout` до появления контроллеров / API. */
export function bootstrapAppStore(): void {
  store.setState("user.sidebar", {
    firstName: "Alex",
    lastName: "Morgan",
    status: "Playing games",
  });
}
