import type { Metadata } from "next";
import { Plans } from "@/sections/Plans";

export const metadata: Metadata = {
  title: "Paketler",
  description:
    "Rafik Al Haram paketlerini inceleyin: standart özellikler katılan hacı başına 3 dolar, çeviri ve telekonferans özellikleri katılan hacı başına 5 dolar."
};

export default function PlansPage() {
  return <Plans />;
}
