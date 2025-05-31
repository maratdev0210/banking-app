"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TransactionFormProps {
  accountId: number;
  clientId: number;
  onSuccess: () => void;
}

export default function TransactionForm({
  accountId,
  clientId,
  onSuccess,
}: TransactionFormProps) {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
  const [fee, setFee] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId,
          clientId,
          type,
          amount,
          fee,
        }),
      });

      if (!response.ok) throw new Error("Ошибка выполнения операции");

      onSuccess();
    } catch (error) {
      console.error("Transaction error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Тип операции</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Button
            type="button"
            onClick={() => setType("deposit")}
            variant={type === "deposit" ? "default" : "outline"}
          >
            Пополнение
          </Button>
          <Button
            type="button"
            onClick={() => setType("withdrawal")}
            variant={type === "withdrawal" ? "default" : "outline"}
          >
            Снятие
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="amount">Сумма</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <Label>Комиссия</Label>
        <div className="text-lg font-semibold">
          {fee > 0 ? `${fee.toLocaleString()} ₽` : "Без комиссии"}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isProcessing}>
        {isProcessing ? "Выполняется..." : "Выполнить"}
      </Button>
    </form>
  );
}
