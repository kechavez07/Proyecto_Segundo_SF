import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tournament } from "@/data/tournaments";
import { Users, User, ChevronRight } from "lucide-react";

interface TournamentCardProps {
  tournament: Tournament;
  onSelect: (tournament: Tournament) => void;
}

export const TournamentCard = ({ tournament, onSelect }: TournamentCardProps) => {
  const IconComponent = tournament.Icon;
  
  return (
    <Card 
      className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:shadow-[0_0_30px_hsl(175_80%_50%/0.2)] transition-all duration-500 cursor-pointer"
      onClick={() => onSelect(tournament)}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tournament.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
      
      <div className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tournament.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6 text-foreground" />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              {tournament.isTeamBased ? (
                <>
                  <Users className="w-3 h-3" />
                  <span>Equipo</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  <span>Individual</span>
                </>
              )}
            </div>
          </div>
          <CardTitle className="text-xl mt-3 group-hover:text-primary transition-colors duration-300">
            {tournament.name}
          </CardTitle>
          <CardDescription className="text-sm">
            {tournament.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {tournament.isTeamBased ? (
                <span>{tournament.maxPlayers} jugadores + {tournament.maxSubs} suplentes</span>
              ) : (
                <span>Participación individual</span>
              )}
            </div>
            <Button 
              variant="neon" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
            >
              Inscribirse
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
