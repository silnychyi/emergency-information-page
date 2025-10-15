"use client";

import Contact from "@/components/Contact";
import Form from "@/components/Form";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const hasData = searchParams.get("data");

  return hasData ? <Contact /> : <Form />;
}
