import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientFormProps {
  clientId?: number;
  initialData?: any;
  onSuccess: (client: any) => void;
}

export default function ClientForm({
  clientId,
  initialData,
  onSuccess,
}: ClientFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      fullName: "",
      address: "",
      phone: "",
      birthDate: "",
      companyName: "",
      ceoName: "",
      accountantName: "",
      ownershipForm: "",
      password: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = clientId
      ? await fetch(`/api/clients/${clientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      : await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

    const result = await response.json();
    if (response.ok) {
      onSuccess(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>ФИО / Наименование</Label>
        <Input
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          required
        />
      </div>

      <Button type="submit">Сохранить</Button>
    </form>
  );
}
