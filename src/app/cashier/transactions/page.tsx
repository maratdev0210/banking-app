"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownIcon, ArrowUpIcon, RepeatIcon } from "lucide-react";

interface Transaction {
  id: number;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
  amount: number;
  fee: number;
  timestamp: string;
  sourceAccount?: {
    accountNumber: string;
  };
  targetAccount?: {
    accountNumber: string;
  };
}

export default function CashierTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/session/transactions")
      .then((res) => res.json())
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">История операций текущего сеанса</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Фильтр по типу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все операции</SelectItem>
            <SelectItem value="DEPOSIT">Поступления</SelectItem>
            <SelectItem value="WITHDRAWAL">Снятия</SelectItem>
            <SelectItem value="TRANSFER">Переводы</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">
          Нет операций по выбранному фильтру.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Операции: {filter === "ALL" ? "Все" : filter}
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {filtered.map((tx) => (
              <div key={tx.id} className="flex justify-between py-2 text-sm">
                <div className="flex items-center gap-2">
                  {tx.type === "DEPOSIT" && (
                    <ArrowDownIcon className="text-green-600 w-4 h-4" />
                  )}
                  {tx.type === "WITHDRAWAL" && (
                    <ArrowUpIcon className="text-red-600 w-4 h-4" />
                  )}
                  {tx.type === "TRANSFER" && (
                    <RepeatIcon className="text-blue-600 w-4 h-4" />
                  )}
                  <span>
                    <strong>{tx.type}</strong> на {tx.amount.toLocaleString()} ₽
                    {tx.fee > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (комиссия: {tx.fee.toLocaleString()} ₽)
                      </span>
                    )}
                  </span>
                </div>
                <div className="text-right space-y-1">
                  {tx.sourceAccount && (
                    <p className="text-xs">
                      Счёт отправителя:{" "}
                      <span className="font-mono">
                        {tx.sourceAccount.accountNumber}
                      </span>
                    </p>
                  )}
                  {tx.targetAccount && (
                    <p className="text-xs">
                      Счёт получателя:{" "}
                      <span className="font-mono">
                        {tx.targetAccount.accountNumber}
                      </span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
