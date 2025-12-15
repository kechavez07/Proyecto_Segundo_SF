import { Sword, Dices, Target, Crown, Castle, LucideIcon } from "lucide-react";

export interface Tournament {
  id: string;
  name: string;
  game: string;
  Icon: LucideIcon;
  isTeamBased: boolean;
  maxPlayers: number;
  maxSubs: number;
  color: string;
  description: string;
}

export const tournaments: Tournament[] = [
  {
    id: "lol",
    name: "League of Legends",
    game: "lol",
    Icon: Sword,
    isTeamBased: true,
    maxPlayers: 5,
    maxSubs: 2,
    color: "from-amber-500 to-yellow-600",
    description: "Forma tu equipo de 5 jugadores y 2 suplentes para competir en la Grieta del Invocador",
  },
  {
    id: "tft",
    name: "Teamfight Tactics",
    game: "tft",
    Icon: Dices,
    isTeamBased: true,
    maxPlayers: 5,
    maxSubs: 2,
    color: "from-purple-500 to-pink-600",
    description: "Reúne a tu escuadrón de estrategas para dominar el campo de batalla",
  },
  {
    id: "valorant",
    name: "Valorant",
    game: "valorant",
    Icon: Target,
    isTeamBased: true,
    maxPlayers: 5,
    maxSubs: 2,
    color: "from-red-500 to-rose-600",
    description: "5 agentes + 2 suplentes listos para tomar el punto",
  },
  {
    id: "chess",
    name: "Ajedrez",
    game: "chess",
    Icon: Castle,
    isTeamBased: false,
    maxPlayers: 1,
    maxSubs: 0,
    color: "from-slate-400 to-zinc-600",
    description: "Demuestra tu maestría en el juego de la estrategia por excelencia",
  },
  {
    id: "clashroyale",
    name: "Clash Royale",
    game: "clashroyale",
    Icon: Crown,
    isTeamBased: false,
    maxPlayers: 1,
    maxSubs: 0,
    color: "from-blue-500 to-cyan-500",
    description: "Despliega tus tropas y destruye las torres enemigas",
  },
];
