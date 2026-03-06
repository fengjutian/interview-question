"use client";

import { useEffect, useState } from "react";

export default function CircuitsvisDemo() {
  const [Hello, setHello] = useState<any>(null);

  useEffect(() => {
    import("circuitsvis").then((mod) => {
      setHello(() => mod.Hello);
    });
  }, []);

  if (!Hello) {
    return <div>Loading...</div>;
  }

  return <Hello name="Bob" />;
}
