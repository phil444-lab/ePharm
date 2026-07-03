import { useState } from "react";
import {
  Search, MapPin, ShoppingCart, Menu, X, Phone, Pill,
  Clock, ChevronRight, Star, Navigation, Package,
  MessageCircle, Truck, Store, Filter, Plus, Minus,
  CheckCircle, ArrowRight, ChevronDown, Heart, Shield,
  Zap, Users, Globe, Bell, LogIn
} from "lucide-react";

type Page = "home" | "search" | "pharmacies" | "login" | "order";

interface Medicine {
  id: number;
  name: string;
  category: string;
  price: number;
  dosage: string;
  stock: number;
  rating: number;
  pharmacy: string;
  image: string;
  description: string;
  pharmacies: PharmacyStock[];
}

interface PharmacyStock {
  name: string;
  distance: string;
  address: string;
  price: number;
  stock: number;
  open: boolean;
}

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  distance: string;
  open: boolean;
  rating: number;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

interface CartItem {
  medicine: Medicine;
  pharmacy: string;
  quantity: number;
  price: number;
}

const MEDICINES: Medicine[] = [
  {
    id: 1, name: "Paracétamol 500mg", category: "Analgésiques", price: 850, dosage: "1–2 comprimés toutes les 4–6h, max 8/jour",
    stock: 142, rating: 4.8, pharmacy: "Pharmacie Centrale", image: "photo-1584308666744-24d5c474f2ae",
    description: "Antalgique et antipyrétique, soulage les douleurs légères à modérées et la fièvre.",
    pharmacies: [
      { name: "Pharmacie Centrale", distance: "0.3 km", address: "12 Rue du Commerce, Abidjan", price: 850, stock: 142, open: true },
      { name: "Pharmacie du Plateau", distance: "1.2 km", address: "45 Bd de la République", price: 900, stock: 88, open: true },
      { name: "Pharmacie Treichville", distance: "2.1 km", address: "8 Av. du Général de Gaulle", price: 820, stock: 35, open: false },
    ]
  },
  {
    id: 2, name: "Aspirine 100mg", category: "Analgésiques", price: 650, dosage: "1 comprimé par jour, après repas",
    stock: 89, rating: 4.6, pharmacy: "Pharmacie du Plateau", image: "photo-1550572017-edd951b55104",
    description: "Antiagrégant plaquettaire, utilisé en prévention cardiovasculaire et contre la douleur.",
    pharmacies: [
      { name: "Pharmacie du Plateau", distance: "1.2 km", address: "45 Bd de la République", price: 650, stock: 89, open: true },
      { name: "Pharmacie Centrale", distance: "0.3 km", address: "12 Rue du Commerce, Abidjan", price: 700, stock: 210, open: true },
    ]
  },
  {
    id: 3, name: "Amoxicilline 500mg", category: "Antibiotiques", price: 2400, dosage: "1 gélule 3x/jour pendant 7 jours",
    stock: 56, rating: 4.9, pharmacy: "Pharmacie Cocody", image: "photo-1587854692152-cbe660dbde88",
    description: "Antibiotique à large spectre pour infections bactériennes ORL, pulmonaires et urinaires.",
    pharmacies: [
      { name: "Pharmacie Cocody", distance: "1.8 km", address: "23 Av. Christiani, Cocody", price: 2400, stock: 56, open: true },
      { name: "Pharmacie Centrale", distance: "0.3 km", address: "12 Rue du Commerce", price: 2600, stock: 12, open: true },
    ]
  },
  {
    id: 4, name: "Métronidazole 250mg", category: "Antibiotiques", price: 1200, dosage: "1 comprimé 3x/jour pendant 5–10 jours",
    stock: 78, rating: 4.5, pharmacy: "Pharmacie Adjamé", image: "photo-1559757175-0eb30cd8c063",
    description: "Antiparasitaire et antibiotique anaérobie pour infections digestives et génitales.",
    pharmacies: [
      { name: "Pharmacie Adjamé", distance: "2.5 km", address: "Place de la Paix, Adjamé", price: 1200, stock: 78, open: true },
      { name: "Pharmacie du Plateau", distance: "1.2 km", address: "45 Bd de la République", price: 1350, stock: 44, open: true },
    ]
  },
  {
    id: 5, name: "Ibuprofène 400mg", category: "Anti-inflammatoires", price: 1100, dosage: "1 comprimé 3x/jour, avec repas",
    stock: 95, rating: 4.7, pharmacy: "Pharmacie Centrale", image: "photo-1471864190281-a93a3070b6de",
    description: "Anti-inflammatoire non stéroïdien pour douleurs, fièvre et inflammations.",
    pharmacies: [
      { name: "Pharmacie Centrale", distance: "0.3 km", address: "12 Rue du Commerce", price: 1100, stock: 95, open: true },
      { name: "Pharmacie Cocody", distance: "1.8 km", address: "23 Av. Christiani, Cocody", price: 1050, stock: 32, open: false },
    ]
  },
  {
    id: 6, name: "Loratadine 10mg", category: "Antihistaminiques", price: 950, dosage: "1 comprimé par jour",
    stock: 67, rating: 4.4, pharmacy: "Pharmacie Treichville", image: "photo-1576091160399-112ba8d25d1d",
    description: "Antihistaminique de 2e génération pour rhinite allergique et urticaire.",
    pharmacies: [
      { name: "Pharmacie Treichville", distance: "2.1 km", address: "8 Av. du Général de Gaulle", price: 950, stock: 67, open: true },
      { name: "Pharmacie Adjamé", distance: "2.5 km", address: "Place de la Paix", price: 900, stock: 22, open: true },
    ]
  },
];

const PHARMACIES: Pharmacy[] = [
  { id: 1, name: "Pharmacie Sainte Rita", address: "Av. Sainte Rita, Cotonou", distance: "0.3 km", open: true, rating: 4.9, phone: "+229 97 11 11 11", hours: "07h00 – 22h00", lat: 6.3703, lng: 2.3912 },
  { id: 2, name: "Pharmacie Akpakpa", address: "Bd de l'Océan, Akpakpa, Cotonou", distance: "1.2 km", open: true, rating: 4.7, phone: "+229 97 22 22 22", hours: "08h00 – 21h00", lat: 6.3601, lng: 2.4102 },
  { id: 3, name: "Pharmacie Fidjrossè", address: "Route de Fidjrossè, Cotonou", distance: "1.8 km", open: true, rating: 4.8, phone: "+229 97 33 33 33", hours: "07h30 – 22h30", lat: 6.3812, lng: 2.3654 },
  { id: 4, name: "Pharmacie Cadjehoun", address: "Quartier Cadjehoun, Cotonou", distance: "2.1 km", open: false, rating: 4.5, phone: "+229 97 44 44 44", hours: "08h00 – 20h00", lat: 6.3698, lng: 2.3801 },
  { id: 5, name: "Pharmacie Gbégamey", address: "Rue de Gbégamey, Cotonou", distance: "2.5 km", open: true, rating: 4.6, phone: "+229 97 55 55 55", hours: "24h/24, 7j/7", lat: 6.3745, lng: 2.3723 },
  { id: 6, name: "Pharmacie du Lac", address: "Quartier du Lac, Cotonou", distance: "3.4 km", open: false, rating: 4.3, phone: "+229 97 66 66 66", hours: "08h30 – 21h30", lat: 6.3654, lng: 2.4201 },
];

const CATEGORIES = ["Tous", "Analgésiques", "Antibiotiques", "Anti-inflammatoires", "Antihistaminiques", "Vitamines", "Antipaludéens"];

const PARTNERS: { name: string; image: string | null }[] = [
  { name: "Pharmacie Sainte Rita", image: "/src/assets/pharmacie1.jpg" },
  { name: "PharmaBénin", image: null },
  { name: "MedPlus BJ", image: null },
  { name: "SantéPlus", image: null },
  { name: "AfriPharma", image: null },
  { name: "HealthLink BJ", image: null },
];

function formatPrice(price: number) {
  return `${price.toLocaleString("fr-FR")} FCFA`;
}

// ─── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, cartCount }: { page: Page; setPage: (p: Page) => void; cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links: { label: string; page: Page }[] = [
    { label: "Accueil", page: "home" },
    { label: "Rechercher", page: "search" },
    { label: "Pharmacies", page: "pharmacies" },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => setPage("home")} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              e<span className="text-primary">Pharm</span>
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <button
                key={l.page}
                onClick={() => setPage(l.page)}
                className={`text-sm font-medium transition-colors ${page === l.page ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                if (page === "home") {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  setPage("home");
                  setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100);
                }
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contactez-nous
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage("order")}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setPage("login")}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Se connecter
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-muted-foreground"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-border">
            {links.map(l => (
              <button
                key={l.page}
                onClick={() => { setPage(l.page); setMenuOpen(false); }}
                className={`block w-full text-left px-2 py-3 text-sm font-medium ${page === l.page ? "text-primary" : "text-muted-foreground"}`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => { setPage("login"); setMenuOpen(false); }}
              className="block w-full text-left px-2 py-3 text-sm font-medium text-muted-foreground"
            >
              Se connecter
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Chatbot Bubble ──────────────────────────────────────────────────────────
function ChatbotButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Assistant IA</p>
                <p className="text-white/70 text-xs">En ligne</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-secondary rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
              <p className="text-sm text-foreground">Bonjour ! Je suis votre assistant santé. Comment puis-je vous aider aujourd&apos;hui ?</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Trouver un médicament", "Pharmacie ouverte", "Mon ordonnance"].map(s => (
                <button key={s} className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-secondary transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <input
              placeholder="Décrivez vos symptômes..."
              className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer id="contact" className="bg-foreground text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">e<span className="text-primary">Pharm</span></span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              La plateforme de référence pour localiser vos médicaments dans les pharmacies agréées près de chez vous.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {["facebook", "twitter", "instagram"].map(s => (
                <div key={s} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary/80 transition-colors flex items-center justify-center cursor-pointer">
                  <Globe className="w-4 h-4 text-white/70" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-4">Navigation</p>
            {[
              { label: "Accueil", p: "home" as Page },
              { label: "Rechercher", p: "search" as Page },
              { label: "Pharmacies", p: "pharmacies" as Page },
            ].map(l => (
              <button key={l.label} onClick={() => setPage(l.p)} className="block text-sm text-white/60 hover:text-white mb-2.5 transition-colors">
                {l.label}
              </button>
            ))}
          </div>
          <div>
            <p className="font-semibold mb-4">Contact</p>
            <p className="text-sm text-white/60 mb-2.5">📞 +229 97 00 00 00</p>
            <p className="text-sm text-white/60 mb-2.5">✉ contact@epharm.bj</p>
            <p className="text-sm text-white/60">📍 Cotonou, Bénin</p>
            <div className="mt-5 inline-flex items-center gap-1.5 bg-primary/20 text-primary text-xs px-3 py-1.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              Certifié Ministère de la Santé
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/40">© 2024 ePharm BJ. Tous droits réservés.</p>
          <div className="flex gap-5 text-sm text-white/40">
            <span className="hover:text-white/70 cursor-pointer">Confidentialité</span>
            <span className="hover:text-white/70 cursor-pointer">Conditions d&apos;utilisation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page Accueil ────────────────────────────────────────────────────────────
function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const [searchValue, setSearchValue] = useState("");
  const features = [
    { icon: Search, title: "Recherche instantanée", desc: "Trouvez n'importe quel médicament parmi des milliers de références en quelques secondes.", color: "bg-green-50 text-primary" },
    { icon: Package, title: "Commande en ligne", desc: "Réservez vos médicaments et payez en toute sécurité via Mobile Money.", color: "bg-orange-50 text-accent" },
    { icon: MapPin, title: "Géolocalisation", desc: "Localisez les pharmacies agréées ouvertes autour de vous en temps réel.", color: "bg-blue-50 text-blue-600" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #00A86B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FF5F1F 0%, transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Zap className="w-3.5 h-3.5" />
                Disponible 24h/24, 7j/7
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 sm:mb-5">
                Vos médicaments,
                <span className="block text-primary">livrés ou disponibles</span>
                près de chez vous.
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Localisez vos médicaments en temps réel dans les pharmacies agréées du Bénin. Commandez, payez, récupérez.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-border px-4 py-3 shadow-sm">
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <input
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder="Nom du médicament, pathologie..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    onKeyDown={e => e.key === "Enter" && setPage("search")}
                  />
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
                <button
                  onClick={() => setPage("search")}
                  className="px-5 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent/90 transition-colors whitespace-nowrap shadow-sm"
                >
                  Rechercher
                </button>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {[["200+", "Pharmacies"], ["50k+", "Médicaments"], ["98%", "Satisfaction"]].map(([val, lab]) => (
                  <div key={lab}>
                    <p className="text-2xl font-bold text-foreground">{val}</p>
                    <p className="text-xs text-muted-foreground">{lab}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=500&fit=crop&auto=format"
                  alt="Pharmacien professionnel"
                  className="rounded-2xl w-full object-cover shadow-xl"
                />
                {/* Floating cards */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg border border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Dernière commande</p>
                    <p className="text-sm font-semibold">Paracétamol 500mg</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg border border-border">
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-xs font-medium">4.9 — Excellent service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Nos services</p>
            <h2 className="text-3xl font-bold text-foreground">Tout ce dont vous avez besoin</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">Une plateforme complète pour gérer votre santé au quotidien.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-background rounded-2xl p-8 hover:shadow-md transition-shadow border border-border group">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <button onClick={() => setPage("search")} className="mt-5 text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  En savoir plus <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Comment ça marche</p>
            <h2 className="text-3xl font-bold text-foreground">En 3 étapes simples</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Recherchez", desc: "Tapez le nom de votre médicament ou décrivez vos symptômes à notre IA.", icon: Search },
              { n: "02", title: "Choisissez", desc: "Sélectionnez la pharmacie la plus proche avec le meilleur prix disponible.", icon: MapPin },
              { n: "03", title: "Récupérez", desc: "Retirez en pharmacie ou faites-vous livrer, payez via Mobile Money.", icon: Truck },
            ].map((s, i) => (
              <div key={s.n} className="text-center relative">
                {i < 2 && <div className="hidden md:block absolute top-6 left-3/4 w-1/2 border-t-2 border-dashed border-primary/20" />}
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-primary/20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{s.n}</span>
                <h3 className="font-bold text-foreground mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-14 bg-white border-t border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
            Nos pharmacies partenaires
          </p>
          <style>{`@keyframes carousel { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
          <div className="overflow-hidden">
            <div
              className="flex gap-6"
              style={{ animation: "carousel 18s linear infinite", width: "max-content" }}
            >
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <div key={i} className="w-48 flex-shrink-0 bg-background rounded-2xl border border-border hover:border-primary/30 transition-colors overflow-hidden">
                  <div className="w-full aspect-[5/3] bg-muted flex items-center justify-center overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Pill className="w-8 h-8 text-primary/30" />
                    )}
                  </div>
                  <div className="px-3 py-2.5">
                    <span className="text-sm font-medium text-muted-foreground">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Votre santé, notre priorité</h2>
          <p className="text-white/80 mb-8 leading-relaxed">Rejoignez des milliers de familles qui font confiance à ePharm pour leurs besoins médicaux quotidiens.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setPage("search")} className="px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors">
              Rechercher un médicament
            </button>
            <button onClick={() => setPage("pharmacies")} className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
              Trouver une pharmacie
            </button>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── Medicine Card ────────────────────────────────────────────────────────────
function MedicineCard({ med, onClick }: { med: Medicine; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group overflow-hidden">
      <div className="relative h-36 bg-muted overflow-hidden">
        <img
          src={`https://images.unsplash.com/${med.image}?w=400&h=200&fit=crop&auto=format`}
          alt={med.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full">
          {med.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm mb-1">{med.name}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{med.dosage}</p>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-foreground">{formatPrice(med.price)}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium">{med.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">{med.stock} en stock · {med.pharmacy}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Medicine Modal ────────────────────────────────────────────────────────────
function MedicineModal({ med, onClose, addToCart }: { med: Medicine; onClose: () => void; addToCart: (med: Medicine, pharm: PharmacyStock) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-border flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-primary bg-secondary px-2.5 py-1 rounded-full">{med.category}</span>
            <h2 className="text-xl font-bold text-foreground mt-2">{med.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors ml-4">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Map placeholder */}
          <div className="relative h-44 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden border border-primary/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-primary">Carte interactive</p>
                <p className="text-xs text-muted-foreground">Pharmacies à proximité</p>
              </div>
            </div>
            {/* Map pins */}
            {med.pharmacies.map((p, i) => (
              <div
                key={i}
                className="absolute w-8 h-8 bg-primary rounded-full border-2 border-white shadow flex items-center justify-center text-white text-xs font-bold"
                style={{ left: `${20 + i * 30}%`, top: `${30 + (i % 2) * 30}%` }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Dosage */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Pill className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Posologie</p>
                <p className="text-sm text-amber-700">{med.dosage}</p>
                <p className="text-sm text-amber-600 mt-2 leading-relaxed">{med.description}</p>
              </div>
            </div>
          </div>

          {/* Pharmacies */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Disponible dans {med.pharmacies.length} pharmacies</h3>
            <div className="space-y-3">
              {med.pharmacies.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-background rounded-2xl p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-foreground">{p.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.open ? "bg-green-50 text-primary" : "bg-red-50 text-red-600"}`}>
                          {p.open ? "Ouvert" : "Fermé"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.address}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Navigation className="w-3 h-3" />{p.distance}</span>
                        <span className="text-xs text-muted-foreground">{p.stock} en stock</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground mb-2">{formatPrice(p.price)}</p>
                    <button
                      onClick={() => addToCart(med, p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded-xl hover:bg-accent/90 transition-colors whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page Rechercher ─────────────────────────────────────────────────────────
function SearchPage({ addToCart }: { addToCart: (med: Medicine, pharm: PharmacyStock) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [radius, setRadius] = useState(3);
  const [selected, setSelected] = useState<Medicine | null>(null);

  const filtered = MEDICINES.filter(m => {
    const matchCat = category === "Tous" || m.category === category;
    const matchQ = m.name.toLowerCase().includes(query.toLowerCase()) || m.category.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen">
      {/* Search bar top */}
      <div className="bg-white border-b border-border py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 flex items-center gap-2 bg-background rounded-xl border border-border px-4 py-2.5">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher un médicament..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3 bg-background rounded-xl border border-border px-4 py-2.5 min-w-[220px]">
              <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
              <input
                type="range"
                min={500}
                max={10000}
                step={500}
                value={radius * 1000}
                onChange={e => setRadius(parseInt(e.target.value) / 1000)}
                className="flex-1 accent-primary"
              />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">{radius} km</span>
            </div>
            <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">
              <MapPin className="w-4 h-4" />
              Plus proches
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Catégories</p>
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${category === cat ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <Pill className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs font-semibold text-foreground mb-1">Ordonnance ?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Uploadez votre ordonnance pour une recommandation personnalisée.</p>
            <button className="mt-3 text-xs font-medium text-primary hover:underline">Uploader →</button>
          </div>
        </aside>

        {/* Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{filtered.length} médicaments trouvés</p>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-xl">
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">Aucun résultat</p>
              <p className="text-sm text-muted-foreground mt-1">Essayez un autre terme de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(med => (
                <MedicineCard key={med.id} med={med} onClick={() => setSelected(med)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {selected && (
        <MedicineModal
          med={selected}
          onClose={() => setSelected(null)}
          addToCart={(med, pharm) => { addToCart(med, pharm); setSelected(null); }}
        />
      )}
    </div>
  );
}

// ─── Page Pharmacies ──────────────────────────────────────────────────────────
function PharmaciesPage() {
  const [selected, setSelected] = useState<Pharmacy | null>(null);
  const [stockFilter, setStockFilter] = useState("Tous");
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const filtered = PHARMACIES.filter(p => !showOpenOnly || p.open);

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ height: "calc(100vh - 64px)" }}>
      {/* Left list */}
      <div className="md:w-96 flex-shrink-0 border-r border-border overflow-y-auto bg-white">
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-border">
          <div className="flex items-center gap-2 bg-background rounded-xl border border-border px-3 py-2 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input placeholder="Rechercher une pharmacie..." className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOpenOnly(!showOpenOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${showOpenOnly ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              Ouvertes uniquement
            </button>
            <span className="text-xs text-muted-foreground">{filtered.length} pharmacies</span>
          </div>
        </div>

        <div className="p-3 space-y-2">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`w-full text-left p-4 rounded-2xl border transition-all hover:border-primary/30 hover:shadow-sm ${selected?.id === p.id ? "border-primary bg-secondary" : "border-border bg-white"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.open ? "bg-green-50 text-primary" : "bg-red-50 text-red-500"}`}>
                      {p.open ? "Ouvert" : "Fermé"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{p.address}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Navigation className="w-3 h-3" />{p.distance}</span>
                    <span className="text-xs flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{p.rating}</span>
                    <span className="text-xs text-muted-foreground">{p.hours}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right map + detail */}
      <div className="flex-1 flex flex-col">
        {/* Map */}
        <div className="flex-1 relative bg-gradient-to-br from-green-50 to-teal-50 min-h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <p className="font-semibold text-primary text-lg">Carte interactive</p>
              <p className="text-sm text-muted-foreground">Cliquez sur une pharmacie pour la localiser</p>
            </div>
          </div>
          {/* Fake map pins */}
          {PHARMACIES.map((pharm, i) => (
            <button
              key={pharm.id}
              onClick={() => setSelected(pharm)}
              className={`absolute transition-transform hover:scale-110 ${selected?.id === pharm.id ? "scale-110" : ""}`}
              style={{ left: `${15 + (i % 4) * 20}%`, top: `${20 + Math.floor(i / 4) * 35 + (i % 2) * 15}%` }}
            >
              <div className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm font-bold ${pharm.open ? "bg-primary" : "bg-muted-foreground"}`}>
                <MapPin className="w-5 h-5" />
              </div>
              {selected?.id === pharm.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-lg border border-border px-3 py-2 whitespace-nowrap">
                  <p className="text-xs font-semibold text-foreground">{pharm.name}</p>
                  <p className="text-xs text-muted-foreground">{pharm.distance}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="bg-white border-t border-border p-5 overflow-y-auto" style={{ maxHeight: "50%" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground">{selected.name}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${selected.open ? "bg-green-50 text-primary" : "bg-red-50 text-red-500"}`}>
                    {selected.open ? "Ouvert" : "Fermé"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{selected.address}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="w-4 h-4" />{selected.phone}</span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4" />{selected.hours}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-muted">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Stock at this pharmacy */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">Stock disponible</p>
                <div className="flex gap-2">
                  {["Tous", "Analgésiques", "Antibiotiques"].map(f => (
                    <button
                      key={f}
                      onClick={() => setStockFilter(f)}
                      className={`text-xs px-2.5 py-1 rounded-full transition-colors ${stockFilter === f ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-secondary hover:text-primary"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MEDICINES.filter(m => m.pharmacies.some(ph => ph.name === selected.name) && (stockFilter === "Tous" || m.category === stockFilter)).map(m => (
                  <div key={m.id} className="bg-background rounded-xl p-3 border border-border">
                    <p className="text-xs font-semibold text-foreground mb-0.5">{m.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{m.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{formatPrice(m.price)}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${m.stock > 50 ? "bg-green-50 text-primary" : "bg-amber-50 text-amber-600"}`}>
                        {m.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page Connexion ───────────────────────────────────────────────────────────
function LoginPage({ setPage }: { setPage: (p: Page) => void }) {
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Left illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, white 0%, transparent 60%)" }} />
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">ePharm</span>
        </div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-8">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Votre santé,<br />sécurisée et simplifiée
          </h2>
          <div className="space-y-4 mt-8">
            {[
              { icon: Shield, text: "Suivi sécurisé de votre ordonnance" },
              { icon: Phone, text: "Paiement via Mobile Money (Orange, MTN, Wave)" },
              { icon: Bell, text: "Alertes de disponibilité en temps réel" },
              { icon: Heart, text: "Historique médical personnel protégé" },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-white/85 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            ))}
          </div>
          <p className="text-white/70 text-sm">+50 000 utilisateurs actifs</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">e<span className="text-primary">Pharm</span></span>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-1">Connexion rapide</h1>
            <p className="text-muted-foreground text-sm mb-7">Entrez votre numéro pour recevoir un code par SMS</p>

            {!codeSent ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Numéro de téléphone</label>
                    <div className="flex items-center gap-2 bg-background rounded-xl border border-border px-4 py-3 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
                      <div className="flex items-center gap-1.5 pr-2 border-r border-border">
                        <span className="text-sm">🇧🇯</span>
                        <span className="text-sm font-medium text-muted-foreground">+229</span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="97 00 00 00"
                        className="flex-1 bg-transparent outline-none text-sm"
                        type="tel"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => phone.length >= 8 && setCodeSent(true)}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Recevoir un code par SMS
                  </button>
                </div>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-muted-foreground">ou</span></div>
                </div>

                <button
                  onClick={() => setPage("order")}
                  className="w-full py-3 bg-white border border-border rounded-xl font-semibold text-sm text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center">
                    <Globe className="w-3 h-3 text-white" />
                  </div>
                  Continuer avec Google
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-secondary rounded-xl p-3 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-primary font-medium">Code envoyé au +229 {phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Code secret à 6 chiffres</label>
                  <div className="flex gap-2 justify-between">
                    {[0,1,2,3,4,5].map(i => (
                      <input
                        key={i}
                        maxLength={1}
                        className="w-12 h-12 text-center text-xl font-bold border border-border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        value={code[i] || ""}
                        onChange={e => {
                          const newCode = code.split("");
                          newCode[i] = e.target.value;
                          setCode(newCode.join(""));
                        }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setPage("order")}
                  className="w-full py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                >
                  Valider et continuer
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setCodeSent(false)} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Changer de numéro
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            En continuant, vous acceptez nos{" "}
            <span className="text-primary cursor-pointer hover:underline">conditions d&apos;utilisation</span>
            {" "}et notre{" "}
            <span className="text-primary cursor-pointer hover:underline">politique de confidentialité</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page Commander ───────────────────────────────────────────────────────────
function OrderPage({ cart, setCart, setPage }: { cart: CartItem[]; setCart: (c: CartItem[]) => void; setPage: (p: Page) => void }) {
  const [delivery, setDelivery] = useState<"retrait" | "livraison">("retrait");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = delivery === "livraison" ? 500 : 0;

  const updateQty = (idx: number, delta: number) => {
    const updated = cart.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item);
    setCart(updated);
  };

  const removeItem = (idx: number) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Commande confirmée !</h1>
          <p className="text-muted-foreground mb-2">Votre commande <strong className="text-foreground">#CMD-2024-0847</strong> a été transmise.</p>
          <p className="text-sm text-muted-foreground mb-8">Un SMS de confirmation vous a été envoyé avec les détails de récupération.</p>
          <div className="bg-white rounded-2xl p-5 border border-border text-left mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Paiement Mobile Money</p>
                <p className="text-xs text-muted-foreground">En attente de confirmation</p>
              </div>
              <span className="ml-auto text-sm font-bold text-foreground">{formatPrice(total + deliveryFee)}</span>
            </div>
            <div className="bg-amber-50 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-700">Vous recevrez une demande de paiement Mobile Money sous 2 minutes.</p>
            </div>
          </div>
          <button onClick={() => { setPage("home"); setCart([]); setConfirmed(false); }} className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Votre panier est vide</h2>
          <p className="text-sm text-muted-foreground mb-6">Ajoutez des médicaments depuis la page recherche</p>
          <button onClick={() => setPage("search")} className="px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors">
            Rechercher un médicament
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">Finaliser ma commande</h1>
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Cart */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Mon panier ({cart.length} article{cart.length > 1 ? "s" : ""})</h2>
              </div>
              <div className="divide-y divide-border">
                {cart.map((item, idx) => (
                  <div key={idx} className="p-5 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={`https://images.unsplash.com/${item.medicine.image}?w=80&h=80&fit=crop&auto=format`}
                        alt={item.medicine.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{item.medicine.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 mb-2">
                        <Store className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{item.pharmacy}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-border rounded-xl overflow-hidden">
                          <button onClick={() => updateQty(idx, -1)} className="px-3 py-1.5 hover:bg-muted transition-colors">
                            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQty(idx, 1)} className="px-3 py-1.5 hover:bg-muted transition-colors">
                            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(idx)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Retirer</button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} / unité</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery mode */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4">Mode de récupération</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "retrait" as const, icon: Store, label: "Retrait en pharmacie", note: "Gratuit · Prêt en 30min" },
                  { value: "livraison" as const, icon: Truck, label: "Livraison à domicile", note: "+500 FCFA · 1–2h" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDelivery(opt.value)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${delivery === opt.value ? "border-primary bg-secondary" : "border-border hover:border-primary/30"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${delivery === opt.value ? "bg-primary" : "bg-muted"}`}>
                      <opt.icon className={`w-5 h-5 ${delivery === opt.value ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.note}</p>
                  </button>
                ))}
              </div>
              {delivery === "livraison" && (
                <div className="mt-4">
                  <input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Adresse de livraison..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-6">
              <h3 className="font-semibold text-foreground mb-5">Résumé de la commande</h3>

              {/* Account */}
              <div className="bg-secondary rounded-xl p-3 flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  KA
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Koffi Adjovi</p>
                  <p className="text-xs text-muted-foreground">+229 97 12 34 56</p>
                </div>
                <CheckCircle className="w-4 h-4 text-primary ml-auto" />
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-medium">{delivery === "livraison" ? formatPrice(deliveryFee) : "Gratuit"}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-foreground text-lg">{formatPrice(total + deliveryFee)}</span>
                </div>
              </div>

              {/* Mobile Money */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-accent" />
                  <p className="text-sm font-semibold text-accent">Paiement Mobile Money</p>
                </div>
                <div className="flex gap-2">
                  {["Orange Money", "MTN MoMo", "Wave"].map(mm => (
                    <span key={mm} className="text-xs bg-white border border-orange-200 text-orange-600 px-2 py-1 rounded-lg font-medium">{mm}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setConfirmed(true)}
                className="w-full py-4 bg-accent text-white rounded-xl font-bold text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Confirmer via Mobile Money
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">Paiement 100% sécurisé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);

  const setPageAndScroll = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  const addToCart = (med: Medicine, pharm: PharmacyStock) => {
    setCart(prev => {
      const existing = prev.findIndex(i => i.medicine.id === med.id && i.pharmacy === pharm.name);
      if (existing >= 0) {
        return prev.map((item, i) => i === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { medicine: med, pharmacy: pharm.name, quantity: 1, price: pharm.price }];
    });
  };



  return (
    <div className="min-h-screen bg-background font-[Inter,sans-serif] flex flex-col">
      {page !== "login" && (
        <Navbar page={page} setPage={setPageAndScroll} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} />
      )}

      <main className="flex-1">
        {page === "home" && <HomePage setPage={setPageAndScroll} />}
        {page === "search" && <SearchPage addToCart={addToCart} />}
        {page === "pharmacies" && <PharmaciesPage />}
        {page === "login" && <LoginPage setPage={setPageAndScroll} />}
        {page === "order" && <OrderPage cart={cart} setCart={setCart} setPage={setPageAndScroll} />}
      </main>

      <ChatbotButton />
    </div>
  );
}
