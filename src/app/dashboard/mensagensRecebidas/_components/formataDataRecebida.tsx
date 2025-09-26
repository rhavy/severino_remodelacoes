"use client"; // garantir que é Client Component

import { useEffect, useState } from "react";

export function DataRecebida({ data }: { data: string }) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    setFormatted(new Date(data).toLocaleString("pt-BR"));
  }, [data]);

  return <>{formatted}</>;
}
