"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ReactNode } from "react";

export interface AlertItemProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
  icon?: ReactNode;
}

export function AlertItem({ title, description, variant = "default", icon }: AlertItemProps) {
  return (
    <Alert variant={variant}>
      {icon && icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  );
}
