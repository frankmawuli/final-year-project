type Props = {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
};

export function DualRangeSlider({ min, max, minVal, maxVal, onMinChange, onMaxChange }: Props) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="relative h-5 flex items-center mb-1">
      <div className="absolute w-full h-[3px] bg-[#E5E7EB] rounded-full" />
      <div
        className="absolute h-[3px] bg-primary rounded-full"
        style={{ left: `${pct(minVal)}%`, right: `${100 - pct(maxVal)}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1000}
        value={minVal}
        onChange={(e) => onMinChange(Math.min(Number(e.target.value), maxVal - 1000))}
        className="absolute w-full h-[3px] appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.25)] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1000}
        value={maxVal}
        onChange={(e) => onMaxChange(Math.max(Number(e.target.value), minVal + 1000))}
        className="absolute w-full h-[3px] appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.25)] [&::-moz-range-thumb]:w-[14px] [&::-moz-range-thumb]:h-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}
