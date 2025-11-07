"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AlertItem } from "@/components/ui/AlertItem";
import { Terminal } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Outlet } from 'react-router';

// 定义告警项数据类型
interface AlertData {
  title: string;
  description: string;
  variant: "default" | "destructive";
  icon: React.ReactNode;
}

export default function App() {
  // 受控状态：管理告警项数据
  const [alerts] = useState<AlertData[]>([
    {
      title: "Heads up!",
      description: "Your session has expired. Please log in again.",
      variant: "default",
      icon: <Terminal className="h-4 w-4" />
    },
    {
      title: "Error",
      description: "Your session has expired. Please log in again.",
      variant: "destructive",
      icon: <AlertCircle className="h-4 w-4" />
    }
  ]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="p-6">
        <Outlet />
        {/* 循环渲染告警项 */}
        {alerts.map((alert, index) => (
          <AlertItem
            key={index}
            title={alert.title}
            description={alert.description}
            variant={alert.variant}
            icon={alert.icon}
          />
        ))}
      </main>
    </SidebarProvider>
  );
}
