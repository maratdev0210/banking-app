"use client";

import { useEffect, useState } from "react";
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

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: "CHECK" | "SAVINGS";
  checkAccount?: {
    accountType: "CREDIT" | "DEBIT";
  };
}

export default function TransferPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then(setAccounts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromId || !toId || !amount) {
      toast.error("Заполните все поля");
      return;
    }
    if (fromId === toId) {
      toast.error("Счёт-отправитель и получатель не могут совпадать");
      return;
    }
    setIsSubmitting(true);
    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAccountId: parseInt(fromId),
        toAccountId: parseInt(toId),
        amount: parseFloat(amount),
      }),
    });
    const data = await res.json();
    if (data.success) toast.success("Перевод выполнен");
    else toast.error(data.message || "Ошибка перевода");
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Перевод между клиентами</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Счёт-отправитель</label>
          <Select onValueChange={setFromId}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите счёт" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.accountNumber} — {a.accountType} —{" "}
                  {a.balance.toLocaleString()}₽
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-1">Сумма</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму перевода"
          />
        </div>
        <div>
          <label className="block mb-1">Счёт-получатель</label>
          <Select onValueChange={setToId}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите счёт" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.accountNumber} — {a.accountType} —{" "}
                  {a.balance.toLocaleString()}₽
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Выполняется..." : "Подтвердить перевод"}
        </Button>
      </form>
    </div>
  );
}
