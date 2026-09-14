import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { brand } from "../data/content";
import SplitText from "./ui/SplitText";
import Reveal from "./ui/Reveal";
import Wordmark from "./ui/Wordmark";
import Magnetic from "./ui/Magnetic";
import "./contact.css";

/**
 * Site statique : les demandes passent par FormSubmit (gratuit, sans compte),
 * qui les réexpédie par courriel à l'adresse de la marque. Au tout premier
 * envoi, FormSubmit écrit à cette adresse pour faire activer le formulaire.
 * Passer la constante à `null` rebascule sur un simple lien `mailto:`.
 */
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${brand.email}`;

const fields = [
  { name: "nom", label: "Nom & prénom", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Adresse e-mail", type: "email", autoComplete: "email", required: true },
  { name: "telephone", label: "Téléphone", type: "tel", autoComplete: "tel" },
  { name: "adresse", label: "Adresse du bien", type: "text", autoComplete: "street-address" },
];

export default function Contact() {
  const [status, setStatus] = useState("idle");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    const { _honey, ...data } = Object.fromEntries(new FormData(form).entries());

    // Champ invisible : seul un robot le remplit. On le laisse croire que c'est parti.
    if (_honey) {
      setStatus("done");
      return;
    }

    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            ...data,
            _subject: `Demande d'estimation — ${data.nom || "site Urban Key"}`,
            _template: "table",
            _captcha: "false",
          }),
        });
        const reply = await res.json().catch(() => ({}));
        if (!res.ok || String(reply.success) === "false") throw new Error(reply.message);
      } else {
        const body = Object.entries(data)
          .map(([k, v]) => `${k} : ${v}`)
          .join("\n");
        window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
          "Demande d'estimation — Urban Key",
        )}&body=${encodeURIComponent(body)}`;
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="contact__glow" aria-hidden="true" />
      <div className="shell contact__grid">
        <div className="contact__aside">
          <Reveal>
            <span className="eyebrow">Contact</span>
          </Reveal>
          <SplitText
            as="h2"
            className="contact__title"
            lines={[["Confiez-nous"], ["votre", { text: "clé.", gold: true, italic: true }]]}
          />
          <Reveal delay={0.15}>
            <p className="lead contact__lead">
              Visite, étude de rentabilité, réponse à une question précise : écrivez-nous et
              nous revenons vers vous sous deux heures ouvrées.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="contact__details">
            <div>
              <span className="contact__detail-label">Téléphone</span>
              <a className="link-underline" href={brand.phoneHref}>{brand.phone}</a>
            </div>
            <div>
              <span className="contact__detail-label">E-mail</span>
              <a className="link-underline" href={`mailto:${brand.email}`}>{brand.email}</a>
            </div>
            <div>
              <span className="contact__detail-label">Bureau</span>
              <p>{brand.address}</p>
            </div>
            <div>
              <span className="contact__detail-label">Horaires</span>
              <p>{brand.hours}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="contact__form-wrap">
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div
                className="contact__done"
                key="done"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Wordmark variant="key" className="contact__done-key" />
                <h3>{FORM_ENDPOINT ? "Votre demande est partie." : "Votre message est prêt."}</h3>
                <p>
                  {FORM_ENDPOINT
                    ? "Un gestionnaire Urban Key vous rappelle sous deux heures ouvrées pour convenir d'une visite."
                    : "Nous l'avons ouvert dans votre messagerie : il ne reste qu'à l'envoyer. Un gestionnaire vous rappelle ensuite sous deux heures ouvrées."}
                </p>
                <button className="btn btn--ghost" onClick={() => setStatus("idle")}>
                  Envoyer une autre demande
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="contact__form"
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
              >
                <div className="contact__fields">
                  {fields.map((f, i) => (
                    <motion.div
                      className="field"
                      key={f.name}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <input
                        id={f.name}
                        name={f.name}
                        type={f.type}
                        autoComplete={f.autoComplete}
                        required={f.required}
                        placeholder=" "
                      />
                      <label htmlFor={f.name}>
                        {f.label}
                        {f.required && <span aria-hidden="true"> *</span>}
                      </label>
                      <span className="field__line" />
                    </motion.div>
                  ))}

                  <motion.div
                    className="field field--full"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.49, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <textarea id="message" name="message" rows={4} placeholder=" " />
                    <label htmlFor="message">Votre projet</label>
                    <span className="field__line" />
                  </motion.div>
                </div>

                <input
                  className="contact__honey"
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="contact__submit">
                  <Magnetic strength={0.24}>
                    <button className="btn" type="submit" disabled={status === "sending"}>
                      {status === "sending" ? "Envoi…" : "Demander mon estimation"}
                      <span className="btn__arrow">→</span>
                    </button>
                  </Magnetic>
                  <p className="contact__legal">
                    Vos informations restent confidentielles et ne servent qu'à l'étude de votre bien.
                  </p>
                </div>

                {status === "error" && (
                  <p className="contact__error" role="alert">
                    L'envoi n'a pas abouti. Réessayez dans un instant, ou joignez-nous directement :{" "}
                    <a className="link-underline" href={brand.phoneHref}>{brand.phone}</a> ·{" "}
                    <a className="link-underline" href={`mailto:${brand.email}`}>{brand.email}</a>
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
