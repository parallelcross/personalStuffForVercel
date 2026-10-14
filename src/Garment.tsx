import { useId } from "react";
export type Kind =
  | "jacket"
  | "polo"
  | "shirt"
  | "blouse"
  | "henley"
  | "trousers"
  | "skirt"
  | "dress";
export function Garment({
  kind,
  color,
  className = "",
}: {
  kind: string;
  color: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const bottom = kind === "trousers" || kind === "skirt";
  const shape =
    kind === "dress"
      ? "M66 19 80 15 Q90 33 100 15 L114 19 120 60 111 92 Q118 136 140 218 Q90 234 40 218 Q62 136 69 92 L60 60Z"
      : kind === "trousers"
        ? "M49 23 131 23 136 218 101 220 89 92 79 220 43 218Z"
        : kind === "skirt"
          ? "M59 32 121 32 147 214 Q90 231 33 214Z"
          : "M61 29 77 22 Q90 34 103 22 L119 29 153 55 139 119 120 113 116 75 120 181 Q90 188 60 181 L64 75 60 113 41 119 27 55Z";
  return (
    <svg
      className={`garment ${className}`}
      viewBox="0 0 180 240"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-shade`}>
          <stop stopColor="#fff" stopOpacity=".16" />
          <stop offset=".3" stopColor="#fff" stopOpacity="0" />
          <stop offset=".65" stopColor="#000" stopOpacity=".09" />
          <stop offset="1" stopColor="#fff" stopOpacity=".05" />
        </linearGradient>
        <pattern
          id={`${id}-weave`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 0V4M0 0H4"
            stroke="#fff"
            strokeOpacity=".10"
            strokeWidth=".6"
          />
        </pattern>
      </defs>
      <g
        stroke="#25291f"
        strokeOpacity=".25"
        strokeWidth=".8"
        strokeLinejoin="round"
      >
        <path d={shape} fill={color} />
        <path d={shape} fill={`url(#${id}-shade)`} />
        <path d={shape} fill={`url(#${id}-weave)`} />
        {kind === "trousers" ? (
          <>
            <path
              d="M49 33H131M90 33V83L79 94M53 39Q65 56 48 65M126 39Q114 56 133 65M60 85 56 208M117 85 121 208"
              fill="none"
            />
            <path d="M44 210 78 212M102 212 135 210" fill="none" />
            <circle cx="91" cy="28" r="1.5" fill="#806e52" />
          </>
        ) : kind === "skirt" ? (
          <>
            <path
              d="M58 40H122M89 41V215M64 47 50 207M116 47 130 207"
              fill="none"
            />
            <path d="M35 207Q90 224 145 207" fill="none" />
          </>
        ) : kind === "dress" ? (
          <>
            <path
              d="M68 91Q90 99 112 91M75 110 57 212M105 110 124 212M66 25Q90 53 114 25M43 211Q90 227 137 211"
              fill="none"
              opacity=".7"
            />
          </>
        ) : (
          <>
            <path
              d="M62 174Q90 180 119 174M42 111 60 105M121 105 140 111M63 38 53 83M117 38 127 83"
              fill="none"
            />
            {kind !== "henley" && (
              <path
                d="M77 22 67 31 78 50 90 35 102 50 113 31 103 22 90 35Z"
                fill={color}
              />
            )}
            <path
              d={`M90 36V${kind === "jacket" || kind === "shirt" || kind === "blouse" ? "180" : "72"}`}
              fill="none"
            />
            {[
              51,
              64,
              ...(kind === "jacket" || kind === "shirt" || kind === "blouse"
                ? [86, 110, 134, 158]
                : []),
            ].map((y) => (
              <circle
                key={y}
                cx="92"
                cy={y}
                r="1.5"
                fill="#d6c4a5"
                strokeOpacity=".4"
              />
            ))}
            {kind === "jacket" && (
              <>
                <path
                  d="M67 115H83V140H67ZM99 115H115V140H99ZM99 67H113V87H99Z"
                  fill="none"
                />
                <path d="M78 50 83 179M102 50 98 179" fill="none" />
              </>
            )}
            {kind === "polo" &&
              Array.from({ length: 6 }, (_, i) => (
                <path
                  key={i}
                  d={`M${68 + i * 8} 80q-4 6 0 12t0 12t0 12t0 12t0 12t0 12t0 12`}
                  fill="none"
                  stroke="#fff"
                  strokeOpacity=".17"
                />
              ))}
            {kind === "blouse" && (
              <path
                d="M70 54 68 165M110 54 112 165"
                fill="none"
                strokeDasharray="2 3"
                strokeWidth="3"
                stroke="#fff"
                strokeOpacity=".5"
              />
            )}
          </>
        )}
      </g>
      {bottom && (
        <path d="M70 26v7m40-7v7" stroke="#25291f" strokeOpacity=".4" />
      )}
    </svg>
  );
}
export function Outfit({
  member,
  index,
}: {
  member: {
    topColor: string;
    topKind: string;
    bottomColor: string;
    shape: string;
    layer: boolean;
  };
  index: number;
}) {
  return (
    <div className={`outfit outfit-${member.shape}`}>
      <Garment
        kind={member.topKind}
        color={member.layer ? "#f0e5d4" : member.topColor}
        className="outfit-top"
      />
      {member.shape !== "dress" && (
        <Garment
          kind={member.shape}
          color={member.bottomColor}
          className="outfit-bottom"
        />
      )}
      {member.layer && (
        <Garment
          kind="jacket"
          color={member.topColor}
          className="outfit-layer"
        />
      )}
      <svg className="outfit-shoes" viewBox="0 0 120 32" aria-hidden="true">
        <path
          d="M10 5 29 3 37 19Q52 22 50 28H6Q1 20 10 5M76 5 95 3 103 19Q118 22 116 28H72Q67 20 76 5"
          fill={index === 2 ? "#e6ddcc" : "#73543e"}
          stroke="#40352b"
          strokeWidth=".8"
        />
        <path
          d="M5 25H50M71 25H116M20 13l10-2m-9 6 11-2m54-2 10-2m-9 6 11-2"
          fill="none"
          stroke="#c1ab8c"
          strokeWidth="1.3"
        />
      </svg>
    </div>
  );
}
