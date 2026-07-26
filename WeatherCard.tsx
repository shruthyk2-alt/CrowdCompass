import { CloudRain, Droplets, Sun, Wind, Gauge, CloudSun, Cloud } from "lucide-react";
import type { Weather } from "@/lib/simulate";

export function WeatherCard({ w }: { w: Weather }) {
  const Icon = w.condition === "Rain" ? CloudRain : w.condition === "Cloudy" ? Cloud : w.condition === "Humid" ? CloudSun : Sun;
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Weather</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold">{w.temp}°</span>
            <span className="text-sm text-muted-foreground">feels {w.feels}°</span>
          </div>
          <div className="mt-1 text-sm">{w.condition}</div>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-yellow/15 text-brand-yellow">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Stat icon={Droplets} label="Humidity" value={`${w.humidity}%`} />
        <Stat icon={Wind} label="Wind" value={`${w.wind} km/h`} />
        <Stat icon={CloudRain} label="Rain" value={`${w.rainChance}%`} />
        <Stat icon={Gauge} label="AQI" value={`${w.aqi}`} />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Sun; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card/40 p-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <div>
        <div className="text-[10px] text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
