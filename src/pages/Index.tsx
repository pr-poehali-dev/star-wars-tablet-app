import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

// --- ТИПЫ ---
type Section = "docs-schools" | "docs-general" | "statutes" | "references" | "schemes";
type Role = "admin" | "pilot" | "engineer";

interface User {
  id: string;
  login: string;
  password: string;
  callsign: string;
  rank: string;
  role: Role;
  allowedSections: Section[];
}

interface DocItem {
  id: string;
  title: string;
  date: string;
  status: string;
  tag: string;
  fileUrl?: string;
  fileName?: string;
  allowedRoles: Role[];
}

interface SectionData {
  title: string;
  icon: string;
  items: DocItem[];
}

// --- ДАННЫЕ ---
const ALL_SECTIONS: Section[] = ["docs-schools", "docs-general", "statutes", "references", "schemes"];

const initUsers: User[] = [
  {
    id: "1", login: "pilot01", password: "empire2024",
    callsign: "Кессель", rank: "Лейтенант", role: "pilot",
    allowedSections: ["docs-schools", "docs-general", "statutes"]
  },
  {
    id: "2", login: "engineer01", password: "techcore",
    callsign: "Дарт", rank: "Старший инженер", role: "engineer",
    allowedSections: ["docs-general", "references", "schemes"]
  },
  {
    id: "3", login: "admin", password: "sw-admin-2026",
    callsign: "Рекс", rank: "Командор", role: "admin",
    allowedSections: ALL_SECTIONS
  }
];

const initSections: Record<Section, SectionData> = {
  "docs-schools": {
    title: "Документация — Школы",
    icon: "GraduationCap",
    items: [
      { id: "DS-001", title: "Программа лётной подготовки — Базовый курс", date: "12.03.2026", status: "Актуально", tag: "Пилотаж", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "DS-002", title: "Технический курс — Системы навигации TIE", date: "05.02.2026", status: "Актуально", tag: "Навигация", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "DS-003", title: "Аварийные процедуры — Учебный план", date: "18.01.2026", status: "На ревизии", tag: "Безопасность", allowedRoles: ["admin", "pilot"] },
      { id: "DS-004", title: "Боевое маневрирование — Продвинутый уровень", date: "22.11.2025", status: "Актуально", tag: "Тактика", allowedRoles: ["admin", "pilot"] },
      { id: "DS-005", title: "Стыковочные операции — Орбитальные станции", date: "30.10.2025", status: "Актуально", tag: "Стыковка", allowedRoles: ["admin", "pilot", "engineer"] },
    ]
  },
  "docs-general": {
    title: "Документация — Общая",
    icon: "FileText",
    items: [
      { id: "DG-001", title: "Общий регламент подразделения ИП-7", date: "01.03.2026", status: "Актуально", tag: "Регламент", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "DG-002", title: "Инструкция по технике безопасности", date: "14.02.2026", status: "Актуально", tag: "ТБ", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "DG-003", title: "Протокол связи и шифрования — v4.2", date: "08.01.2026", status: "Актуально", tag: "Связь", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "DG-004", title: "Приказ №47 — Реорганизация звеньев", date: "15.12.2025", status: "Архив", tag: "Приказ", allowedRoles: ["admin"] },
      { id: "DG-005", title: "Памятка — Действия при отказе оборудования", date: "03.11.2025", status: "Актуально", tag: "Экстренные", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "DG-006", title: "Медицинская документация — допуски 2026", date: "20.01.2026", status: "Актуально", tag: "Медицина", allowedRoles: ["admin", "pilot"] },
    ]
  },
  "statutes": {
    title: "Уставы",
    icon: "BookOpen",
    items: [
      { id: "ST-001", title: "Устав воздушно-космических сил — Раздел XII", date: "01.01.2026", status: "Актуально", tag: "Основной", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "ST-002", title: "Дисциплинарный устав — Поправки 2025", date: "15.09.2025", status: "Актуально", tag: "Дисциплина", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "ST-003", title: "Устав внутренней службы ИП-7", date: "10.06.2025", status: "Актуально", tag: "Внутренний", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "ST-004", title: "Боевой устав — Часть III: Тактика перехвата", date: "22.03.2025", status: "Пересмотр", tag: "Боевой", allowedRoles: ["admin", "pilot"] },
    ]
  },
  "references": {
    title: "Справочные материалы",
    icon: "Database",
    items: [
      { id: "RF-001", title: "Справочник лётчика — Технические характеристики", date: "20.02.2026", status: "Актуально", tag: "Техника", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "RF-002", title: "Каталог запчастей — серия TIE/LN", date: "12.01.2026", status: "Актуально", tag: "Запчасти", allowedRoles: ["admin", "engineer"] },
      { id: "RF-003", title: "Карты звёздных систем — Внешнее кольцо", date: "05.01.2026", status: "Актуально", tag: "Навигация", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "RF-004", title: "Словарь военных терминов и кодов", date: "18.11.2025", status: "Актуально", tag: "Кодировки", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "RF-005", title: "Справочник по вооружению — класс E", date: "30.10.2025", status: "Секретно", tag: "Вооружение", allowedRoles: ["admin"] },
      { id: "RF-006", title: "Метеорологические данные — база Кессель", date: "25.03.2026", status: "Актуально", tag: "Метео", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "RF-007", title: "Таблицы расхода топлива — гиперпрыжки", date: "14.02.2026", status: "Актуально", tag: "Топливо", allowedRoles: ["admin", "pilot", "engineer"] },
    ]
  },
  "schemes": {
    title: "Схемы",
    icon: "Network",
    items: [
      { id: "SC-001", title: "Схема бортовой электрики TIE/Advanced", date: "08.03.2026", status: "Актуально", tag: "Электрика", allowedRoles: ["admin", "engineer"] },
      { id: "SC-002", title: "Принципиальная схема гипердвигателя", date: "25.02.2026", status: "Актуально", tag: "Двигатель", allowedRoles: ["admin", "engineer"] },
      { id: "SC-003", title: "Схема системы жизнеобеспечения", date: "10.02.2026", status: "Актуально", tag: "Жизнеобеспечение", allowedRoles: ["admin", "engineer"] },
      { id: "SC-004", title: "Топологическая схема базы — Ангар 7", date: "01.02.2026", status: "Актуально", tag: "Инфраструктура", allowedRoles: ["admin", "pilot", "engineer"] },
      { id: "SC-005", title: "Схема вооружения — турельные установки", date: "20.01.2026", status: "Секретно", tag: "Вооружение", allowedRoles: ["admin"] },
      { id: "SC-006", title: "Монтажная схема — навигационный компьютер", date: "05.01.2026", status: "Пересмотр", tag: "Навигация", allowedRoles: ["admin", "engineer"] },
    ]
  }
};

const BG_IMAGE = "https://cdn.poehali.dev/projects/0659f6fd-cf06-49b5-94cf-1f0837409d6a/files/68a9a1d7-11bd-4825-820c-6c0366b74ad8.jpg";

function genId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function today() {
  return new Date().toLocaleDateString("ru-RU");
}

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
  const [users] = useState<User[]>(initUsers);

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
      const found = users.find(u => u.login.toLowerCase() === login.toLowerCase() && u.password === password);
      if (found) {
        onLogin(found);
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
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full"
            style={{ border: "2px solid var(--sw-orange)", boxShadow: "var(--sw-glow-orange)", background: "rgba(245,166,35,0.05)" }}
          >
            <span style={{ fontSize: 28, color: "var(--sw-orange)" }}>⚙</span>
          </div>
          <h1 className="font-orbitron text-2xl font-black tracking-widest sw-glow-text" style={{ color: "var(--sw-orange)" }}>
            ИНЖЕНЕРЫ-ПИЛОТЫ
          </h1>
          <p className="font-mono-sw text-xs mt-1" style={{ color: "var(--sw-text-dim)", letterSpacing: "0.3em" }}>
            ТЕРМИНАЛ ДОСТУПА · ИП-7
          </p>
        </div>

        <div className="mb-6 px-2 space-y-1">
          {bootMessages.slice(0, bootStep + 1).map((msg, i) => (
            <div key={i} className="flex items-center gap-2 font-mono-sw text-xs"
              style={{ color: i === bootStep && bootStep < bootMessages.length - 1 ? "var(--sw-orange)" : "var(--sw-text-dim)" }}>
              <span>{i < bootStep ? "✓" : i === bootStep && bootStep < 3 ? "▶" : "✓"}</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg p-6 space-y-4"
          style={{ background: "rgba(13,20,32,0.95)", border: "1px solid var(--sw-border)" }}
        >
          <div className="relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: "var(--sw-orange)" }} />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: "var(--sw-orange)" }} />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: "var(--sw-orange)" }} />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: "var(--sw-orange)" }} />
            <div className="p-3 space-y-3">
              <div>
                <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)", letterSpacing: "0.1em" }}>
                  ИДЕНТИФИКАТОР
                </label>
                <input
                  className="sw-input w-full px-3 py-2 rounded text-sm"
                  placeholder="введите логин..."
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)", letterSpacing: "0.1em" }}>
                  КОД ДОСТУПА
                </label>
                <input
                  type="password"
                  className="sw-input w-full px-3 py-2 rounded text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="font-mono-sw text-xs px-3 py-2 rounded text-center"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 rounded font-orbitron text-sm font-bold tracking-widest transition-all"
            style={{
              background: loading ? "rgba(245,166,35,0.2)" : "var(--sw-orange)",
              color: loading ? "var(--sw-orange)" : "#070b0f",
              border: "1px solid var(--sw-orange)",
              boxShadow: loading ? "none" : "var(--sw-glow-orange)",
            }}
          >
            {loading ? "ВЕРИФИКАЦИЯ..." : "ВОЙТИ В СИСТЕМУ"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- МОДАЛКА ---
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(7,11,15,0.85)" }} />
      <div
        className="relative w-full max-w-lg mx-4 rounded-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto"
        style={{ background: "rgba(13,20,32,0.98)", border: "1px solid var(--sw-orange)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-orbitron text-sm font-bold tracking-wider" style={{ color: "var(--sw-orange)" }}>
            {title}
          </h3>
          <button onClick={onClose} className="p-1 rounded" style={{ color: "var(--sw-text-dim)" }}>
            <Icon name="X" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// --- ПАНЕЛЬ АДМИНИСТРАТОРА ---
function AdminPanel({
  users, sections, onUsersChange, onSectionsChange
}: {
  users: User[];
  sections: Record<Section, SectionData>;
  onUsersChange: (u: User[]) => void;
  onSectionsChange: (s: Record<Section, SectionData>) => void;
}) {
  const [tab, setTab] = useState<"users" | "docs">("users");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [addDocSection, setAddDocSection] = useState<Section | null>(null);
  const [editDoc, setEditDoc] = useState<{ section: Section; doc: DocItem } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const SECTION_LABELS: Record<Section, string> = {
    "docs-schools": "Документация — Школы",
    "docs-general": "Документация — Общая",
    "statutes": "Уставы",
    "references": "Справочные материалы",
    "schemes": "Схемы",
  };

  const ROLE_LABELS: Record<Role, string> = {
    admin: "Администратор",
    pilot: "Пилот",
    engineer: "Инженер",
  };

  // Форма добавления пользователя
  function AddUserForm({ onDone }: { onDone: () => void }) {
    const [form, setForm] = useState({
      login: "", password: "", callsign: "", rank: "", role: "pilot" as Role,
      allowedSections: [] as Section[]
    });
    const [err, setErr] = useState("");

    const toggle = (s: Section) => {
      setForm(f => ({
        ...f,
        allowedSections: f.allowedSections.includes(s)
          ? f.allowedSections.filter(x => x !== s)
          : [...f.allowedSections, s]
      }));
    };

    const save = () => {
      if (!form.login || !form.password || !form.callsign || !form.rank) { setErr("Заполните все поля"); return; }
      if (users.find(u => u.login.toLowerCase() === form.login.toLowerCase())) { setErr("Такой логин уже существует"); return; }
      const newUser: User = { id: genId(), ...form };
      onUsersChange([...users, newUser]);
      onDone();
    };

    return (
      <div className="space-y-3">
        {[
          { label: "ЛОГИН", key: "login", placeholder: "pilot02" },
          { label: "ПАРОЛЬ", key: "password", placeholder: "••••••••" },
          { label: "ПОЗЫВНОЙ", key: "callsign", placeholder: "Вепрь" },
          { label: "ЗВАНИЕ", key: "rank", placeholder: "Капитан" },
        ].map(f => (
          <div key={f.key}>
            <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>{f.label}</label>
            <input
              type={f.key === "password" ? "password" : "text"}
              className="sw-input w-full px-3 py-2 rounded text-sm"
              placeholder={f.placeholder}
              value={(form as Record<string, string>)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            />
          </div>
        ))}
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>РОЛЬ</label>
          <select
            className="sw-input w-full px-3 py-2 rounded text-sm"
            value={form.role}
            onChange={e => setForm(p => ({ ...p, role: e.target.value as Role }))}
          >
            <option value="pilot">Пилот</option>
            <option value="engineer">Инженер</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-2" style={{ color: "var(--sw-text-dim)" }}>ДОСТУП К РАЗДЕЛАМ</label>
          <div className="space-y-1.5">
            {ALL_SECTIONS.map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allowedSections.includes(s)}
                  onChange={() => toggle(s)}
                  className="accent-orange-400"
                />
                <span className="font-rajdhani text-sm" style={{ color: "#8fa8bf" }}>{SECTION_LABELS[s]}</span>
              </label>
            ))}
          </div>
        </div>
        {err && <p className="font-mono-sw text-xs" style={{ color: "#ef4444" }}>{err}</p>}
        <div className="flex gap-2 pt-2">
          <button onClick={save} className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
            style={{ background: "var(--sw-orange)", color: "#070b0f" }}>
            СОЗДАТЬ
          </button>
          <button onClick={onDone} className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
            style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>
            ОТМЕНА
          </button>
        </div>
      </div>
    );
  }

  // Форма редактирования пользователя
  function EditUserForm({ user, onDone }: { user: User; onDone: () => void }) {
    const [form, setForm] = useState({ ...user });
    const [err, setErr] = useState("");

    const toggle = (s: Section) => {
      setForm(f => ({
        ...f,
        allowedSections: f.allowedSections.includes(s)
          ? f.allowedSections.filter(x => x !== s)
          : [...f.allowedSections, s]
      }));
    };

    const save = () => {
      if (!form.callsign || !form.rank || !form.password) { setErr("Заполните все поля"); return; }
      onUsersChange(users.map(u => u.id === form.id ? form : u));
      onDone();
    };

    return (
      <div className="space-y-3">
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>ЛОГИН</label>
          <div className="sw-input w-full px-3 py-2 rounded text-sm font-mono-sw" style={{ color: "var(--sw-text-dim)", opacity: 0.6 }}>
            {form.login}
          </div>
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>ПАРОЛЬ</label>
          <input
            type="password"
            className="sw-input w-full px-3 py-2 rounded text-sm"
            placeholder="новый пароль"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
        </div>
        {[
          { label: "ПОЗЫВНОЙ", key: "callsign", placeholder: "Вепрь" },
          { label: "ЗВАНИЕ", key: "rank", placeholder: "Капитан" },
        ].map(f => (
          <div key={f.key}>
            <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>{f.label}</label>
            <input
              className="sw-input w-full px-3 py-2 rounded text-sm"
              value={(form as Record<string, string>)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            />
          </div>
        ))}
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>РОЛЬ</label>
          <select
            className="sw-input w-full px-3 py-2 rounded text-sm"
            value={form.role}
            onChange={e => setForm(p => ({ ...p, role: e.target.value as Role }))}
          >
            <option value="pilot">Пилот</option>
            <option value="engineer">Инженер</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-2" style={{ color: "var(--sw-text-dim)" }}>ДОСТУП К РАЗДЕЛАМ</label>
          <div className="space-y-1.5">
            {ALL_SECTIONS.map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allowedSections.includes(s)}
                  onChange={() => toggle(s)}
                  className="accent-orange-400"
                />
                <span className="font-rajdhani text-sm" style={{ color: "#8fa8bf" }}>{SECTION_LABELS[s]}</span>
              </label>
            ))}
          </div>
        </div>
        {err && <p className="font-mono-sw text-xs" style={{ color: "#ef4444" }}>{err}</p>}
        <div className="flex gap-2 pt-2">
          <button onClick={save} className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
            style={{ background: "var(--sw-orange)", color: "#070b0f" }}>
            СОХРАНИТЬ
          </button>
          <button onClick={onDone} className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
            style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>
            ОТМЕНА
          </button>
        </div>
      </div>
    );
  }

  // Форма добавления документа
  function AddDocForm({ section, onDone }: { section: Section; onDone: () => void }) {
    const [form, setForm] = useState({
      title: "", tag: "", status: "Актуально", allowedRoles: ["admin", "pilot", "engineer"] as Role[],
      fileUrl: "", fileName: ""
    });
    const [err, setErr] = useState("");
    const localRef = useRef<HTMLInputElement>(null);

    const toggleRole = (r: Role) => {
      setForm(f => ({
        ...f,
        allowedRoles: f.allowedRoles.includes(r)
          ? f.allowedRoles.filter(x => x !== r)
          : [...f.allowedRoles, r]
      }));
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setForm(p => ({ ...p, fileUrl: url, fileName: file.name }));
    };

    const save = () => {
      if (!form.title || !form.tag) { setErr("Укажите название и тег"); return; }
      const sectionIds = sections[section].items.map(i => i.id);
      const prefix = section === "docs-schools" ? "DS" : section === "docs-general" ? "DG"
        : section === "statutes" ? "ST" : section === "references" ? "RF" : "SC";
      const nums = sectionIds.map(id => parseInt(id.split("-")[1])).filter(n => !isNaN(n));
      const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
      const newId = `${prefix}-${String(nextNum).padStart(3, "0")}`;

      const newDoc: DocItem = {
        id: newId, title: form.title, tag: form.tag, status: form.status,
        date: today(), allowedRoles: form.allowedRoles,
        fileUrl: form.fileUrl || undefined, fileName: form.fileName || undefined
      };
      onSectionsChange({
        ...sections,
        [section]: { ...sections[section], items: [...sections[section].items, newDoc] }
      });
      onDone();
    };

    return (
      <div className="space-y-3">
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>НАЗВАНИЕ</label>
          <input className="sw-input w-full px-3 py-2 rounded text-sm" value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Название документа" />
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>ТЕГ</label>
          <input className="sw-input w-full px-3 py-2 rounded text-sm" value={form.tag}
            onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} placeholder="Тактика" />
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>СТАТУС</label>
          <select className="sw-input w-full px-3 py-2 rounded text-sm" value={form.status}
            onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
            {["Актуально", "На ревизии", "Пересмотр", "Архив", "Секретно"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-2" style={{ color: "var(--sw-text-dim)" }}>ДОСТУП ДЛЯ РОЛЕЙ</label>
          <div className="flex gap-4">
            {(["admin", "pilot", "engineer"] as Role[]).map(r => (
              <label key={r} className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={form.allowedRoles.includes(r)}
                  onChange={() => toggleRole(r)} className="accent-orange-400" />
                <span className="font-rajdhani text-sm" style={{ color: "#8fa8bf" }}>{ROLE_LABELS[r]}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>ФАЙЛ (необязательно)</label>
          <input type="file" ref={localRef} className="hidden" onChange={handleFile} />
          <button onClick={() => localRef.current?.click()}
            className="w-full py-2 rounded text-sm font-mono-sw"
            style={{ border: "1px dashed var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>
            {form.fileName ? `📎 ${form.fileName}` : "Выбрать файл..."}
          </button>
        </div>
        {err && <p className="font-mono-sw text-xs" style={{ color: "#ef4444" }}>{err}</p>}
        <div className="flex gap-2 pt-2">
          <button onClick={save} className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
            style={{ background: "var(--sw-orange)", color: "#070b0f" }}>ДОБАВИТЬ</button>
          <button onClick={onDone} className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
            style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>ОТМЕНА</button>
        </div>
      </div>
    );
  }

  // Форма редактирования документа
  function EditDocForm({ section, doc, onDone }: { section: Section; doc: DocItem; onDone: () => void }) {
    const [form, setForm] = useState({ ...doc });
    const [err, setErr] = useState("");
    const localRef = useRef<HTMLInputElement>(null);

    const toggleRole = (r: Role) => {
      setForm(f => ({
        ...f,
        allowedRoles: f.allowedRoles.includes(r)
          ? f.allowedRoles.filter(x => x !== r)
          : [...f.allowedRoles, r]
      }));
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setForm(p => ({ ...p, fileUrl: url, fileName: file.name }));
    };

    const save = () => {
      if (!form.title || !form.tag) { setErr("Укажите название и тег"); return; }
      onSectionsChange({
        ...sections,
        [section]: {
          ...sections[section],
          items: sections[section].items.map(i => i.id === form.id ? { ...form, date: today() } : i)
        }
      });
      onDone();
    };

    return (
      <div className="space-y-3">
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>НАЗВАНИЕ</label>
          <input className="sw-input w-full px-3 py-2 rounded text-sm" value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>ТЕГ</label>
          <input className="sw-input w-full px-3 py-2 rounded text-sm" value={form.tag}
            onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} />
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>СТАТУС</label>
          <select className="sw-input w-full px-3 py-2 rounded text-sm" value={form.status}
            onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
            {["Актуально", "На ревизии", "Пересмотр", "Архив", "Секретно"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-2" style={{ color: "var(--sw-text-dim)" }}>ДОСТУП ДЛЯ РОЛЕЙ</label>
          <div className="flex gap-4">
            {(["admin", "pilot", "engineer"] as Role[]).map(r => (
              <label key={r} className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={form.allowedRoles.includes(r)}
                  onChange={() => toggleRole(r)} className="accent-orange-400" />
                <span className="font-rajdhani text-sm" style={{ color: "#8fa8bf" }}>{ROLE_LABELS[r]}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-mono-sw text-xs block mb-1" style={{ color: "var(--sw-text-dim)" }}>ФАЙЛ</label>
          <input type="file" ref={localRef} className="hidden" onChange={handleFile} />
          <button onClick={() => localRef.current?.click()}
            className="w-full py-2 rounded text-sm font-mono-sw"
            style={{ border: "1px dashed var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>
            {form.fileName ? `📎 ${form.fileName}` : "Заменить файл..."}
          </button>
        </div>
        {err && <p className="font-mono-sw text-xs" style={{ color: "#ef4444" }}>{err}</p>}
        <div className="flex gap-2 pt-2">
          <button onClick={save} className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
            style={{ background: "var(--sw-orange)", color: "#070b0f" }}>СОХРАНИТЬ</button>
          <button onClick={onDone} className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
            style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>ОТМЕНА</button>
        </div>
      </div>
    );
  }

  const deleteUser = (id: string) => {
    onUsersChange(users.filter(u => u.id !== id));
    setDeleteConfirm(null);
  };

  const deleteDoc = (section: Section, docId: string) => {
    onSectionsChange({
      ...sections,
      [section]: { ...sections[section], items: sections[section].items.filter(i => i.id !== docId) }
    });
  };

  const ROLE_COLOR: Record<Role, string> = {
    admin: "#ef4444", pilot: "var(--sw-blue)", engineer: "var(--sw-orange)"
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden sw-grid-bg">
      {/* Табы */}
      <div className="px-6 py-3 flex items-center gap-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--sw-border)", background: "rgba(13,20,32,0.7)" }}>
        <div className="flex items-center gap-2">
          <Icon name="Shield" size={18} style={{ color: "var(--sw-orange)" }} />
          <span className="font-orbitron text-sm font-bold tracking-wider" style={{ color: "var(--sw-orange)" }}>
            ПАНЕЛЬ АДМИНИСТРАТОРА
          </span>
        </div>
        <div className="flex gap-2 ml-auto">
          {(["users", "docs"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded font-orbitron text-xs font-bold tracking-wider"
              style={{
                background: tab === t ? "var(--sw-orange)" : "transparent",
                color: tab === t ? "#070b0f" : "var(--sw-text-dim)",
                border: `1px solid ${tab === t ? "var(--sw-orange)" : "var(--sw-border)"}`,
              }}>
              {t === "users" ? "ПОЛЬЗОВАТЕЛИ" : "ДОКУМЕНТЫ"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Вкладка пользователей */}
        {tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)" }}>
                ВСЕГО АККАУНТОВ: {users.length}
              </p>
              <button onClick={() => setAddUserOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded font-orbitron text-xs font-bold"
                style={{ background: "rgba(245,166,35,0.1)", border: "1px solid var(--sw-orange)", color: "var(--sw-orange)" }}>
                <Icon name="UserPlus" size={13} />
                ДОБАВИТЬ
              </button>
            </div>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="rounded p-4"
                  style={{ background: "rgba(13,20,32,0.8)", border: "1px solid var(--sw-border)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `${ROLE_COLOR[u.role]}15`, border: `1px solid ${ROLE_COLOR[u.role]}40` }}>
                        <Icon name={u.role === "admin" ? "Shield" : u.role === "pilot" ? "Plane" : "Wrench"} size={14}
                          style={{ color: ROLE_COLOR[u.role] }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-rajdhani text-sm font-semibold" style={{ color: "#c8dae8" }}>
                            {u.callsign}
                          </span>
                          <span className="font-mono-sw text-xs px-1.5 py-0.5 rounded"
                            style={{ background: `${ROLE_COLOR[u.role]}15`, color: ROLE_COLOR[u.role], border: `1px solid ${ROLE_COLOR[u.role]}30` }}>
                            {ROLE_LABELS[u.role]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)" }}>
                            {u.rank} · @{u.login}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {u.allowedSections.map(s => (
                            <span key={s} className="font-mono-sw text-xs px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.15)", color: "var(--sw-blue)" }}>
                              {SECTION_LABELS[s]}
                            </span>
                          ))}
                          {u.allowedSections.length === 0 && (
                            <span className="font-mono-sw text-xs" style={{ color: "#ef4444", opacity: 0.7 }}>НЕТ ДОСТУПА</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditUser(u)}
                        className="p-1.5 rounded transition-all"
                        style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>
                        <Icon name="Pencil" size={13} />
                      </button>
                      {u.role !== "admin" && (
                        <button onClick={() => setDeleteConfirm(u.id)}
                          className="p-1.5 rounded transition-all"
                          style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", background: "transparent" }}>
                          <Icon name="Trash2" size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка документов */}
        {tab === "docs" && (
          <div className="space-y-6">
            {ALL_SECTIONS.map(sectionId => (
              <div key={sectionId}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name={sections[sectionId].icon} size={15} style={{ color: "var(--sw-orange)" }} />
                    <span className="font-orbitron text-xs font-bold" style={{ color: "var(--sw-orange)" }}>
                      {SECTION_LABELS[sectionId].toUpperCase()}
                    </span>
                    <span className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)" }}>
                      ({sections[sectionId].items.length})
                    </span>
                  </div>
                  <button onClick={() => setAddDocSection(sectionId)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded font-orbitron text-xs font-bold"
                    style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", color: "var(--sw-orange)" }}>
                    <Icon name="Plus" size={12} />
                    ДОБАВИТЬ
                  </button>
                </div>
                <div className="space-y-1.5">
                  {sections[sectionId].items.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between rounded px-3 py-2"
                      style={{ background: "rgba(13,20,32,0.8)", border: "1px solid var(--sw-border)" }}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-mono-sw text-xs flex-shrink-0" style={{ color: "var(--sw-text-dim)" }}>[{doc.id}]</span>
                        <span className="font-rajdhani text-sm truncate" style={{ color: "#c8dae8" }}>{doc.title}</span>
                        <StatusBadge status={doc.status} />
                        {doc.fileName && <Icon name="Paperclip" size={11} style={{ color: "var(--sw-blue)", flexShrink: 0 }} />}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <button onClick={() => setEditDoc({ section: sectionId, doc })}
                          className="p-1 rounded" style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>
                          <Icon name="Pencil" size={12} />
                        </button>
                        <button onClick={() => deleteDoc(sectionId, doc.id)}
                          className="p-1 rounded" style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", background: "transparent" }}>
                          <Icon name="Trash2" size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модалки */}
      {addUserOpen && (
        <Modal title="ДОБАВИТЬ АККАУНТ" onClose={() => setAddUserOpen(false)}>
          <AddUserForm onDone={() => setAddUserOpen(false)} />
        </Modal>
      )}
      {editUser && (
        <Modal title="РЕДАКТИРОВАТЬ АККАУНТ" onClose={() => setEditUser(null)}>
          <EditUserForm user={editUser} onDone={() => setEditUser(null)} />
        </Modal>
      )}
      {deleteConfirm && (
        <Modal title="ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ" onClose={() => setDeleteConfirm(null)}>
          <div className="space-y-4">
            <p className="font-mono-sw text-sm" style={{ color: "var(--sw-text-dim)" }}>
              Удалить аккаунт <span style={{ color: "#ef4444" }}>{users.find(u => u.id === deleteConfirm)?.callsign}</span>? Это действие необратимо.
            </p>
            <div className="flex gap-2">
              <button onClick={() => deleteUser(deleteConfirm)}
                className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.5)", color: "#ef4444" }}>
                УДАЛИТЬ
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded font-orbitron text-xs font-bold"
                style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>
                ОТМЕНА
              </button>
            </div>
          </div>
        </Modal>
      )}
      {addDocSection && (
        <Modal title={`ДОБАВИТЬ ДОКУМЕНТ — ${SECTION_LABELS[addDocSection].toUpperCase()}`} onClose={() => setAddDocSection(null)}>
          <AddDocForm section={addDocSection} onDone={() => setAddDocSection(null)} />
        </Modal>
      )}
      {editDoc && (
        <Modal title={`РЕДАКТИРОВАТЬ — [${editDoc.doc.id}]`} onClose={() => setEditDoc(null)}>
          <EditDocForm section={editDoc.section} doc={editDoc.doc} onDone={() => setEditDoc(null)} />
        </Modal>
      )}

      <input type="file" ref={fileInputRef} className="hidden" />
      <input type="file" ref={editFileRef} className="hidden" />
    </div>
  );
}

// --- ГЛАВНЫЙ ТЕРМИНАЛ ---
function MainTerminal({
  user, onLogout, users, sections, onUsersChange, onSectionsChange
}: {
  user: User;
  onLogout: () => void;
  users: User[];
  sections: Record<Section, SectionData>;
  onUsersChange: (u: User[]) => void;
  onSectionsChange: (s: Record<Section, SectionData>) => void;
}) {
  const accessibleSections = user.role === "admin" ? ALL_SECTIONS : user.allowedSections;
  const [activeSection, setActiveSection] = useState<Section | "admin">(
    user.role === "admin" ? "admin" : (accessibleSections[0] || "docs-general")
  );
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

  const navItems: { id: Section | "admin"; icon: string; label: string }[] = [
    ...(user.role === "admin" ? [{ id: "admin" as const, icon: "Shield", label: "Панель администратора" }] : []),
    ...accessibleSections.map(id => ({
      id,
      icon: sections[id].icon,
      label: sections[id].title,
    }))
  ];

  const roleColor: Record<Role, string> = {
    admin: "#ef4444",
    pilot: "var(--sw-blue)",
    engineer: "var(--sw-orange)",
  };
  const roleLevel: Record<Role, string> = {
    admin: "ОМЕГА", pilot: "АЛЬФА", engineer: "БЕТА"
  };
  const roleWidth: Record<Role, string> = {
    admin: "100%", engineer: "70%", pilot: "50%"
  };

  const isDocSection = activeSection !== "admin";
  const section = isDocSection ? sections[activeSection as Section] : null;

  const filteredItems = section
    ? section.items.filter(item => {
        if (!item.allowedRoles.includes(user.role)) return false;
        return (
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : [];

  return (
    <div className="fixed inset-0 flex flex-col sw-scanline" style={{ background: "var(--sw-dark)" }}>
      {/* ШАПКА */}
      <header className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: "var(--sw-panel)", borderBottom: "1px solid var(--sw-border)", boxShadow: "0 2px 24px rgba(0,0,0,0.6)" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded"
            style={{ border: "1px solid var(--sw-orange)", background: "rgba(245,166,35,0.1)" }}>
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
                {user.callsign}
              </div>
              <div className="font-mono-sw text-xs" style={{ color: roleColor[user.role] }}>
                {user.rank}
              </div>
            </div>
            <button onClick={onLogout} className="p-1.5 rounded transition-all"
              style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", background: "transparent" }}
              title="Выход">
              <Icon name="LogOut" size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ТЕЛО */}
      <div className="flex flex-1 overflow-hidden">
        {/* САЙДБАР */}
        <aside className="w-56 flex-shrink-0 flex flex-col"
          style={{ background: "rgba(13,20,32,0.97)", borderRight: "1px solid var(--sw-border)" }}>
          <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--sw-border)" }}>
            <p className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)", letterSpacing: "0.15em" }}>
              РАЗДЕЛЫ БАЗЫ ДАННЫХ
            </p>
          </div>
          <nav className="flex-1 py-2 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.id}
                className={`nav-item px-3 py-3 flex items-center gap-2.5 ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}>
                <Icon name={item.icon} size={15}
                  style={{ color: activeSection === item.id ? "var(--sw-orange)" : "var(--sw-text-dim)", flexShrink: 0 }} />
                <span className="font-rajdhani text-sm font-medium leading-tight"
                  style={{ color: activeSection === item.id ? "var(--sw-orange)" : "#8fa8bf" }}>
                  {item.label}
                </span>
                {activeSection === item.id && (
                  <Icon name="ChevronRight" size={12} style={{ color: "var(--sw-orange)", marginLeft: "auto", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </nav>

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
        {activeSection === "admin" ? (
          <AdminPanel
            users={users}
            sections={sections}
            onUsersChange={onUsersChange}
            onSectionsChange={onSectionsChange}
          />
        ) : section ? (
          <main className="flex-1 flex flex-col overflow-hidden sw-grid-bg">
            <div className="px-6 py-3 flex items-center gap-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--sw-border)", background: "rgba(13,20,32,0.7)" }}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon name={section.icon} size={18} style={{ color: "var(--sw-orange)" }} />
                  <h2 className="font-orbitron text-sm font-bold tracking-wider" style={{ color: "var(--sw-orange)" }}>
                    {section.title.toUpperCase()}
                  </h2>
                </div>
                <p className="font-mono-sw text-xs mt-0.5" style={{ color: "var(--sw-text-dim)" }}>
                  В БАЗЕ: {section.items.filter(i => i.allowedRoles.includes(user.role)).length} · ОТОБРАЖЕНО: {filteredItems.length}
                </p>
              </div>
              <div className="relative w-60">
                <Icon name="Search" size={13} style={{
                  position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                  color: "var(--sw-text-dim)", pointerEvents: "none"
                }} />
                <input className="sw-input w-full pl-8 pr-3 py-2 rounded text-sm"
                  placeholder="поиск..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48" style={{ color: "var(--sw-text-dim)" }}>
                  <Icon name="SearchX" size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                  <p className="font-mono-sw text-sm">ДОКУМЕНТЫ НЕ НАЙДЕНЫ</p>
                </div>
              ) : filteredItems.map((item, i) => (
                <div key={item.id}
                  className="rounded p-4 cursor-pointer transition-all animate-fade-in"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    background: selectedItem === item.id ? "rgba(245,166,35,0.04)" : "rgba(13,20,32,0.8)",
                    border: selectedItem === item.id ? "1px solid var(--sw-orange)" : "1px solid var(--sw-border)",
                    boxShadow: selectedItem === item.id ? "var(--sw-glow-orange)" : "none",
                  }}
                  onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.2)" }}>
                        <Icon name={item.fileName ? "FileCheck" : "File"} size={13} style={{ color: "var(--sw-orange)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono-sw text-xs" style={{ color: "var(--sw-text-dim)" }}>[{item.id}]</span>
                          <span className="font-rajdhani text-sm font-semibold" style={{ color: "#c8dae8" }}>{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono-sw text-xs px-2 py-0.5 rounded"
                            style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)", color: "var(--sw-blue)" }}>
                            {item.tag}
                          </span>
                          <span className="font-mono-sw text-xs flex items-center gap-1" style={{ color: "var(--sw-text-dim)" }}>
                            <Icon name="Clock" size={10} />{item.date}
                          </span>
                          {item.fileName && (
                            <span className="font-mono-sw text-xs flex items-center gap-1" style={{ color: "var(--sw-blue)" }}>
                              <Icon name="Paperclip" size={10} />{item.fileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <StatusBadge status={item.status} />
                      <Icon name={selectedItem === item.id ? "ChevronUp" : "ChevronDown"} size={14}
                        style={{ color: "var(--sw-text-dim)" }} />
                    </div>
                  </div>

                  {selectedItem === item.id && (
                    <div className="mt-3 pt-3 animate-fade-in" style={{ borderTop: "1px solid var(--sw-border)" }}>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[
                          { label: "НОМЕР", value: item.id },
                          { label: "ОБНОВЛЁН", value: item.date },
                          { label: "СТАТУС", value: item.status },
                        ].map(f => (
                          <div key={f.label} className="rounded p-2"
                            style={{ background: "rgba(7,11,15,0.8)", border: "1px solid var(--sw-border)" }}>
                            <div className="font-mono-sw text-xs mb-0.5" style={{ color: "var(--sw-text-dim)" }}>{f.label}</div>
                            <div className="font-rajdhani text-sm font-semibold" style={{ color: "#c8dae8" }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {item.fileUrl ? (
                          <a href={item.fileUrl} download={item.fileName}
                            className="flex items-center gap-2 px-4 py-2 rounded font-orbitron text-xs font-bold"
                            style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent", textDecoration: "none" }}>
                            <Icon name="Download" size={12} />
                            СКАЧАТЬ
                          </a>
                        ) : (
                          <button disabled className="flex items-center gap-2 px-4 py-2 rounded font-orbitron text-xs font-bold opacity-30"
                            style={{ border: "1px solid var(--sw-border)", color: "var(--sw-text-dim)", background: "transparent" }}>
                            <Icon name="Download" size={12} />
                            НЕТ ФАЙЛА
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        ) : (
          <main className="flex-1 flex items-center justify-center sw-grid-bg">
            <div className="text-center" style={{ color: "var(--sw-text-dim)" }}>
              <Icon name="Lock" size={32} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
              <p className="font-mono-sw text-sm">НЕТ ДОСТУПНЫХ РАЗДЕЛОВ</p>
            </div>
          </main>
        )}
      </div>

      {/* НИЖНЯЯ СТРОКА */}
      <footer className="px-4 py-1.5 flex items-center justify-between"
        style={{ background: "rgba(7,11,15,0.97)", borderTop: "1px solid var(--sw-border)" }}>
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

// --- ХЕЛПЕРЫ ХРАНИЛИЩА ---
const LS_USERS = "ip7_users";
const LS_SECTIONS = "ip7_sections";

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (raw) return JSON.parse(raw) as User[];
  } catch (e) { console.warn(e); }
  return initUsers;
}

function loadSections(): Record<Section, SectionData> {
  try {
    const raw = localStorage.getItem(LS_SECTIONS);
    if (raw) return JSON.parse(raw) as Record<Section, SectionData>;
  } catch (e) { console.warn(e); }
  return initSections;
}

// --- КОРЕНЬ ---
export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [sections, setSections] = useState<Record<Section, SectionData>>(loadSections);

  const handleUsersChange = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem(LS_USERS, JSON.stringify(updated));
    setUser(prev => prev ? (updated.find(u => u.id === prev.id) || prev) : null);
  };

  const handleSectionsChange = (updated: Record<Section, SectionData>) => {
    setSections(updated);
    localStorage.setItem(LS_SECTIONS, JSON.stringify(updated));
  };

  if (!user) {
    return <LoginScreen onLogin={(u) => {
      const fresh = users.find(x => x.id === u.id);
      setUser(fresh || u);
    }} />;
  }

  return (
    <MainTerminal
      user={user}
      onLogout={() => setUser(null)}
      users={users}
      sections={sections}
      onUsersChange={handleUsersChange}
      onSectionsChange={handleSectionsChange}
    />
  );
}