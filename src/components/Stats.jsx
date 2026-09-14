import { stats } from "../data/content";
import Counter from "./ui/Counter";
import Reveal from "./ui/Reveal";
import "./stats.css";

export default function Stats() {
  return (
    <section className="stats on-navy" data-nav-theme="dark">
      <span className="stats__ghost" aria-hidden="true">
        Performance
      </span>
      <div className="stats__glow" aria-hidden="true" />

      <div className="shell stats__inner">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="stat">
            <span className="stat__value">
              <Counter to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
            </span>
            <span className="stat__label">{s.label}</span>
            <span className="stat__note">{s.note}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
