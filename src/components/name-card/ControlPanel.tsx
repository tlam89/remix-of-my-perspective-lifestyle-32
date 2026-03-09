import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import type { Person, CardConfig } from "./types";

interface ControlPanelProps {
  person: Person;
  config: CardConfig;
  onPersonChange: (updated: Person) => void;
  onConfigChange: (updated: CardConfig) => void;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-5 mb-2.5 pb-1.5 border-b border-border">
      <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
    </div>
  );
}

export default function ControlPanel({
  person,
  config,
  onPersonChange,
  onConfigChange,
}: ControlPanelProps) {
  const textField = (label: string, field: keyof Person) => (
    <div className="mb-3.5">
      <Label className="text-xs">{label}</Label>
      <Input
        value={person[field] as string}
        onChange={(e) => onPersonChange({ ...person, [field]: e.target.value })}
        className="mt-1 h-8 text-sm"
      />
    </div>
  );

  const slider = (
    label: string,
    configKey: keyof CardConfig,
    min: number,
    max: number,
    unit = "px"
  ) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <Label className="text-xs">{label}</Label>
        <span className="text-[11px] text-primary font-semibold tabular-nums">
          {config[configKey]}
          {unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[config[configKey] as number]}
        onValueChange={([val]) =>
          onConfigChange({ ...config, [configKey]: val })
        }
      />
    </div>
  );

  return (
    <div>
      <SectionHeader title="Nội dung văn bản" />
      {textField("Chức danh trong ban", "chucDanh")}
      {textField("Họ tên & Học vị", "name")}
      {textField("Chức vụ công tác", "chucVu")}

      <SectionHeader title="Cỡ chữ" />
      {slider("Chức danh", "fontSizeRole", 24, 72)}
      {slider("Họ tên", "fontSizeName", 28, 80)}
      {slider("Chức vụ", "fontSizePos", 20, 64)}

      <SectionHeader title="Khoảng cách & Vị trí" />
      {slider("Zone Top", "zoneTop", 400, 650)}
      {slider("Zone Bottom", "zoneBottom", 700, 1000)}
      {slider("Gap: Chức danh → Tên", "gapRoleName", 0, 80)}
      {slider("Gap: Tên → Chức vụ", "gapNamePos", 0, 80)}

      <SectionHeader title="Màu chữ" />
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          value={config.textColor}
          onChange={(e) =>
            onConfigChange({ ...config, textColor: e.target.value })
          }
          className="w-9 h-8 border-none cursor-pointer rounded p-0"
        />
        <span className="text-xs text-muted-foreground font-mono">
          {config.textColor}
        </span>
      </div>
    </div>
  );
}
