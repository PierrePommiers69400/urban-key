const common = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const shapes = {
  key: (
    <>
      <circle cx="15" cy="24" r="8.5" />
      <circle cx="15" cy="24" r="3.4" />
      <path d="M23.5 24H41" />
      <path d="M34 24v6.5M39 24v4.5" />
    </>
  ),
  door: (
    <>
      <path d="M12 42V10a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v32" />
      <path d="M7 42h34" />
      <circle cx="30.5" cy="26" r="1.4" />
      <path d="M18 16h12" />
    </>
  ),
  sparkle: (
    <>
      <path d="M24 7c1.6 8.6 4.8 11.8 13.4 13.4C28.8 22 25.6 25.2 24 33.8c-1.6-8.6-4.8-11.8-13.4-13.4C19.2 18.8 22.4 15.6 24 7Z" />
      <path d="M35.5 30c.8 4.3 2.4 5.9 6.7 6.7-4.3.8-5.9 2.4-6.7 6.7-.8-4.3-2.4-5.9-6.7-6.7 4.3-.8 5.9-2.4 6.7-6.7Z" />
    </>
  ),
  linen: (
    <>
      <path d="M8 18c4-6 8-6 12 0s8 6 12 0 8-6 8 0v20c0 2-1.6 3.6-3.6 3.6H11.6C9.6 41.6 8 40 8 38V18Z" />
      <path d="M8 27c4-6 8-6 12 0s8 6 12 0 8-6 8 0" />
    </>
  ),
  chart: (
    <>
      <path d="M8 40h32" />
      <path d="M13 40V27M22 40V18M31 40V23M40 40V11" />
      <path d="M11 20l9-8 8 5 12-11" />
    </>
  ),
  tools: (
    <>
      <path d="M18 12.5a7.5 7.5 0 0 0-9.6 9.9l-.9.9a3 3 0 0 0 0 4.2l3 3a3 3 0 0 0 4.2 0l.9-.9a7.5 7.5 0 0 0 9.9-9.6" />
      <path d="M28 20l12 12a4 4 0 0 1-5.6 5.6l-12-12" />
      <path d="M30 8l-6 6 4 4 6-6 6-2-2-6-8 4Z" />
    </>
  ),
};

export default function Icon({ name, size = 48, className = "" }) {
  return (
    <svg {...common} width={size} height={size} className={className}>
      {shapes[name] ?? shapes.key}
    </svg>
  );
}
