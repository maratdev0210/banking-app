"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AccountDetails {
  id: number;
  accountNumber: string;
  balance: number;
  openedAt: string;
  accountType: "CHECK" | "SAVINGS";
  client: {
    id: number;
    clientType: "PHYSICAL" | "LEGAL";
    physical?: {
      firstName: string;
      lastName: string;
      isDebtor: boolean;
    };
    legal?: {
      companyName: string;
    };
  };
  checkAccount?: {
    accountType: "DEBIT" | "CREDIT";
  };
}

export default function AccountDetailPage() {
  const { id } = useParams();
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/accounts/${id}`)
      .then((res) => res.json())
      .then(setAccount)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Skeleton className="h-40 w-full mt-10" />;
  if (!account) return <p className="text-red-500 p-4">Счёт не найден</p>;

  const clientName =
    account.client.clientType === "PHYSICAL"
      ? `${account.client.physical?.lastName} ${account.client.physical?.firstName}`
      : account.client.legal?.companyName;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Детали счёта</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Номер счёта:{" "}
            <span className="font-mono">{account.accountNumber}</span>
          </p>
          <p>Открыт: {new Date(account.openedAt).toLocaleDateString()}</p>
          <p>
            Баланс:{" "}
            <span className="font-bold text-green-700">
              {account.balance.toLocaleString()} ₽
            </span>
          </p>
          <p>
            Тип счёта:{" "}
            {account.accountType === "CHECK" ? "Чековый" : "Сберегательный"}
          </p>
          {account.accountType === "CHECK" && account.checkAccount && (
            <p>
              Подтип:{" "}
              {account.checkAccount.accountType === "CREDIT"
                ? "Кредитный"
                : "Дебетовый"}
            </p>
          )}
          <hr />
          <p className="text-muted-foreground">
            Клиент: <span className="font-medium">{clientName}</span>
          </p>
          {account.client.clientType === "PHYSICAL" && (
            <p>
              Статус:{" "}
              {account.client.physical?.isDebtor ? (
                <Badge variant="destructive">Должник</Badge>
              ) : (
                <Badge>Нет долгов</Badge>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
