import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// --- ТИПЫ ---
type Section = "docs-schools" | "docs-general" | "statutes" | "references" | "schemes";

interface User {
  id: string;
  login: string;
  name: string;
  rank: string;
  role: "admin" | "pilot" | "engineer";
}

// --- МОКК ПОЛЬЗОВАТЕЛЕЙ ---
const USERS: Record<string, { password: string; user: User }> = {
  "pilot01": {
    password: "empire2024",
    user: { id: "1", login: "pilot01", name: "Лт. Кессел", rank: "Лейтенант", role: "pilot" }
  },
  "engineer01": {
    password: "techcore",
    user: { id: "2", login: "engineer01", name: "Ст. Дарт", rank: "Старший инженер", role: "engineer" }
  },
  "admin": {
    password: "admin",
    user: { id: "3", login: "admin", name: "Командор Рекс", rank: "Командор", role: "admin" }
  }
};

// --- МОКК ДАННЫХ ---
const SECTIONS_DATA: Record<Section, { title: string; icon: string; items: { id: string; title: string; date: string; status: string; tag: string }[] }> = {
  "docs-schools": {
    title: "Документация — Школы",
    icon: "GraduationCap",
    items: [
      { id: "DS-001", title: "Программа лётной подготовки — Базовый курс", date: "12.03.2026", status: "Актуально", tag: "Пилотаж" },
      { id: "DS-002", title: "Технический курс — Системы навигации TIE", date: "05.02.2026", status: "Актуально", tag: "Навигация" },
      { id: "DS-003", title: "Аварийные процедуры — Учебный план", date: "18.01.2026", status: "На ревизии", tag: "Безопасность" },
      { id: "DS-004", title: "Боевое маневрирование — Продвинутый уровень", date: "22.11.2025", status: "Актуально", tag: "Тактика" },
      { id: "DS-005", title: "Стыковочные операции — Орбитальные станции", date: "30.10.2025", status: "Актуально", tag: "Стыковка" },
    ]
  },
  "docs-general": {
    title: "Документация — Общая",
    icon: "FileText",
    items: [
      { id: "DG-001", title: "Общий регламент подразделения ИП-7", date: "01.03.2026", status: "Актуально", tag: "Регламент" },
      { id: "DG-002", title: "Инструкция по технике безопасности", date: "14.02.2026", status: "Актуально", tag: "ТБ" },
      { id: "DG-003", title: "Протокол связи и шифрования — v4.2", date: "08.01.2026", status: "Актуально", tag: "Связь" },
      { id: "DG-004", title: "Приказ №47 — Реорганизация звеньев", date: "15.12.2025", status: "Архив", tag: "Приказ" },
      { id: "DG-005", title: "Памятка — Действия при отказе оборудования", date: "03.11.2025", status: "Актуально", tag: "Экстренные" },
      { id: "DG-006", title: "Медицинская документация — допуски 2026", date: "20.01.2026", status: "Актуально", tag: "Медицина" },
    ]
  },
  "statutes": {
    title: "Уставы",
    icon: "BookOpen",
    items: [
      { id: "ST-001", title: "Устав воздушно-космических сил — Раздел XII", date: "01.01.2026", status: "Актуально", tag: "Основной" },
      { id: "ST-002", title: "Дисциплинарный устав — Поправки 2025", date: "15.09.2025", status: "Актуально", tag: "Дисциплина" },
      { id: "ST-003", title: "Устав внутренней службы ИП-7", date: "10.06.2025", status: "Актуально", tag: "Внутренний" },
      { id: "ST-004", title: "Боевой устав — Часть III: Тактика перехвата", date: "22.03.2025", status: "Пересмотр", tag: "Боевой" },
    ]
  },
  "references": {
    title: "Справочные материалы",
    icon: "Database",
    items: [
      { id: "RF-001", title: "Справочник лётчика — Технические характеристики", date: "20.02.2026", status: "Актуально", tag: "Техника" },
      { id: "RF-002", title: "Каталог запчастей — серия TIE/LN", date: "12.01.2026", status: "Актуально", tag: "Запчасти" },
      { id: "RF-003", title: "Карты звёздных систем — Внешнее кольцо", date: "05.01.2026", status: "Актуально", tag: "Навигация" },
      { id: "RF-004", title: "Словарь военных терминов и кодов", date: "18.11.2025", status: "Актуально", tag: "Кодировки" },
      { id: "RF-005", title: "Справочник по вооружению — класс E", date: "30.10.2025", status: "Секретно", tag: "Вооружение" },
      { id: "RF-006", title: "Метеорологические данные — база Кессель", date: "25.03.2026", status: "Актуально", tag: "Метео" },
      { id: "RF-007", title: "Таблицы расхода топлива — гиперпрыжки", date: "14.02.2026", status: "Актуально", tag: "Топливо" },
    ]
  },
  "schemes": {
    title: "Схемы",
    icon: "Network",
    items: [
      { id: "SC-001", title: "Схема бортовой электрики TIE/Advanced", date: "08.03.2026", status: "Актуально", tag: "Электрика" },
      { id: "SC-002", title: "Принципиальная схема гипердвигателя", date: "25.02.2026", status: "Актуально", tag: "Двигатель" },
      { id: "SC-003", title: "Схема системы жизнеобеспечения", date: "10.02.2026", status: "Актуально", tag: "Жизнеобеспечение" },
      { id: "SC-004", title: "Топологическая схема базы — Ангар 7", date: "01.02.2026", status: "Актуально", tag: "Инфраструктура" },
      { id: "SC-005", title: "Схема вооружения — турельные установки", date: "20.01.2026", status: "Секретно", tag: "Вооружение" },
      { id: "SC-006", title: "Монтажная схема — навигационный компьютер", date: "05.01.2026", status: "Пересмотр", tag: "Навигация" },
    ]
  }
};

const BG_IMAGE = "https://cdn.poehali.dev/projects/0659f6fd-cf06-49b5-94cf-1f0837409d6a/files/68a9a1d7-11bd-4825-820c-6c0366b74ad8.jpg";

// --- СТАТУС БЕЙДЖ ---
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    "Актуально": { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
    "Архив": { bg: "rgba(122,143,160,0.1)", color: "var(--sw-text-dim)" },
    "На ревизии": { bg: "rgba(245,166,35,0.1)", color: "var(--sw-orange)" },
    "Пересмотр": { bg: "rgba(245,166,35,0.1)", color: "var(--sw-orange)" },
    "Секретно": { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  };
  const c = colors[status] || colors["Актуально"];
  return (
    <span className="font-mono-sw text-xs px-2 py-0.5 rounded"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>
      {status}
    </span>
  );
}

// --- ЭКРАН ВХОДА ---
function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  const bootMessages = [
    "ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...",
    "ЗАГРУЗКА ПРОТОКОЛОВ БЕЗОПАСНОСТИ...",
    "ПРОВЕРКА МАТРИЦЫ ДОСТУПА...",
    "СИСТЕМА ГОТОВА",
  ];

  useEffect(() => {
    if (bootStep < 3) {
      const t = setTimeout(() => setBootStep(b => b + 1), 600);
      return () => clearTimeout(t);
    }
  }, [bootStep]);

  const handleLogin = () => {
    if (!login || !password) { setError("ВВЕДИТЕ ИДЕНТИФИКАТОР И КОД ДОСТУПА"); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      const record = USERS[login.toLowerCase()];
      if (record && record.password === password) {
        onLogin(record.user);
      } else {
        setError("ДОСТУП ЗАПРЕЩЁН — НЕВЕРНЫЙ ИДЕНТИФИКАТОР ИЛИ КОД");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(7,11,15,0.88)" }} />
      <div className="sw-scanline" />

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        {/* Эмблема */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full"
            style={{ border: "2px solid var(--sw-orange)", boxShadow: "var(--sw-glow-orange)", background: "rgba(245,166,35,0.05)" }}
          >
            <span style={{ fontSize: 28, color: "var(--sw-orange)" }}>⚙</span>
          </div>
          <h1
            className="font-orbitron text-2xl font-black tracking-widest sw-glow-text"
            style={{ color: "var(--sw-orange)" }}
          >
            ИНЖЕНЕРЫ-ПИЛОТЫ
          </h1>
          <p className="font-mono-sw text-xs mt-1" style={{ color: "var(--sw-text-dim)", letterSpacing: "0.3em" }}>
            ТЕРМИНАЛ ДОСТУПА · ИП-7
          </p>
        </div>

        {/* Загрузка */}
        <div className="mb-6 px-2 space-y-1">
          {bootMessages.slice(0, bootStep + 1).map((msg, i) => (
            <div key={i} className="flex items-center gap-2 font-mono-sw text-xs"
              style={{ color: i === bootStep && bootStep < bootMessages.length - 1 ? "var(--sw-blue)" : "var(--sw-text-dim)" }}>
              <span style={{ color: i < bootStep ? "#22c55e" : "var(--sw-orange)" }}>
                {i < bootStep ? "✓" : "›"}
              </span>
              {msg}
              {i === bootStep && bootStep < bootMessages.length - 1 && (
                <span className="cursor-blink ml-1">_</span>
              )}
            </div>
          ))}
        </div>

        {/* Форма входа */}
        <div
          className="relative rounded p-6"
          style={{
            background: "rgba(13,20,32,0.95)",
            border: "1px solid var(--sw-border)",
          }}
        >
          {/* Угловые декоры */}
          {[
            { top: -1, left: -1, borderTop: true, borderLeft: true },
            { top: -1, right: -1, borderTop: true, borderRight: true },
            { bottom: -1, left: -1, borderBottom: true, borderLeft: true },
            { bottom: -1, right: -1, borderBottom: true, borderRight: true },
          ].map((c, i) => (
            <div key={i} style={{
              position: "absolute",
              top: c.top !== undefined ? c.top : "auto",
              bottom: c.bottom !== undefined ? c.bottom : "auto",
              left: c.left !== undefined ? c.left : "auto",
              right: c.right !== undefined ? c.right : "auto",
              width: 16, height: 16,
              borderTop: c.borderTop ? `2px solid var(--sw-orange)` : "none",
              borderBottom: c.borderBottom ? `2px solid var(--sw-orange)` : "none",
              borderLeft: c.borderLeft ? `2px solid var(--sw-orange)` : "none",
              borderRight: c.borderRight ? `2px solid var(--sw-orange)` : "none",
              pointerEvents: "none"
            }} />
          ))}

          <p className="font-mono-sw text-xs mb-4" style={{ color: "var(--sw-text-dim)", letterSpacing: "0.15em" }}>
            АУТЕНТИФИКАЦИЯ ЛИЧНОСТИ
          </p>

          <div className="space-y-3">
            <div>
              <label className="font-mono-sw text-xs mb-1 block" style={{ color: "var(--sw-text-dim)" }}>
                ИДЕНТИФИКАТОР
              </label>
              <input
                className="sw-input w-full px-3 py-2 rounded text-sm"
                placeholder="введите логин..."
                value={login}
                onChange={e => setLogin(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="font-mono-sw text-xs mb-1 block" style={{ color: "var(--sw-text-dim)" }}>
                КОД ДОСТУПА
              </label>
              <input
                type="password"
                className="sw-input w-full px-3 py-2 rounded text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>

            {error && (
              <div
                className="font-mono-sw text-xs py-2 px-3 rounded"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
              >
                ⚠ {error}
              </div>
            )}

            <button
              className="sw-btn-primary w-full py-3 rounded mt-2"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="cursor-blink">█</span> ВЕРИФИКАЦИЯ...
                </span>
              ) : "ВОЙТИ В СИСТЕМУ"}
            </button>
          </div>

          <div className="mt-4 pt-3 font-mono-sw text-xs space-y-0.5" style={{ borderTop: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", opacity: 0.6 }}>
            <div>Демо: admin / admin</div>
            <div>Пилот: pilot01 / empire2024</div>
            <div>Инженер: engineer01 / techcore</div>
          </div>
        </div>

        <p className="text-center font-mono-sw text-xs mt-4" style={{ color: "var(--sw-text-dim)", opacity: 0.4 }}>
          НЕСАНКЦИОНИРОВАННЫЙ ДОСТУП ЗАПРЕЩЁН · ИМП. КОД §47.3
        </p>
      </div>
    </div>
  );
}

// --- ГЛАВНЫЙ ТЕРМИНАЛ ---
function MainTerminal({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeSection, setActiveSection] = useState<Section>("docs-schools");
  const [searchQuery, setSearchQuery] = useState("");
  const [time, setTime] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setSelectedItem(null);
    setSearchQuery("");
  }, [activeSection]);

  const navItems: { id: Section; icon: string; label: string }[] = [
    { id: "docs-schools", icon: "GraduationCap", label: "Документация — Школы" },
    { id: "docs-general", icon: "FileText", label: "Документация — Общая" },
    { id: "statutes", icon: "BookOpen", label: "Уставы" },
    { id: "references", icon: "Database", label: "Справочные материалы" },
    { id: "schemes", icon: "Network", label: "Схемы" },
  ];

  const section = SECTIONS_DATA[activeSection];
  const filteredItems = section.items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleColor: Record<string, string> = {
    admin: "#ef4444",
    pilot: "var(--sw-blue)",
    engineer: "var(--sw-orange)",
  };
  const roleLevel: Record<string, string> = {
    admin: "ОМЕГА", pilot: "АЛЬФА", engineer: "БЕТА"
  };
  const roleWidth: Record<string, string> = {
    admin: "100%", engineer: "70%", pilot: "50%"
  };

  return (
    <div
      className="fixed inset-0 flex flex-col sw-scanline"
      style={{ background: "var(--sw-dark)" }}
    >
      {/* ШАПКА */}
      <header
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{
          background: "var(--sw-panel)",
          borderBottom: "1px solid var(--sw-border)",
          boxShadow: "0 2px 24px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded"
            style={{ border: "1px solid var(--sw-orange)", background: "rgba(245,166,35,0.1)" }}
          >
            <span style={{ fontSize: 16, color: "var(--sw-orange)" }}>⚙</span>
          </div>
          <div>
            <div className="font-orbitron text-xs font-bold sw-glow-text" style={{ color: "var(--sw-orange)", letterSpacing: "0.15em" }}>
              ИНЖЕНЕРЫ-ПИЛОТЫ
            </div>
            <div className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)", letterSpacing: "0.1em" }}>
              БАЗА ИП-7 · ТЕРМИНАЛ ДОСТУПА
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <div className="font-mono-sw text-sm sw-glow-text" style={{ color: "var(--sw-orange)" }}>
              {time.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)" }}>
              {time.toLocaleDateString("ru-RU")}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="status-dot" />
            <span className="font-mono-sw text-xs" style={{ color: "#22c55e" }}>ONLINE</span>
          </div>

          <div className="flex items-center gap-2 pl-4" style={{ borderLeft: "1px solid var(--sw-border)" }}>
            <div className="text-right">
              <div className="font-rajdhani text-sm font-semibold" style={{ color: "var(--sw-orange)" }}>
                {user.name}
              </div>
              <div className="font-mono-sw text-xs" style={{ color: roleColor[user.role] }}>
                {user.rank}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded transition-all"
              style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              title="Выход"
            >
              <Icon name="LogOut" size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ТЕЛО */}
      <div className="flex flex-1 overflow-hidden">
        {/* САЙДБАР */}
        <aside
          className="w-56 flex-shrink-0 flex flex-col"
          style={{ background: "rgba(13,20,32,0.97)", borderRight: "1px solid var(--sw-border)" }}
        >
          <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--sw-border)" }}>
            <p className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)", letterSpacing: "0.15em" }}>
              РАЗДЕЛЫ БАЗЫ ДАННЫХ
            </p>
          </div>

          <nav className="flex-1 py-2 overflow-y-auto">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item px-3 py-3 flex items-center gap-2.5 ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon
                  name={item.icon}
                  size={15}
                  style={{
                    color: activeSection === item.id ? "var(--sw-orange)" : "var(--sw-text-dim)",
                    flexShrink: 0
                  }}
                />
                <span
                  className="font-rajdhani text-sm font-medium leading-tight"
                  style={{ color: activeSection === item.id ? "var(--sw-orange)" : "#8fa8bf" }}
                >
                  {item.label}
                </span>
                {activeSection === item.id && (
                  <Icon name="ChevronRight" size={12} style={{ color: "var(--sw-orange)", marginLeft: "auto", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </nav>

          {/* Уровень доступа */}
          <div className="px-3 py-3 space-y-1.5" style={{ borderTop: "1px solid var(--sw-border)" }}>
            <div className="flex justify-between font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)" }}>
              <span>ДОСТУП</span>
              <span style={{ color: roleColor[user.role] }}>{user.role.toUpperCase()}</span>
            </div>
            <div className="sw-progress">
              <div className="sw-progress-fill" style={{ width: roleWidth[user.role] }} />
            </div>
            <div className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)", opacity: 0.6 }}>
              УРОВЕНЬ: {roleLevel[user.role]}
            </div>
          </div>
        </aside>

        {/* КОНТЕНТ */}
        <main className="flex-1 flex flex-col overflow-hidden sw-grid-bg">
          {/* Топ-бар секции */}
          <div
            className="px-6 py-3 flex items-center gap-4 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--sw-border)", background: "rgba(13,20,32,0.7)" }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Icon name={section.icon} size={18} style={{ color: "var(--sw-orange)" }} />
                <h2 className="font-orbitron text-sm font-bold tracking-wider" style={{ color: "var(--sw-orange)" }}>
                  {section.title.toUpperCase()}
                </h2>
              </div>
              <p className="font-mono-sw text-xs mt-0.5" style={{ color: "var(--sw-text-dim)" }}>
                В БАЗЕ: {section.items.length} · ОТОБРАЖЕНО: {filteredItems.length}
              </p>
            </div>

            <div className="relative w-60">
              <Icon name="Search" size={13} style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                color: "var(--sw-text-dim)", pointerEvents: "none"
              }} />
              <input
                className="sw-input w-full pl-8 pr-3 py-2 rounded text-sm"
                placeholder="поиск..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Список */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48" style={{ color: "var(--sw-text-dim)" }}>
                <Icon name="SearchX" size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                <p className="font-mono-sw text-sm">ДОКУМЕНТЫ НЕ НАЙДЕНЫ</p>
              </div>
            ) : filteredItems.map((item, i) => (
              <div
                key={item.id}
                className="rounded p-4 cursor-pointer transition-all animate-fade-in"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  background: selectedItem === item.id ? "rgba(245,166,35,0.04)" : "rgba(13,20,32,0.8)",
                  border: selectedItem === item.id ? "1px solid var(--sw-orange)" : "1px solid var(--sw-border)",
                  boxShadow: selectedItem === item.id ? "var(--sw-glow-orange)" : "none",
                }}
                onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{
                        background: "rgba(245,166,35,0.07)",
                        border: "1px solid rgba(245,166,35,0.2)",
                      }}
                    >
                      <Icon name="File" size={13} style={{ color: "var(--sw-orange)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)" }}>
                          [{item.id}]
                        </span>
                        <span className="font-rajdhani text-sm font-semibold" style={{ color: "#c8dae8" }}>
                          {item.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span
                          className="font-mono-sw text-xs px-2 py-0.5 rounded"
                          style={{
                            background: "rgba(0,212,255,0.07)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            color: "var(--sw-blue)"
                          }}
                        >
                          {item.tag}
                        </span>
                        <span className="font-mono-sw text-xs flex items-center gap-1" style={{ color: "var(--sw-text-dim)" }}>
                          <Icon name="Clock" size={10} />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <StatusBadge status={item.status} />
                    <Icon
                      name={selectedItem === item.id ? "ChevronUp" : "ChevronDown"}
                      size={14}
                      style={{ color: "var(--sw-text-dim)" }}
                    />
                  </div>
                </div>

                {selectedItem === item.id && (
                  <div
                    className="mt-3 pt-3 animate-fade-in"
                    style={{ borderTop: "1px solid var(--sw-border)" }}
                  >
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: "НОМЕР", value: item.id },
                        { label: "ОБНОВЛЁН", value: item.date },
                        { label: "СТАТУС", value: item.status },
                      ].map(f => (
                        <div
                          key={f.label}
                          className="rounded p-2"
                          style={{ background: "rgba(7,11,15,0.8)", border: "1px solid var(--sw-border)" }}
                        >
                          <div className="font-mono-sw text-xs mb-0.5" style={{ color: "var(--sw-text-dim)" }}>{f.label}</div>
                          <div className="font-rajdhani text-sm font-semibold" style={{ color: "var(--sw-orange)" }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="sw-btn-primary flex items-center gap-1.5 px-4 py-1.5 rounded text-xs">
                        <Icon name="Eye" size={12} />
                        ПРОСМОТР
                      </button>
                      <button
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded font-mono-sw text-xs transition-all"
                        style={{
                          border: "1px solid var(--sw-border)",
                          color: "var(--sw-text-dim)",
                          background: "transparent"
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--sw-blue)";
                          (e.currentTarget as HTMLElement).style.color = "var(--sw-blue)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--sw-border)";
                          (e.currentTarget as HTMLElement).style.color = "var(--sw-text-dim)";
                        }}
                      >
                        <Icon name="Download" size={12} />
                        СКАЧАТЬ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* НИЖНЯЯ СТРОКА */}
      <footer
        className="px-4 py-1.5 flex items-center justify-between"
        style={{ background: "rgba(7,11,15,0.97)", borderTop: "1px solid var(--sw-border)" }}
      >
        <div className="flex items-center gap-4 font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)" }}>
          <span style={{ color: "#22c55e" }}>● СИСТЕМА АКТИВНА</span>
          <span>ШИФРОВАНИЕ: AES-256</span>
          <span className="hidden sm:inline">ПРОТОКОЛ: v4.2.7</span>
        </div>
        <div className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)", opacity: 0.5 }}>
          СУБПРОСТРАНСТВЕННЫЙ КАНАЛ · ЗАСЕКРЕЧЕНО
        </div>
      </footer>
    </div>
  );
}

// --- КОРЕНЬ ---
export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  return user
    ? <MainTerminal user={user} onLogout={() => setUser(null)} />
    : <LoginScreen onLogin={setUser} />;
}