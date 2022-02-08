import {useEffect, useState} from "react";
import format from "date-fns/format";

const defaultOptionValue = 3600;
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
  const [remainingSeconds, setRemainingSeconds] = useState<number>(defaultOptionValue);

  const handleChange = (selectedOption) => {
    if (selectedOption.target.value.length > 0) {
      const interval = parseInt(selectedOption.target.value, 10);
      if (interval >= 300) {
        setAutoUpdateInterval(interval);
        setRemainingSeconds(interval);
      } else {
        setAutoUpdateInterval(0);
        setRemainingSeconds(-1);
      }
    } else {
      setAutoUpdateInterval(0);
      setRemainingSeconds(-1);
    }
  };

  useEffect(() => {
    if (autoUpdateInterval > 0) {
      const autoUpdateTimer = setInterval(async () => {
        console.log('AutoFeedUpdate:', new Date());
        await onAutoUpdate();

        setLastUpdatedAt(new Date());
        setRemainingSeconds(autoUpdateInterval);
      }, autoUpdateInterval * 1000);

      const progressTimer = setInterval(() => {
        setRemainingSeconds((prevRemainingSeconds) => prevRemainingSeconds - 1);
      }, 1000);

      return () => {
        clearInterval(progressTimer);
        clearInterval(autoUpdateTimer);
      };
    }
  }, [autoUpdateInterval]);

  return (
    <div className="mb-2">
      <select onChange={handleChange} value={`${autoUpdateInterval}`}>
        { options.map(o => (
          <option value={o.value} key={o.label}>
            {o.label}
          </option>
        )) }
      </select>

      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        { remainingSeconds > -1 ? (
          <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${ Math.floor(100 - ((autoUpdateInterval - remainingSeconds) / autoUpdateInterval) * 100) }%`}} />
        ) : null }
      </div>

      {
        lastUpdatedAt != null ? (
          <div>{format(lastUpdatedAt, "yyyy-MM-dd HH:mm")}</div>
        ) : null
      }
    </div>
  );
}