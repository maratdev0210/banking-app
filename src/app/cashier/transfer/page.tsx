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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: "CHECK" | "SAVINGS";
  checkAccount?: {
    accountType: "DEBIT" | "CREDIT";
  };
  client: {
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
  type: string;
  sourceAccount?: { accountNumber: string };
  targetAccount?: { accountNumber: string };
}

export default function TransferPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictedFee, setPredictedFee] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/api/accounts?withClients=true")
      .then((res) => res.json())
      .then(setAccounts);
  }, []);

  const selectedFrom = accounts.find((a) => a.id.toString() === fromId);
  const selectedTo = accounts.find((a) => a.id.toString() === toId);

  const formatOwner = (acc: Account) =>
    acc.client.clientType === "PHYSICAL"
      ? `${acc.client.physical?.lastName} ${acc.client.physical?.firstName}`
      : acc.client.legal?.companyName;

  useEffect(() => {
    if (selectedFrom && amount) {
      const amt = parseFloat(amount);
      if (!amt || isNaN(amt)) return setPredictedFee(null);
      if (
        selectedFrom.accountType === "CHECK" &&
        selectedFrom.checkAccount?.accountType === "CREDIT"
      ) {
        setPredictedFee(selectedFrom.balance - amt < 0 ? amt * 0.002 : 0);
      } else if (selectedFrom.accountType === "SAVINGS") {
        setPredictedFee(amt * 0.025);
      } else {
        setPredictedFee(0);
      }
    } else {
      setPredictedFee(null);
    }
  }, [selectedFrom, amount]);

  useEffect(() => {
    if (fromId) {
      fetch(`/api/accounts/${fromId}/transactions`)
        .then((res) => res.json())
        .then(setTransactions);
    }
  }, [fromId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromId || !toId || !amount) {
      toast.error("Заполните все поля");
      return;
    }
    if (fromId === toId) {
      toast.error("Счёта не могут совпадать");
      return;
    }

    setIsSubmitting(true);
    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAccountId: Number(fromId),
        toAccountId: Number(toId),
        amount: parseFloat(amount),
      }),
    });
    const data = await res.json();
    if (data.success) toast.success("Перевод успешно выполнен");
    else toast.error(data.message || "Ошибка перевода");
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Перевод между счетами</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Счёт отправителя</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select onValueChange={setFromId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите счёт" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>
                      {acc.accountNumber} — {formatOwner(acc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFrom && (
                <div className="text-sm space-y-1">
                  <p>Баланс: {selectedFrom.balance.toLocaleString()} ₽</p>
                  <p>
                    Тип:{" "}
                    {selectedFrom.accountType === "CHECK"
                      ? "Чековый"
                      : "Сберегательный"}
                  </p>
                  {selectedFrom.checkAccount && (
                    <p>Подтип: {selectedFrom.checkAccount.accountType}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Сумма перевода</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                type="number"
                placeholder="Введите сумму"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {predictedFee !== null && (
                <p className="text-sm text-muted-foreground">
                  Прогноз комиссии: {predictedFee.toFixed(2)} ₽
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Счёт получателя</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select onValueChange={setToId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите счёт" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>
                      {acc.accountNumber} — {formatOwner(acc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTo && (
                <div className="text-sm space-y-1">
                  <p>Баланс: {selectedTo.balance.toLocaleString()} ₽</p>
                  <p>
                    Тип:{" "}
                    {selectedTo.accountType === "CHECK"
                      ? "Чековый"
                      : "Сберегательный"}
                  </p>
                  {selectedTo.checkAccount && (
                    <p>Подтип: {selectedTo.checkAccount.accountType}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Перевод..." : "Подтвердить перевод"}
            </Button>
          </div>
        </div>
      </form>

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Последние операции</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b py-1"
              >
                <div>
                  <span className="font-medium">{tx.type}</span> →{" "}
                  {tx.targetAccount?.accountNumber || "-"}
                </div>
                <div className="text-right">
                  <div>{tx.amount.toLocaleString()} ₽</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
