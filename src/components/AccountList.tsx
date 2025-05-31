"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountForm from "@/components/ClientForm";
import TransactionForm from "./TransactionForm";

interface AccountListProps {
  accounts: Array<{
    id: number;
    accountNumber: string;
    openingDate: Date;
    balance: number;
    accountType: "CHECK" | "SAVINGS";
    checkAccount?: {
      accountType: "CREDIT" | "DEBIT";
    } | null;
  }>;
  clientId: number;
}

export default function AccountList({ accounts, clientId }: AccountListProps) {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );

  const handleOpenTransactionModal = (accountId: number) => {
    setSelectedAccountId(accountId);
    setIsTransactionModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Счета клиента</CardTitle>
            <Button onClick={() => setIsAccountModalOpen(true)}>
              Открыть новый счёт
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Номер счёта
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата открытия
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Баланс
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Счета отсутствуют
                    </td>
                  </tr>
                ) : (
                  accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {account.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {account.accountType === "CHECK" ? (
                          account.checkAccount?.accountType === "CREDIT" ? (
                            <span className="text-red-600">Кредитный</span>
                          ) : (
                            <span className="text-green-600">Дебитный</span>
                          )
                        ) : (
                          <span className="text-blue-600">Сберегательный</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(account.openingDate).toLocaleDateString()}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                          account.balance < 0 ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        {account.balance.toLocaleString()} ₽
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Открытие нового счёта</DialogTitle>
          </DialogHeader>
          <AccountForm
            clientId={clientId}
            onSuccess={() => window.location.reload()}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новая операция</DialogTitle>
          </DialogHeader>
          {selectedAccountId && (
            <TransactionForm
              accountId={selectedAccountId}
              clientId={clientId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
