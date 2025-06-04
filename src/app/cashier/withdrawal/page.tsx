"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { BanknoteIcon, ArrowUpCircleIcon } from "lucide-react";

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: "CHECK" | "SAVINGS";
  checkAccount?: {
    accountType: "CREDIT" | "DEBIT";
  };
  client: {
    id: number;
    clientType: "PHYSICAL" | "LEGAL";
    physical?: { firstName: string; lastName: string };
    legal?: { companyName: string };
  };
}

interface Transaction {
  id: number;
  amount: number;
  fee: number;
  timestamp: string;
  sourceAccountId: number;
}

export default function CashierWithdrawalPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const selectedAccount = accounts.find((a) => a.id === selectedId) || null;

  useEffect(() => {
    fetch("/api/accounts?withClients=true")
      .then((res) => res.json())
      .then(setAccounts);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setPage(1);
    fetch(`/api/accounts/${selectedId}/transactions?type=WITHDRAWAL&page=1`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions);
        setHasMore(data.hasMore);
      });
  }, [selectedId]);

  const loadMore = async () => {
    if (!selectedId) return;
    const nextPage = page + 1;
    const res = await fetch(
      `/api/accounts/${selectedId}/transactions?type=WITHDRAWAL&page=${nextPage}`
    );
    const data = await res.json();
    setTransactions((prev) => [...prev, ...data.transactions]);
    setHasMore(data.hasMore);
    setPage(nextPage);
  };

  const formatOwner = (acc: Account) =>
    acc.client.clientType === "PHYSICAL"
      ? `${acc.client.physical?.lastName} ${acc.client.physical?.firstName}`
      : acc.client.legal?.companyName;

  const handleWithdraw = async () => {
    const value = parseFloat(amount);
    if (!selectedId || isNaN(value) || value <= 0) {
      toast.error("Введите корректную сумму и выберите счёт");
      return;
    }

    setIsLoading(true);
    const res = await fetch("/api/withdrawal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: selectedId, amount: value }),
    });
    const result = await res.json();

    if (res.ok) {
      toast.success("Снятие выполнено");
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === selectedId ? { ...a, balance: a.balance - value } : a
        )
      );
      setAmount("");
      setPage(1);
      fetch(`/api/accounts/${selectedId}/transactions?type=WITHDRAWAL&page=1`)
        .then((res) => res.json())
        .then((data) => {
          setTransactions(data.transactions);
          setHasMore(data.hasMore);
        });
    } else {
      toast.error(result.message || "Ошибка при снятии");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <ArrowUpCircleIcon className="text-red-600" />
          <CardTitle>Снятие средств со счёта клиента</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите счёт</label>
            <Select
              value={selectedId?.toString()}
              onValueChange={(val) => setSelectedId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите счёт" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id.toString()}>
                    {acc.accountNumber} — {formatOwner(acc)} (
                    {acc.balance.toLocaleString()} ₽)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAccount && (
            <div className="text-sm text-muted-foreground">
              Баланс:{" "}
              <strong>{selectedAccount.balance.toLocaleString()} ₽</strong> |
              Тип:{" "}
              {selectedAccount.accountType === "CHECK"
                ? "Чековый"
                : "Сберегательный"}
              {selectedAccount.checkAccount && (
                <>
                  {" "}
                  (
                  {selectedAccount.checkAccount.accountType === "CREDIT"
                    ? "Кредитный"
                    : "Дебетовый"}
                  )
                </>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Сумма снятия</label>
            <Input
              type="number"
              placeholder="Введите сумму"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button onClick={handleWithdraw} disabled={isLoading}>
            {isLoading ? "Обработка..." : "Подтвердить снятие"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <BanknoteIcon className="text-yellow-500" />
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>
            • Со сберегательных счетов взимается комиссия 2.5%, кроме первого
            снятия в месяце.
          </p>
          <p>
            • С кредитных счетов комиссия 0.2%, если после снятия баланс уходит
            в минус.
          </p>
          <p>• С дебетных счетов нельзя снимать больше текущего баланса.</p>
        </CardContent>
      </Card>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>История снятий</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between border-b py-1">
                <span>{new Date(tx.timestamp).toLocaleString()}</span>
                <span>-{tx.amount.toLocaleString()} ₽</span>
                <span className="text-xs text-muted-foreground">
                  Комиссия: {tx.fee.toLocaleString()} ₽
                </span>
              </div>
            ))}
            {hasMore && (
              <Button variant="outline" size="sm" onClick={loadMore}>
                Загрузить ещё
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
