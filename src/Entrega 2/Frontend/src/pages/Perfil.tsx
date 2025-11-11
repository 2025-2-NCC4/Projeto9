import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Briefcase, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/services/auth";

const colorThemes = [
  { name: "Azul Corporativo", value: "blue", primary: "217 91% 35%", description: "Tema profissional padrão" },
  { name: "Verde Sucesso", value: "green", primary: "142 71% 45%", description: "Tema focado em crescimento" },
  { name: "Roxo Inovação", value: "purple", primary: "280 65% 60%", description: "Tema moderno e criativo" },
  { name: "Laranja Energia", value: "orange", primary: "38 92% 50%", description: "Tema vibrante e dinâmico" },
];

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("colorTheme") || "blue"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setName(user?.nome || user?.name || "");
      setEmail(user?.email || "");
      setRole(user?.cargo || user?.role || "");
    }
  }, [user]);

  const handleColorChange = (colorValue: string) => {
    setSelectedColor(colorValue);
    localStorage.setItem("colorTheme", colorValue);
    
    const colorTheme = colorThemes.find(c => c.value === colorValue);
    if (colorTheme) {
      document.documentElement.style.setProperty('--primary', colorTheme.primary);
      
      toast({
        title: "Tema atualizado",
        description: `Tema ${colorTheme.name} aplicado com sucesso.`,
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!name) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await authService.updateProfile({ name });
      updateUser(); // Update context with new user data
      toast({
        title: "Alterações salvas",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.msg || error.response?.data?.message || "Erro ao salvar alterações.";
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const mockUserData = {
    name: name,
    email: email,
    role: role,
    initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || "RS",
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold">Perfil do Usuário</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas informações e preferências
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">Informações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-8">
              <div className="flex items-start gap-6 mb-8">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {mockUserData.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-1">{mockUserData.name}</h2>
                  <p className="text-muted-foreground mb-3">{mockUserData.email}</p>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {mockUserData.role}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled={true}
                    className="h-11 opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">O email não pode ser alterado no momento</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Cargo
                  </Label>
                  <Input
                    id="role"
                    value={role}
                    disabled={true}
                    className="h-11 opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">O cargo só pode ser alterado pela sua organização</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setName(user?.nome || user?.name || "");
                      setEmail(user?.email || "");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Modo de Exibição
                </h3>
                <p className="text-sm text-muted-foreground">
                  Escolha entre modo claro ou escuro
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="w-full h-24 bg-background border border-border rounded mb-3"></div>
                  <p className="font-medium">Modo Claro</p>
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="w-full h-24 bg-gray-900 border border-gray-700 rounded mb-3"></div>
                  <p className="font-medium">Modo Escuro</p>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Tema de Cores</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Personalize a cor principal da interface
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {colorThemes.map((colorTheme) => (
                  <button
                    key={colorTheme.value}
                    onClick={() => handleColorChange(colorTheme.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedColor === colorTheme.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: `hsl(${colorTheme.primary})` }}
                      ></div>
                      <div>
                        <p className="font-semibold">{colorTheme.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {colorTheme.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}