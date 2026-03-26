import React from 'react';

const AVATARS: Record<number, React.FC<{ size?: number; glow?: string }>> = {};

const makeAvatar = (paths: string, bg: string) => {
  const Comp: React.FC<{ size?: number; glow?: string }> = ({ size = 48, glow }) => (
    <div
      className="rounded-full flex items-center justify-center relative overflow-hidden"
      style={{
        width: size,
        height: size,
        background: bg,
        boxShadow: glow ? `0 0 20px ${glow}` : undefined,
      }}
    >
      <svg viewBox="0 0 100 100" width={size * 0.7} height={size * 0.7}>
        <g dangerouslySetInnerHTML={{ __html: paths }} />
      </svg>
    </div>
  );
  return Comp;
};

AVATARS[1] = makeAvatar(
  `<circle cx="50" cy="38" r="20" fill="#FFD3B6"/><circle cx="42" cy="34" r="3" fill="#333"/><circle cx="58" cy="34" r="3" fill="#333"/><path d="M44 44 Q50 50 56 44" stroke="#333" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M30 22 Q50 8 70 22" fill="#6B4226" stroke="none"/>`,
  'linear-gradient(135deg, #FFE4CC, #FFD3B6)'
);

AVATARS[2] = makeAvatar(
  `<circle cx="50" cy="38" r="20" fill="#D4A88C"/><circle cx="42" cy="34" r="3" fill="#333"/><circle cx="58" cy="34" r="3" fill="#333"/><path d="M42 44 Q50 52 58 44" stroke="#333" fill="none" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="15" r="22" fill="#2C2C2C" clip-path="inset(0 0 50% 0)"/>`,
  'linear-gradient(135deg, #E8D5C4, #D4A88C)'
);

AVATARS[3] = makeAvatar(
  `<circle cx="50" cy="38" r="20" fill="#FFDCB5"/><circle cx="43" cy="33" r="2.5" fill="#333"/><circle cx="57" cy="33" r="2.5" fill="#333"/><path d="M45 43 Q50 47 55 43" stroke="#E74C3C" fill="none" stroke-width="2" stroke-linecap="round"/><rect x="30" y="18" width="40" height="12" rx="6" fill="#FF6B6B"/>`,
  'linear-gradient(135deg, #FFE8D6, #FFDCB5)'
);

AVATARS[4] = makeAvatar(
  `<circle cx="50" cy="40" r="18" fill="#C49A7C"/><circle cx="44" cy="36" r="2.5" fill="#333"/><circle cx="56" cy="36" r="2.5" fill="#333"/><path d="M46 46 L54 46" stroke="#333" stroke-width="2" stroke-linecap="round"/><path d="M28 30 Q38 10 50 15 Q62 10 72 30" fill="#4A2C0F" stroke="none"/>`,
  'linear-gradient(135deg, #DFC4AA, #C49A7C)'
);

AVATARS[5] = makeAvatar(
  `<circle cx="50" cy="38" r="20" fill="#FFE0BD"/><line x1="40" y1="33" x2="46" y2="33" stroke="#333" stroke-width="3" stroke-linecap="round"/><line x1="54" y1="33" x2="60" y2="33" stroke="#333" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="44" r="4" fill="#E74C3C"/><path d="M32 24 Q50 12 68 24" fill="#FFB347" stroke="none"/>`,
  'linear-gradient(135deg, #FFF0DB, #FFE0BD)'
);

AVATARS[6] = makeAvatar(
  `<circle cx="50" cy="38" r="20" fill="#E8C9A0"/><circle cx="43" cy="35" r="3" fill="#333"/><circle cx="57" cy="35" r="3" fill="#333"/><path d="M40 44 Q50 54 60 44" stroke="#333" fill="none" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="50" cy="18" rx="24" ry="10" fill="#8B5E3C"/>`,
  'linear-gradient(135deg, #F0DCC0, #E8C9A0)'
);

export default AVATARS;
