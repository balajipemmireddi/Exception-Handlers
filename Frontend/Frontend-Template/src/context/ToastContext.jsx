// ToastContext.jsx — React Context definition for global toast state.
// Consumed via useToast hook (src/hooks/useToast.js).

import { createContext } from "react";

export const ToastContext = createContext(null);
