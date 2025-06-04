"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, RepeatIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SessionStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfers: number;
  depositsByAccountType: {
    CHECK: number;
    SAVINGS: number;
  };
  withdrawalsByAccountType: {
    CHECK: number;
    SAVINGS: number;
  };
}

export default function CashierSessionPage() {
  const [data, setData] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/session/current")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-40 w-full mt-10" />;
  if (!data)
    return (
      <p className="text-red-500 p-4">Сеанс не найден или ошибка загрузки</p>
    );

  const chartData = [
    {
      name: "Чековые",
      Поступления: data.depositsByAccountType.CHECK,
      Снятия: data.withdrawalsByAccountType.CHECK,
    },
    {
      name: "Сберегательные",
      Поступления: data.depositsByAccountType.SAVINGS,
      Снятия: data.withdrawalsByAccountType.SAVINGS,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">
        Статистика текущего сеанса кассира
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-green-600">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <ArrowDownIcon className="w-5 h-5" /> Поступления
            </CardTitle>
            <Badge variant="outline">Всего</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-800">
              {data.totalDeposits.toLocaleString()} ₽
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                Чековые: {data.depositsByAccountType.CHECK.toLocaleString()} ₽
              </p>
              <p>
                Сберегательные:{" "}
                {data.depositsByAccountType.SAVINGS.toLocaleString()} ₽
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-600">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <ArrowUpIcon className="w-5 h-5" /> Снятия
            </CardTitle>
            <Badge variant="outline">Всего</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-800">
              {data.totalWithdrawals.toLocaleString()} ₽
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                Чековые: {data.withdrawalsByAccountType.CHECK.toLocaleString()}{" "}
                ₽
              </p>
              <p>
                Сберегательные:{" "}
                {data.withdrawalsByAccountType.SAVINGS.toLocaleString()} ₽
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-600">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <RepeatIcon className="w-5 h-5" /> Переводы
            </CardTitle>
            <Badge variant="outline">Общая сумма</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-800">
              {data.totalTransfers.toLocaleString()} ₽
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Внутренние переводы между клиентскими счетами
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle> График по типам операций</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: string) => `${value} ₽`} />
              <Legend />
              <Bar dataKey="Поступления" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Снятия" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
