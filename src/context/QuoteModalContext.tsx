import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import QuoteRequestModal from "@/components/feature/QuoteRequestModal";

interface QuoteModalContextValue {
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
  isQuoteModalOpen: boolean;
}

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openQuoteModal = useCallback(() => setIsOpen(true), []);
  const closeQuoteModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      openQuoteModal,
      closeQuoteModal,
      isQuoteModalOpen: isOpen,
    }),
    [isOpen, openQuoteModal, closeQuoteModal]
  );

  return (
    <QuoteModalContext.Provider value={value}>
      {children}
      <QuoteRequestModal open={isOpen} onClose={closeQuoteModal} />
    </QuoteModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) {
    throw new Error("useQuoteModal must be used within QuoteModalProvider");
  }
  return ctx;
}
