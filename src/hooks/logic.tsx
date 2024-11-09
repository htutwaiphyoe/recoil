import { useCol } from "@/fiebase/dbHooks";
import { where } from "firebase/firestore";

export const useActiveClosure = () => {
  const [value, loading, error] = useCol<Closures>(
    "closures",
    {},
    where("isActive", "==", true)
  );
  const currentClosure = (value?.docs[0].data() || {}) as Closures;
  const activeClosure = currentClosure?.closureDate?.toDate() > new Date();

  const activeFinalClosure =
    currentClosure?.finalClosureDate?.toDate() > new Date();

  return { activeClosure, activeFinalClosure };
};
