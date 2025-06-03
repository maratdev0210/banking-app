"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: "CHECK" | "SAVINGS";
  client: {
    id: number;
    clientType: "PHYSICAL" | "LEGAL";
    physical?: {
      firstName: string;
      lastName: string;
    };
    legal?: {
      companyName: string;
    };
  };
  checkAccount?: {
    accountType: "DEBIT" | "CREDIT";
  };
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filtered, setFiltered] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/accounts?withClients=true")
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(accounts);
      return;
    }
    const term = search.toLowerCase();
    setFiltered(
      accounts.filter((acc) => {
        const name =
          acc.client.clientType === "PHYSICAL"
            ? `${acc.client.physical?.lastName} ${acc.client.physical?.firstName}`
            : (acc.client.legal?.companyName ?? "");
        return name.toLowerCase().includes(term);
      })
    );
  }, [search, accounts]);

  return (
    <div className="flex max-w-7xl mx-auto p-6 gap-6">
      <div className="w-64 space-y-4 border rounded-md p-4 h-fit">
        <h2 className="text-lg font-semibold">Фильтр</h2>
        <Input
          placeholder="Поиск по клиенту"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold">Счета клиентов</h1>
        <ScrollArea className="h-[75vh] rounded-md border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded" />
                ))
              : filtered.map((acc) => {
                  const fullName =
                    acc.client.clientType === "PHYSICAL"
                      ? `${acc.client.physical?.lastName} ${acc.client.physical?.firstName}`
                      : acc.client.legal?.companyName;

                  return (
                    <Card key={acc.id} className="relative">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Счёт:{" "}
                          <span className="font-mono">{acc.accountNumber}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-muted-foreground">
                          Владелец:{" "}
                          <span className="font-medium">{fullName}</span>
                        </p>
                        <p>
                          Баланс:{" "}
                          <span className="font-bold text-green-700">
                            {acc.balance.toLocaleString()} ₽
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            Тип:{" "}
                            {acc.accountType === "CHECK"
                              ? "Чековый"
                              : "Сберегательный"}
                          </Badge>
                          {acc.accountType === "CHECK" && acc.checkAccount && (
                            <Badge variant="secondary">
                              {acc.checkAccount.accountType === "CREDIT"
                                ? "Кредитный"
                                : "Дебетовый"}
                            </Badge>
                          )}
                          <Badge variant="secondary">ID: {acc.id}</Badge>
                        </div>
                        <Button
                          variant="outline"
                          className="mt-3"
                          onClick={() =>
                            router.push(`/cashier/accounts/${acc.id}`)
                          }
                        >
                          Подробнее
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
