"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Типы
interface Account {
  id: string;
  number: string;
  type: "checking" | "savings";
  balance: number;
  mode?: "debit" | "credit";
  isFirstWithdrawal?: boolean;
  creditLimit?: number;
}

interface TransferResponse {
  success: boolean;
  message: string;
}

export default function TransferPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccountId, setFromAccountId] = useState<string>("");
  const [toAccountId, setToAccountId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Загрузка всех счетов кассира (или всей системы)
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const from = accounts.find((a) => a.id === fromAccountId);
    const to = accounts.find((a) => a.id === toAccountId);

    if (!from || !to) {
      toast.error("Выберите оба счёта");
      setIsSubmitting(false);
      return;
    }

    let commission = 0;
    let effectiveAmount = amount;

    // Проверка баланса отправителя
    if (from.type === "checking" && from.mode === "credit") {
      const projectedBalance = from.balance - amount;
      if (projectedBalance < 0) commission = amount * 0.002;
    }

    if (from.type === "savings") {
      if (!from.isFirstWithdrawal) commission = amount * 0.025;
    }

    effectiveAmount = amount + commission;

    if (
      from.type === "checking" &&
      from.mode === "debit" &&
      from.balance < effectiveAmount
    ) {
      toast.error("Недостаточно средств на дебетовом счёте");
      setIsSubmitting(false);
      return;
    }

    if (from.type === "savings" && from.balance < effectiveAmount) {
      toast.error("Недостаточно средств на сберегательном счёте");
      setIsSubmitting(false);
      return;
    }

    if (from.type === "checking" && from.mode === "credit") {
      const projected = from.balance - effectiveAmount;
      if (projected < -(from.creditLimit ?? 0)) {
        toast.error("Превышение кредитного лимита");
        setIsSubmitting(false);
        return;
      }
    }

    // Отправка запроса на бэкэнд
    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromAccountId, toAccountId, amount }),
    });

    const result: TransferResponse = await res.json();

    if (result.success) {
      toast.success("Перевод выполнен успешно");
      setAmount(0);
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Перевод между счетами</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select onValueChange={setFromAccountId}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите счёт-отправитель" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>
                {acc.number} — {acc.type.toUpperCase()} — Баланс:{" "}
                {acc.balance.toLocaleString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Сумма перевода"
        />

        <Select onValueChange={setToAccountId}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите счёт-получатель" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.id}>
                {acc.number} — {acc.type.toUpperCase()} — Баланс:{" "}
                {acc.balance.toLocaleString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Перевод..." : "Выполнить перевод"}
        </Button>
      </form>
    </div>
  );
}
