"use client"
import Maze from "@/components/Maze";
import {Sidebar} from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [observations, setObservations] = useState([] as string[])
  return (
    <main className="flex flex-row min-h-screen items-center justify-between ">
      <Sidebar children={"aaa"} observations={observations} setObservations={setObservations}/>
      <section className="p-12">
      <Maze observations={observations} setObservations={setObservations}/>
      </section>
    </main>
  );
}
