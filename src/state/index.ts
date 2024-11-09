import { atom } from "recoil";

export const LoggedInUserAtom = atom<LoggedInUser>({
  key: "LoggedInUserAtom",
  default: {
    id: "",
    name: "",
    email: "",
    role: "",
    department: "",
    agreedTerms: false,
    isActive: true,
  },
});

export const activeClosureAtom = atom<{
  activeClosure: boolean;
  activeFinalClosure: boolean;
  isClosureActive: boolean;
}>({
  key: "activeClosureAtom",
  default: {
    activeClosure: false,
    activeFinalClosure: false,
    isClosureActive: false,
  },
});
