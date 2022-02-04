import {useEffect, useState} from "react";
import format from "date-fns/format";

const defaultOptionValue = 300;
const options = [
  { label: "自動更新：5分毎", value: "300" },
  { label: "自動更新：1時間毎", value: "3600" },
  { label: "自動更新：24時間毎", value: "86400" },
  { label: "自動更新しない", value: "0" },
];
export default function AutoFeedUpdater(
  { onAutoUpdate } : { onAutoUpdate: () => void; }
) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState<number>(defaultOptionValue);

  const handleChange = (selectedOption) => {
    if (selectedOption.target.value.length > 0) {
      const interval = parseInt(selectedOption.target.value, 10);
      if (interval >= 300) {
        setAutoUpdateInterval(interval);
      } else {
        setAutoUpdateInterval(0);
      }
    } else {
      setAutoUpdateInterval(0);
    }
  };

  useEffect(() => {
    if (autoUpdateInterval > 0) {
      const timer = setInterval(async () => {
        console.log('AutoFeedUpdate:', new Date());
        await onAutoUpdate();
        setLastUpdatedAt(new Date());
      }, autoUpdateInterval * 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [autoUpdateInterval]);

  return (
    <div className="mb-2">
      <select onChange={handleChange}>
        { options.map(o => (
          <option value={o.value} key={o.label}>
            {o.label}
          </option>
        )) }
      </select>

      {
        lastUpdatedAt != null ? (
          <div>{format(lastUpdatedAt, "yyyy-MM-dd HH:mm")}</div>
        ) : null
      }
    </div>
  );
}