"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LuSearch } from "react-icons/lu";
import { Badge } from "@/components/ui/Badge";
import { formatAmount, formatPhone } from "@/lib/format";
import { IS_DEMO, listOrders, listTickets, type OrderRow, type OrderStatus, type TicketRow, type TicketStatus } from "./api";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Porto-Novo" });
const when = (iso: string) => dateFormat.format(new Date(iso));

const orderStatus: Record<OrderStatus, { label: string; tone: "valide" | "orange" | "alerte" }> = {
  PAID: { label: "Payée", tone: "valide" },
  PENDING: { label: "En attente", tone: "orange" },
  CANCELLED: { label: "Annulée", tone: "alerte" },
};

const ticketStatus: Record<TicketStatus, { label: string; tone: "valide" | "orange" | "alerte" | "neutre" }> = {
  VALID: { label: "Valide", tone: "valide" },
  PENDING: { label: "En attente", tone: "orange" },
  USED: { label: "Utilisé", tone: "neutre" },
  CANCELLED: { label: "Annulé", tone: "alerte" },
};

/** Recherche + filtre de statut + résultat, partagés par les commandes et les billets. */
function useFilteredList<T, S extends string>(fetcher: (q: { query: string; status: S | "ALL" }) => Promise<T[]>) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<S | "ALL">("ALL");
  const [rows, setRows] = useState<T[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Petite attente pendant la frappe pour ne pas interroger le serveur à chaque lettre
    const timer = setTimeout(() => {
      fetcher({ query, status })
        .then((r) => {
          if (cancelled) return;
          setRows(r);
          setError(false);
        })
        .catch(() => !cancelled && setError(true));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, status, fetcher]);

  return { query, setQuery, status, setStatus, rows, error };
}

function Toolbar<S extends string>({
  title,
  placeholder,
  query,
  onQuery,
  status,
  onStatus,
  options,
  count,
}: {
  title: string;
  placeholder: string;
  query: string;
  onQuery: (v: string) => void;
  status: S | "ALL";
  onStatus: (v: S | "ALL") => void;
  options: { value: S | "ALL"; label: string }[];
  count: number | null;
}) {
  return (
    <>
      <h1 className="font-display text-[clamp(2.4rem,8vw,3.6rem)] font-black uppercase leading-none">{title}</h1>
      <p className="mt-2 text-sable">
        {count === null ? "Chargement…" : `${count} résultat${count > 1 ? "s" : ""}`}
        {IS_DEMO && " · données de démonstration"}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher</span>
          <LuSearch className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-sable" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={placeholder}
            className="min-h-12 w-full border border-(--line) bg-brun-soft pl-11 pr-4 text-[1rem] text-(--fg) placeholder:text-(--fg)/40 focus:border-(--accent) focus:outline-none"
          />
        </label>
        <label className="sm:w-52">
          <span className="sr-only">Statut</span>
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value as S | "ALL")}
            className="min-h-12 w-full border border-(--line) bg-brun-soft px-4 text-[1rem] text-(--fg) focus:border-(--accent) focus:outline-none"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}

function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty: boolean }) {
  return (
    <div className="mt-6 overflow-x-auto border border-(--line)">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="bg-brun-soft text-[0.66rem] uppercase tracking-[0.16em] text-sable">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-(--line)">{children}</tbody>
      </table>
      {empty && <p className="px-4 py-10 text-center text-sable">Aucun résultat pour cette recherche.</p>}
    </div>
  );
}

export function OrdersView() {
  const { query, setQuery, status, setStatus, rows, error } = useFilteredList<OrderRow, OrderStatus>(listOrders);
  return (
    <>
      <Toolbar
        title="Commandes"
        placeholder="Référence, nom, e-mail, téléphone, paiement"
        query={query}
        onQuery={setQuery}
        status={status}
        onStatus={setStatus}
        count={rows?.length ?? null}
        options={[
          { value: "ALL", label: "Tous les statuts" },
          { value: "PAID", label: "Payées" },
          { value: "PENDING", label: "En attente" },
          { value: "CANCELLED", label: "Annulées" },
        ]}
      />
      {error && (
        <p role="alert" className="mt-6 text-sm font-medium text-alerte">
          La liste n’a pas pu être chargée.
        </p>
      )}
      {rows && (
        <Table head={["Référence", "Date", "Client", "Commande", "Montant", "Paiement", "Statut"]} empty={rows.length === 0}>
          {rows.map((o) => (
            <tr key={o.reference}>
              <td className="px-4 py-3 font-mono text-[0.85rem]">{o.reference}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sable">{when(o.createdAt)}</td>
              <td className="px-4 py-3">
                <p className="font-semibold">{o.buyerName}</p>
                <p className="text-xs text-sable">
                  {o.email} · {formatPhone(o.phone)}
                </p>
              </td>
              <td className="px-4 py-3">{o.summary}</td>
              <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums">{formatAmount(o.total)} FCFA</td>
              <td className="px-4 py-3 font-mono text-[0.8rem] text-sable">{o.paymentReference}</td>
              <td className="px-4 py-3">
                <Badge tone={orderStatus[o.status].tone}>{orderStatus[o.status].label}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}

export function TicketsView() {
  const { query, setQuery, status, setStatus, rows, error } = useFilteredList<TicketRow, TicketStatus>(listTickets);
  return (
    <>
      <Toolbar
        title="Billets"
        placeholder="Code du billet (GALA-…), nom, e-mail, commande"
        query={query}
        onQuery={setQuery}
        status={status}
        onStatus={setStatus}
        count={rows?.length ?? null}
        options={[
          { value: "ALL", label: "Tous les statuts" },
          { value: "VALID", label: "Valides" },
          { value: "USED", label: "Utilisés" },
          { value: "PENDING", label: "En attente" },
          { value: "CANCELLED", label: "Annulés" },
        ]}
      />
      {error && (
        <p role="alert" className="mt-6 text-sm font-medium text-alerte">
          La liste n’a pas pu être chargée.
        </p>
      )}
      {rows && (
        <Table head={["Code du billet", "Pass", "Titulaires", "Acheteur", "Commande", "Créé le", "Utilisé le", "Statut"]} empty={rows.length === 0}>
          {rows.map((t) => (
            <tr key={t.number}>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[0.9rem] font-semibold text-ivoire">{t.number}</td>
              <td className="whitespace-nowrap px-4 py-3">{t.passName}</td>
              <td className="px-4 py-3">
                {t.holders.map((h) => (
                  <p key={h} className="font-semibold">
                    {h}
                  </p>
                ))}
              </td>
              <td className="px-4 py-3 text-sable">{t.buyerEmail}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[0.8rem] text-sable">{t.orderReference}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sable">{when(t.createdAt)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sable">{t.usedAt ? when(t.usedAt) : "—"}</td>
              <td className="px-4 py-3">
                <Badge tone={ticketStatus[t.status].tone}>{ticketStatus[t.status].label}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
