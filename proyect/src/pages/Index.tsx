import { useState } from "react";
import { Hero } from "@/components/Hero";
import { TournamentCard } from "@/components/TournamentCard";
import { RegistrationForm } from "@/components/RegistrationForm";
import { tournaments, Tournament } from "@/data/tournaments";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  return (
    <>
      <Helmet>
        <title>Gaming Arena - Torneos de Esports 2025</title>
        <meta name="description" content="Inscríbete en los mejores torneos de esports: League of Legends, Valorant, TFT, Ajedrez y Clash Royale. Compite y gana premios." />
      </Helmet>

      <main className="min-h-screen">
        {!selectedTournament ? (
          <>
            <Hero />
            
            <section className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  <span className="text-foreground">Elige tu </span>
                  <span className="text-primary">Torneo</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Selecciona el torneo en el que deseas participar y completa tu inscripción
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tournaments.map((tournament, index) => (
                  <div
                    key={tournament.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TournamentCard
                      tournament={tournament}
                      onSelect={setSelectedTournament}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/50 py-8">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>© 2025 Gaming Arena. Todos los derechos reservados.</p>
              </div>
            </footer>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <RegistrationForm
              tournament={selectedTournament}
              onBack={() => setSelectedTournament(null)}
            />
          </div>
        )}
      </main>
    </>
  );
};

export default Index;
