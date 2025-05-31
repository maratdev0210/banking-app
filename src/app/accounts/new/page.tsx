"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface Client {
  id: number;
  fullName: string;
  type: "PHYSICAL" | "LEGAL";
  isDebtor: boolean;
}

export default function OpenAccountForm() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    ownerId: 0,
    accountType: "CHECK",
    checkType: "DEBIT",
    creditLimit: 0,
    openingDate: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDebtor, setIsDebtor] = useState(false);

 
  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        if (data.length > 0) {
          setFormData({ ...formData, ownerId: data[0].id });
        }
      });
  }, []);


  useEffect(() => {
    if (formData.ownerId && clients.length > 0) {
      const selectedClient = clients.find((c) => c.id === formData.ownerId);
      if (selectedClient?.isDebtor) {
        setIsDebtor(true);
        toast.warning("Клиент является должником");
      } else {
        setIsDebtor(false);
      }
    }
  }, [formData.ownerId, clients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Счет успешно открыт");
        router.push(`/accounts/${result.id}`);
      } else {
        toast.error(result.message || "Ошибка открытия счета");
      }
    } catch (error) {
      toast.error("Произошла сетевая ошибка");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData({ ...formData, accountType: type });
    if (type !== "CHECK") {
      setFormData({ ...formData, accountType: type, checkType: undefined });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Открытие банковского счета</CardTitle>
          <CardDescription>
            Заполните форму для открытия нового счета
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
           
            <div className="space-y-2">
              <Label htmlFor="ownerId">Клиент</Label>
              <Select
                value={formData.ownerId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, ownerId: Number(value) })
                }
              >
                <SelectTrigger id="ownerId">
                  <SelectValue placeholder="Выберите клиента" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.fullName} (
                      {client.type === "PHYSICAL"
                        ? "Физическое лицо"
                        : "Юридическое лицо"}
                      ){client.isDebtor && " - Должник"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isDebtor && (
                <p className="text-sm text-yellow-600">
                  Клиент является должником
                </p>
              )}
            </div>

         
            <div className="space-y-2">
              <Label>Тип счета</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={
                    formData.accountType === "CHECK" ? "default" : "outline"
                  }
                  onClick={() => handleTypeChange("CHECK")}
                >
                  Чековый
                </Button>
                <Button
                  type="button"
                  variant={
                    formData.accountType === "SAVINGS" ? "default" : "outline"
                  }
                  onClick={() => handleTypeChange("SAVINGS")}
                >
                  Сберегательный
                </Button>
              </div>
            </div>

         
            {formData.accountType === "CHECK" && (
              <div className="space-y-2">
                <Label htmlFor="checkType">Подтип счета</Label>
                <Select
                  value={formData.checkType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, checkType: value })
                  }
                >
                  <SelectTrigger id="checkType">
                    <SelectValue placeholder="Выберите подтип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEBIT">Дебитный</SelectItem>
                    <SelectItem value="CREDIT">Кредитный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

           
            {formData.accountType === "CHECK" &&
              formData.checkType === "CREDIT" && (
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Лимит кредита</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.creditLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creditLimit: Number(e.target.value),
                      })
                    }
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Максимальная сумма, которую может иметь клиент
                  </p>
                </div>
              )}

          
            <div className="space-y-2">
              <Label htmlFor="openingDate">Дата открытия</Label>
              <Input
                id="openingDate"
                type="date"
                value={formData.openingDate}
                onChange={(e) =>
                  setFormData({ ...formData, openingDate: e.target.value })
                }
                required
              />
            </div>

         
            <div className="space-y-2 bg-muted p-4 rounded-md">
              <Label>Номер счета</Label>
              <div className="text-lg font-mono p-2 bg-background rounded">
                {formData.accountType === "CHECKING" ? "101-" : "102-"}XXX
              </div>
              <p className="text-sm text-muted-foreground">
                Номер будет сгенерирован автоматически
              </p>
            </div>

            {isDebtor &&
              formData.accountType === "CHECK" &&
              formData.checkType === "CREDIT" && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-700">
                    Внимание: Клиент уже имеет задолженность. Продолжить
                    открытие кредитного счета?
                  </p>
                </div>
              )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Открытие счета..." : "Открыть счет"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
