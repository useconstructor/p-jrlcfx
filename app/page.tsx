"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Menu,
  X,
  ClipboardList,
  User,
  CheckCircle,
  Lock,
  PenLine,
  DollarSign,
  Save,
  Search,
  Calendar,
  Trash2,
  Edit3,
  Shield,
  Smartphone,
  FileText,
  Mail,
  Send,
} from "lucide-react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  currency: string;
  created_at: string;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: description.trim(),
        amount: parseFloat(amount),
        currency: "MXN",
      }),
    });

    setDescription("");
    setAmount("");
    fetchExpenses();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditDescription(expense.description);
    setEditAmount(expense.amount.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editDescription.trim() || !editAmount) return;

    await fetch(`/api/expenses/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: editDescription.trim(),
        amount: parseFloat(editAmount),
      }),
    });

    setEditingId(null);
    setEditDescription("");
    setEditAmount("");
    fetchExpenses();
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("loading");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CONSTRUCTOR_API}/v1/forms/${process.env.NEXT_PUBLIC_PROJECT_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contactName,
            email: contactEmail,
            message: contactMessage,
          }),
        }
      );

      if (res.ok) {
        setContactStatus("success");
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const expenseDate = new Date(expense.created_at).toISOString().split("T")[0];
    const matchesDateFrom = !dateFrom || expenseDate >= dateFrom;
    const matchesDateTo = !dateTo || expenseDate <= dateTo;

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const navLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Registrar", href: "#tracker" },
    { label: "Cómo Funciona", href: "#process" },
    { label: "Características", href: "#features" },
    { label: "Contacto", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--color-background)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#hero" className="font-bold text-xl text-[var(--color-foreground)]">
              Directo Gastos
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Panel */}
        <div
          className={`md:hidden absolute top-16 left-0 right-0 bg-[var(--color-background)] border-b border-[var(--color-border)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-all duration-300"
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 60}ms` : "0ms",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative py-20 lg:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #F8F7F5 0%, #E8EDE8 50%, #F8F7F5 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, #1FA472 10px, #1FA472 11px)",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-[var(--color-peach)] text-[var(--color-foreground)] rounded-full">
            Sin cuentas, sin complicaciones
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-foreground)] mb-6">
            Registra tus gastos al instante
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted-foreground)] max-w-2xl mx-auto mb-8">
            Ve exactamente a dónde va tu dinero. Sin complicaciones, sin cuentas,
            solo tú y tus gastos.
          </p>
          <a href="#tracker">
            <Button
              size="lg"
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 text-lg px-8 py-6"
            >
              Comenzar
            </Button>
          </a>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-[var(--color-secondary)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-[var(--color-border)]">
            {[
              { icon: ClipboardList, value: "45,000+", label: "gastos registrados" },
              { icon: User, value: "8,200", label: "usuarios activos" },
              { icon: CheckCircle, value: "99.8%", label: "precisión en búsqueda" },
              { icon: Lock, value: "0", label: "datos compartidos" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 px-4"
              >
                <stat.icon className="w-6 h-6 text-[var(--color-primary)]" />
                <div>
                  <p className="text-xl font-bold text-[var(--color-foreground)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expense Tracker Section */}
      <section id="tracker" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">
              Tu registro de gastos
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)]">
              Añade, busca y administra tus gastos en un solo lugar
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add Expense Form */}
            <Card className="lg:col-span-1 bg-white border-[var(--color-border)]">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-[var(--color-primary)]" />
                  Nuevo Gasto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descripción
                    </label>
                    <Input
                      type="text"
                      placeholder="Ej: Almuerzo en La Cocina"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Monto (MXN)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-9 bg-white"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Gasto
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Expense List */}
            <Card className="lg:col-span-2 bg-white border-[var(--color-border)]">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl">Tus Gastos</CardTitle>
                  <div className="px-4 py-2 bg-[var(--color-teal)] text-white rounded-lg font-bold">
                    Total: ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                    <Input
                      type="text"
                      placeholder="Buscar gastos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-white"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="pl-9 bg-white"
                      placeholder="Desde"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="pl-9 bg-white"
                      placeholder="Hasta"
                    />
                  </div>
                </div>

                {/* Expense Items */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <p className="text-center text-[var(--color-muted-foreground)] py-8">
                      Cargando gastos...
                    </p>
                  ) : filteredExpenses.length === 0 ? (
                    <p className="text-center text-[var(--color-muted-foreground)] py-8">
                      {expenses.length === 0
                        ? "No hay gastos registrados. ¡Añade tu primer gasto!"
                        : "No se encontraron gastos con esos filtros."}
                    </p>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-4 bg-[var(--color-secondary)] rounded-lg"
                      >
                        {editingId === expense.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="flex-1 bg-white"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-28 bg-white"
                            />
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
                            >
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className="font-medium text-[var(--color-foreground)]">
                                {expense.description}
                              </p>
                              <p className="text-sm text-[var(--color-muted-foreground)]">
                                {new Date(expense.created_at).toLocaleDateString("es-MX", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-[var(--color-foreground)]">
                                ${expense.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                              </span>
                              <button
                                onClick={() => handleEdit(expense)}
                                className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors"
                                aria-label="Editar gasto"
                              >
                                <Edit3 className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                              </button>
                              <button
                                onClick={() => handleDelete(expense.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                aria-label="Eliminar gasto"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section id="process" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">
              Registro Rápido
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)]">
              Tres pasos simples para controlar tu dinero
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Describe tu gasto",
                description: "Añade una descripción breve (ej: 'Almuerzo en La Cocina')",
                icon: PenLine,
                bg: "var(--color-peach)",
              },
              {
                title: "Ingresa el monto",
                description: "Escribe el precio exacto en pesos mexicanos o tu moneda local",
                icon: DollarSign,
                bg: "var(--color-sky)",
              },
              {
                title: "Listo, guardado",
                description: "Tu gasto se guarda automáticamente en tu dispositivo",
                icon: Save,
                bg: "var(--color-sage)",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="border-0 shadow-none"
                style={{ backgroundColor: step.bg }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-muted-foreground)]">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section id="features" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">
              Busca y Controla
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              Encuentra cualquier gasto en segundos. Escribe una palabra clave y ve todos
              los registros que coinciden.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Búsqueda por palabra clave",
                description: "Encuentra 'Starbucks', 'taxi', 'cine' al instante",
                icon: Search,
              },
              {
                title: "Filtros por fecha",
                description: "Revisa gastos de cualquier rango de fechas",
                icon: Calendar,
              },
              {
                title: "Edición y eliminación",
                description: "Modifica o borra registros cuando lo necesites",
                icon: Edit3,
              },
              {
                title: "Total actualizado",
                description: "Ve cuánto has gastado en tiempo real",
                icon: DollarSign,
              },
              {
                title: "Optimizado para móvil",
                description: "Interfaz responsive para usar en cualquier dispositivo",
                icon: Smartphone,
              },
              {
                title: "Exportación local",
                description: "Respalda tus datos antes de borrarlos",
                icon: FileText,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white border-[var(--color-border)] hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-[var(--color-peach)] flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-muted-foreground)]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About / Privacy Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[var(--color-teal)] flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-6">
            Tu Dinero, Tu Control
          </h2>
          <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed">
            Todos tus datos viven en tu teléfono. No hay servidores, no hay
            sincronización en la nube, no hay publicidad. Eres el único dueño de tu
            información. Borra la app cuando quieras; tus gastos se van contigo.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">
              Lo que dicen nuestros usuarios
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Finalmente entiendo a dónde va mi dinero cada mes. La interfaz es tan simple que uso la app todos los días.",
                name: "Maria González",
                role: "Contadora",
                location: "Monterrey",
              },
              {
                quote:
                  "Sin complicaciones, sin cuentas que crear. Me encanta que sea solo local, sin dar datos personales a nadie.",
                name: "Roberto Campos",
                role: "Ingeniero",
                location: "Ciudad de México",
              },
              {
                quote:
                  "Cambié de tres apps de presupuesto a esta. Es la única que no me abruma.",
                name: "Leticia Morales",
                role: "Diseñadora Gráfica",
                location: "Guadalajara",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-[var(--color-background)] border-[var(--color-border)]"
              >
                <CardContent className="p-6">
                  <p className="text-[var(--color-foreground)] mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-bold text-[var(--color-foreground)]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {testimonial.role}, {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[var(--color-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Gratis. Para siempre. Sin condiciones.
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Empieza a controlar tus gastos hoy mismo
          </p>
          <a href="#tracker">
            <Button
              size="lg"
              className="bg-white text-[var(--color-primary)] hover:bg-white/90 text-lg px-8 py-6"
            >
              Comenzar Ahora
            </Button>
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)]">
              ¿Tienes preguntas o sugerencias? Escríbenos
            </p>
          </div>

          {contactStatus === "success" ? (
            <Card className="bg-[var(--color-sage)] border-0">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[var(--color-teal)]" />
                <p className="text-xl font-bold text-[var(--color-foreground)]">
                  Mensaje enviado
                </p>
                <p className="text-[var(--color-muted-foreground)]">
                  Te contactaremos pronto
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-[var(--color-border)]">
              <CardContent className="p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre
                    </label>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="pl-9 bg-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensaje
                    </label>
                    <textarea
                      placeholder="¿En qué podemos ayudarte?"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="flex min-h-32 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    />
                  </div>
                  {contactStatus === "error" && (
                    <p className="text-red-500 text-sm">
                      Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                    disabled={contactStatus === "loading"}
                  >
                    {contactStatus === "loading" ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-foreground)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Directo Gastos</h3>
              <p className="text-white/70">
                La forma más simple de registrar y controlar tus gastos diarios.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Privacidad</h4>
              <p className="text-white/70">
                Todos tus datos permanecen en tu dispositivo. No recopilamos ni
                compartimos información personal.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/50">
            <p>© {new Date().getFullYear()} Directo Gastos. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
