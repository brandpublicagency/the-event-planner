import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedWeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

const sunRays = [0, 45, 90, 135, 180, 225, 270, 315];

const SunIcon = ({ size = 32 }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Rays */}
    {sunRays.map((angle, i) => (
      <motion.line
        key={i}
        x1="24" y1="6" x2="24" y2="2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        transform={`rotate(${angle} 24 24)`}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
    {/* Sun body */}
    <motion.circle
      cx="24" cy="24" r="8"
      fill="hsl(45, 93%, 58%)"
      stroke="hsl(40, 90%, 50%)"
      strokeWidth="1"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

const CloudIcon = ({ size = 32 }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <motion.g
      animate={{ x: [0, 2, 0, -2, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <ellipse cx="20" cy="26" rx="10" ry="7" fill="currentColor" opacity="0.25" />
      <ellipse cx="28" cy="24" rx="12" ry="8" fill="currentColor" opacity="0.35" />
      <ellipse cx="24" cy="28" rx="14" ry="7" fill="currentColor" opacity="0.2" />
    </motion.g>
  </motion.svg>
);

const RainIcon = ({ size = 32 }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Cloud */}
    <g>
      <ellipse cx="20" cy="18" rx="9" ry="6" fill="currentColor" opacity="0.3" />
      <ellipse cx="28" cy="16" rx="11" ry="7" fill="currentColor" opacity="0.35" />
    </g>
    {/* Rain drops */}
    {[14, 22, 30].map((x, i) => (
      <motion.line
        key={i}
        x1={x} y1="28" x2={x - 2} y2="36"
        stroke="hsl(210, 80%, 60%)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: [0, 6, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
      />
    ))}
  </motion.svg>
);

const SnowIcon = ({ size = 32 }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Cloud */}
    <g>
      <ellipse cx="20" cy="16" rx="9" ry="6" fill="currentColor" opacity="0.3" />
      <ellipse cx="28" cy="14" rx="11" ry="7" fill="currentColor" opacity="0.35" />
    </g>
    {/* Snowflakes */}
    {[
      { cx: 16, delay: 0 },
      { cx: 24, delay: 0.4 },
      { cx: 32, delay: 0.8 },
    ].map((flake, i) => (
      <motion.circle
        key={i}
        cx={flake.cx}
        cy="30"
        r="2"
        fill="currentColor"
        opacity="0.5"
        animate={{ y: [0, 10, 0], opacity: [0, 0.7, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: flake.delay }}
      />
    ))}
  </motion.svg>
);

const ThunderIcon = ({ size = 32 }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Cloud */}
    <g>
      <ellipse cx="20" cy="16" rx="9" ry="6" fill="currentColor" opacity="0.35" />
      <ellipse cx="28" cy="14" rx="11" ry="7" fill="currentColor" opacity="0.4" />
    </g>
    {/* Lightning bolt */}
    <motion.path
      d="M26 22 L22 30 L26 30 L22 40"
      stroke="hsl(45, 93%, 58%)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      animate={{ opacity: [1, 0.2, 1, 0.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Rain */}
    {[16, 32].map((x, i) => (
      <motion.line
        key={i}
        x1={x} y1="26" x2={x - 2} y2="34"
        stroke="hsl(210, 80%, 60%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ y: [0, 5, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.5 }}
      />
    ))}
  </motion.svg>
);

const PartlyCloudyIcon = ({ size = 32 }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Sun behind */}
    <motion.circle
      cx="18" cy="18" r="7"
      fill="hsl(45, 93%, 58%)"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Cloud in front */}
    <motion.g
      animate={{ x: [0, 1.5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <ellipse cx="28" cy="26" rx="10" ry="6" fill="currentColor" opacity="0.3" />
      <ellipse cx="24" cy="28" rx="12" ry="7" fill="currentColor" opacity="0.25" />
    </motion.g>
  </motion.svg>
);

const FogIcon = ({ size = 32 }: { size: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {[18, 24, 30].map((y, i) => (
      <motion.line
        key={i}
        x1="10" y1={y} x2="38" y2={y}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
        animate={{ x: [0, 3, 0, -3, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
      />
    ))}
  </motion.svg>
);

function getConditionType(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes('thunder') || c.includes('storm')) return 'thunder';
  if (c.includes('snow') || c.includes('sleet') || c.includes('blizzard')) return 'snow';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'rain';
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return 'fog';
  if (c.includes('partly') || c.includes('scattered') || c.includes('broken') || c.includes('few clouds')) return 'partly_cloudy';
  if (c.includes('cloud') || c.includes('overcast')) return 'cloudy';
  if (c.includes('clear') || c.includes('sunny')) return 'clear';
  return 'partly_cloudy';
}

const AnimatedWeatherIcon = ({ condition, size = 32, className }: AnimatedWeatherIconProps) => {
  const type = getConditionType(condition);

  return (
    <div className={cn("text-muted-foreground", className)}>
      {type === 'clear' && <SunIcon size={size} />}
      {type === 'cloudy' && <CloudIcon size={size} />}
      {type === 'partly_cloudy' && <PartlyCloudyIcon size={size} />}
      {type === 'rain' && <RainIcon size={size} />}
      {type === 'snow' && <SnowIcon size={size} />}
      {type === 'thunder' && <ThunderIcon size={size} />}
      {type === 'fog' && <FogIcon size={size} />}
    </div>
  );
};

export default AnimatedWeatherIcon;
