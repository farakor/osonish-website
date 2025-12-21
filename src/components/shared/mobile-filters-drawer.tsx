"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";

interface MobileFiltersDrawerProps {
  title: string;
  children: ReactNode;
  onApply?: () => void;
  onClear?: () => void;
  applyLabel?: string;
  clearLabel?: string;
  activeFilterCount?: number;
}

export function MobileFiltersDrawer({
  title,
  children,
  onApply,
  onClear,
  applyLabel = "Применить",
  clearLabel = "Очистить",
  activeFilterCount = 0,
}: MobileFiltersDrawerProps) {
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply?.();
    setOpen(false);
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 text-base font-medium relative"
        >
          <Filter className="h-5 w-5 mr-2" />
          {title}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-4">
          {children}
        </div>

        {/* Sticky footer with actions */}
        <SheetFooter className="flex-row gap-2 sticky bottom-0 bg-background border-t pt-4">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={handleClear}
          >
            <X className="h-4 w-4 mr-2" />
            {clearLabel}
          </Button>
          <Button
            className="flex-1 h-12 text-white"
            onClick={handleApply}
          >
            {applyLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

