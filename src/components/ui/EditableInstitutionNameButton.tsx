"use client";

import { useState } from "react";
import { useUniversityName } from "@/context/UniversityNameContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function EditableInstitutionNameButton() {
  const { universityName, setUniversityName, resetUniversityName } = useUniversityName();
  const [open, setOpen] = useState(false);
  const [tempName, setTempName] = useState(universityName);

  const handleSave = () => {
    const nameToSave = tempName.trim() === "" ? "Consortium Universitas" : tempName;
    setUniversityName(nameToSave);
    setOpen(false);
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full font-bold text-white"
        style={{ backgroundColor: "#0f6d45" }} // Verde elegante
        onClick={() => {
          setTempName(universityName);
          setOpen(true);
        }}
      >
        Cambiar nombre institución
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Modificar nombre de la institución</DialogTitle>
          </DialogHeader>

          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Escribe el nuevo nombre…"
            className="mt-4"
          />

          <div className="flex justify-between mt-6">
            <Button variant="secondary" onClick={resetUniversityName}>
              Restablecer por defecto
            </Button>

            <Button className="bg-blue-700 text-white" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
