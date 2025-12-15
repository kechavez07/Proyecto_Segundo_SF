import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tournament } from "@/data/tournaments";
import { ArrowLeft, Upload, Check, X, UserPlus, Users, Crown } from "lucide-react";
import { toast } from "sonner";

interface RegistrationFormProps {
  tournament: Tournament;
  onBack: () => void;
}

interface TeamMember {
  name: string;
  gamertag: string;
  isSub: boolean;
}

export const RegistrationForm = ({ tournament, onBack }: RegistrationFormProps) => {
  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [captainGamertag, setCaptainGamertag] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerGamertag, setPlayerGamertag] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [voucher, setVoucher] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const IconComponent = tournament.Icon;

  const handleAddMember = (isSub: boolean) => {
    const currentPlayers = teamMembers.filter(m => !m.isSub).length;
    const currentSubs = teamMembers.filter(m => m.isSub).length;

    if (!isSub && currentPlayers >= tournament.maxPlayers - 1) {
      toast.error(`Ya tienes el máximo de ${tournament.maxPlayers} jugadores (incluyendo capitán)`);
      return;
    }

    if (isSub && currentSubs >= tournament.maxSubs) {
      toast.error(`Ya tienes el máximo de ${tournament.maxSubs} suplentes`);
      return;
    }

    setTeamMembers([...teamMembers, { name: "", gamertag: "", isSub }]);
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo no puede superar 5MB");
        return;
      }
      setVoucher(file);
      toast.success("Comprobante cargado correctamente");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("¡Inscripción enviada correctamente!", {
      description: `Te has inscrito al torneo de ${tournament.name}`,
    });

    setIsSubmitting(false);
    onBack();
  };

  const currentPlayers = teamMembers.filter(m => !m.isSub).length + 1; // +1 for captain
  const currentSubs = teamMembers.filter(m => m.isSub).length;

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a torneos
      </Button>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tournament.color} flex items-center justify-center`}>
              <IconComponent className="w-8 h-8 text-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">{tournament.name}</CardTitle>
              <CardDescription>
                {tournament.isTeamBased 
                  ? `Registro de equipo (${tournament.maxPlayers} jugadores + ${tournament.maxSubs} suplentes)`
                  : "Registro individual"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {tournament.isTeamBased ? (
              <>
                {/* Team Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-display font-bold text-primary flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Información del Equipo
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="teamName">Nombre del Equipo *</Label>
                      <Input
                        id="teamName"
                        placeholder="Ej: Los Invencibles"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Captain Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-display font-bold text-secondary flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Capitán del Equipo
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="captainName">Nombre Completo *</Label>
                      <Input
                        id="captainName"
                        placeholder="Tu nombre"
                        value={captainName}
                        onChange={(e) => setCaptainName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="captainGamertag">Gamertag / ID *</Label>
                      <Input
                        id="captainGamertag"
                        placeholder="Tu nombre en el juego"
                        value={captainGamertag}
                        onChange={(e) => setCaptainGamertag(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="captainEmail">Email *</Label>
                      <Input
                        id="captainEmail"
                        type="email"
                        placeholder="tu@email.com"
                        value={captainEmail}
                        onChange={(e) => setCaptainEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="captainPhone">Teléfono *</Label>
                      <Input
                        id="captainPhone"
                        type="tel"
                        placeholder="+52 123 456 7890"
                        value={captainPhone}
                        onChange={(e) => setCaptainPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg font-display font-bold text-accent flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Miembros del Equipo
                    </h3>
                    <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      {currentPlayers}/{tournament.maxPlayers} jugadores · {currentSubs}/{tournament.maxSubs} suplentes
                    </div>
                  </div>

                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${member.isSub ? 'border-secondary/50 bg-secondary/5' : 'border-primary/50 bg-primary/5'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-sm font-semibold ${member.isSub ? 'text-secondary' : 'text-primary'}`}>
                            {member.isSub ? `Suplente ${teamMembers.filter((m, i) => m.isSub && i <= index).length}` : `Jugador ${teamMembers.filter((m, i) => !m.isSub && i <= index).length + 1}`}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(index)}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Nombre *</Label>
                            <Input
                              placeholder="Nombre del jugador"
                              value={member.name}
                              onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Gamertag / ID *</Label>
                            <Input
                              placeholder="Nombre en el juego"
                              value={member.gamertag}
                              onChange={(e) => handleMemberChange(index, 'gamertag', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddMember(false)}
                      disabled={currentPlayers >= tournament.maxPlayers}
                      className="flex-1 min-w-[200px]"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Añadir Jugador ({currentPlayers}/{tournament.maxPlayers})
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleAddMember(true)}
                      disabled={currentSubs >= tournament.maxSubs}
                      className="flex-1 min-w-[200px]"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Añadir Suplente ({currentSubs}/{tournament.maxSubs})
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Individual Registration */
              <div className="space-y-4">
                <h3 className="text-lg font-display font-bold text-primary flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Datos del Participante
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="playerName">Nombre Completo *</Label>
                    <Input
                      id="playerName"
                      placeholder="Tu nombre"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playerGamertag">
                      {tournament.id === 'chess' ? 'Usuario Chess.com / Lichess *' : 'ID de Supercell *'}
                    </Label>
                    <Input
                      id="playerGamertag"
                      placeholder="Tu nombre en el juego"
                      value={playerGamertag}
                      onChange={(e) => setPlayerGamertag(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playerEmail">Email *</Label>
                    <Input
                      id="playerEmail"
                      type="email"
                      placeholder="tu@email.com"
                      value={playerEmail}
                      onChange={(e) => setPlayerEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playerPhone">Teléfono *</Label>
                    <Input
                      id="playerPhone"
                      type="tel"
                      placeholder="+52 123 456 7890"
                      value={playerPhone}
                      onChange={(e) => setPlayerPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Voucher Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold text-primary flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Comprobante de Pago
              </h3>
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  voucher 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {voucher ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-semibold text-primary">{voucher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Click para cambiar archivo
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="font-semibold">Subir comprobante de inscripción *</p>
                    <p className="text-sm text-muted-foreground">
                      Arrastra o haz click para seleccionar (máx. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-border/50">
              <Button 
                type="submit" 
                variant="gaming" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting || !voucher}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Enviando inscripción...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Confirmar Inscripción
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
