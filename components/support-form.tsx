"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "./icons";

export const REASONS = [
  { value: "campaign", label: "Support this campaign" },
  { value: "mission", label: "Fund a mission or a unit" },
  { value: "partner", label: "Partner with CMAX Foundation" },
  { value: "recipient", label: "Propose a team, hospital or community" },
  { value: "press", label: "Press and institutional inquiries" },
  { value: "other", label: "Something else" },
] as const;

type Props = {
  reference?: { key: string; label: string } | null;
  defaultReason?: string;
};

type State = {
  status: "idle" | "sending" | "sent" | "error";
  message?: string;
};

export function SupportForm({ reference, defaultReason }: Props) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? ""))
      next.email = "Enter an email address we can reply to.";
    if (!data.reason) next.reason = "Choose the reason for your message.";
    if ((data.message ?? "").trim().length < 10)
      next.message = "Add a few words about what you have in mind.";
    setErrors(next);
    if (Object.keys(next).length) {
      // React has not committed aria-invalid yet; use the known invalid field.
      const first = form.elements.namedItem(Object.keys(next)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }

    setState({ status: "sending" });
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          reference: reference?.key ?? "",
          page: window.location.href,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok)
        throw new Error(json.error || "The message could not be sent.");
      setState({ status: "sent" });
      form.reset();
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ? err.message : "The message could not be sent.",
      });
    }
  }

  if (state.status === "sent") {
    return (
      <div
        role="status"
        className="rounded-[4px] border-[1.5px] border-ink p-6"
      >
        <p className="flex items-center gap-2 title text-[1.35rem]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange text-ink">
            <CheckIcon width={18} height={18} />
          </span>
          Message received.
        </p>
        <p className="mt-3 max-w-[50ch] text-ink-2">
          Thank you. CMAX Foundation will reply by email
          {reference ? ` with the details of ${reference.label}` : ""}. If your
          message is urgent, call the number in the footer.
        </p>
        <button
          type="button"
          onClick={() => setState({ status: "idle" })}
          className="u-link mt-5 font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field = (name: string) => ({
    "aria-invalid": errors[name] ? ("true" as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
      aria-busy={state.status === "sending"}
    >
      {reference && (
        <div className="rounded-[4px] bg-warm px-4 py-3 text-[0.95rem]">
          <span className="strip text-ink-3">Regarding</span>
          <p className="mt-1 font-medium">{reference.label}</p>
          <input type="hidden" name="referenceLabel" value={reference.label} />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-[0.95rem] font-medium"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={200}
            className="field"
            {...field("name")}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-[0.9rem] text-[#b3261e]">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[0.95rem] font-medium"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={200}
            className="field"
            {...field("email")}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-[0.9rem] text-[#b3261e]">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="reason"
          className="mb-1.5 block text-[0.95rem] font-medium"
        >
          Reason
        </label>
        <select
          id="reason"
          name="reason"
          defaultValue={defaultReason ?? ""}
          required
          className="field"
          {...field("reason")}
        >
          <option value="" disabled>
            Choose one
          </option>
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {errors.reason && (
          <p id="reason-error" className="mt-1.5 text-[0.9rem] text-[#b3261e]">
            {errors.reason}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="organization"
          className="mb-1.5 block text-[0.95rem] font-medium"
        >
          Organization{" "}
          <span className="font-normal text-ink-3">(optional)</span>
        </label>
        <input
          id="organization"
          name="organization"
          autoComplete="organization"
          maxLength={200}
          className="field"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-[0.95rem] font-medium"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          maxLength={5000}
          className="field"
          {...field("message")}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-[0.9rem] text-[#b3261e]">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden
      >
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-[4px] border border-[#b3261e] px-4 py-3 text-[0.95rem] text-[#8f1d17]"
        >
          {state.message} You can also write directly to the email address in
          the footer.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={state.status === "sending"}
          className="inline-flex items-center justify-center rounded-[4px] bg-orange px-6 py-3.5 text-[1.05rem] font-semibold text-ink transition-colors duration-150 hover:bg-orange-deep disabled:cursor-progress disabled:opacity-70"
        >
          {state.status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-[0.9rem] text-ink-3">
          No payment is requested. CMAX Foundation replies with the next step.
        </p>
      </div>
    </form>
  );
}
