import { useEffect, useState } from 'react';

const PRESET_TIMES = [5, 10, 15, 30, 45, 60];
const TIME_UNITS = [
  { value: 'seconds', label: 'Seconds', shortLabel: 's', duration: 1 },
  { value: 'minutes', label: 'Minutes', shortLabel: 'm', duration: 60 },
  { value: 'hours', label: 'Hours', shortLabel: 'h', duration: 60 * 60 },
];

function DownCounter() {
  const [startValue, setStartValue] = useState(10);
  const [count, setCount] = useState(10);
  const [timeUnit, setTimeUnit] = useState('seconds');
  const [isRunning, setIsRunning] = useState(false);
  const [manualValue, setManualValue] = useState('10');
  const [hasPaused, setHasPaused] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = window.setInterval(() => {
      setCount((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  const setTime = (value, unitValue = timeUnit) => {
    const unit = TIME_UNITS.find((item) => item.value === unitValue);
    setStartValue(value);
    setCount(value * unit.duration);
    setManualValue(String(value));
    setTimeUnit(unitValue);
    setIsRunning(false);
    setHasPaused(false);
  };

  const handleManualSubmit = (event) => {
    event.preventDefault();
    const value = Number(manualValue);

    if (!Number.isInteger(value) || value < 1 || isRunning) return;
    setTime(value);
  };

  const handleStop = () => {
    setHasPaused(true);
    setIsRunning(false);
  };

  const selectedUnit = TIME_UNITS.find((unit) => unit.value === timeUnit);
  const startDuration = startValue * selectedUnit.duration;
  const progress = startDuration > 0 ? (count / startDuration) * 100 : 0;
  const isFinished = count === 0;
  const formatClock = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  const displayedCount = timeUnit === 'seconds' ? String(count) : formatClock(count);
  const displayedStart = timeUnit === 'seconds' ? String(startDuration) : formatClock(startDuration);
  const circleSize = Math.min(320, Math.max(180, 180 + Math.max(0, String(count).length - 2) * 24));
  const circleFontSize = Math.min(
    5.2,
    Math.max(1.5, (circleSize - 40) / (displayedCount.length * 0.62 * 16)),
  );
  const status = isRunning
    ? 'Counting down…'
    : isFinished
      ? "Time's up!"
      : `Counts down from ${displayedStart} to 0 and stops`;

  return (
    <section className="down-counter" aria-label="Down Counter">
      <style>{`
        .down-counter,
        .down-counter * {
          box-sizing: border-box;
        }

        .down-counter {
          width: min(100%, 460px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          margin: 0 auto;
          padding: 34px 30px 32px;
          border-radius: 28px;
          color: #000;
          background: linear-gradient(145deg, #f4f8ff, #cfe0ff);
          box-shadow: 0 18px 42px rgba(58, 112, 205, 0.24);
          font-family: Inter, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
        }

        .down-counter h1 {
          margin: 0;
          color: #000;
          font-size: clamp(1.8rem, 7vw, 2.35rem);
          font-weight: 800;
          line-height: 1.15;
        }

        .down-counter__circle {
          width: 180px;
          height: 180px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #000;
          background: radial-gradient(circle at 34% 27%, #fff 0%, #f8fbff 48%, #e0eaff 100%);
          box-shadow:
            0 17px 28px rgba(54, 106, 197, 0.28),
            inset 0 -9px 14px rgba(90, 132, 205, 0.16);
          font-size: 5.2rem;
          font-variant-numeric: tabular-nums;
          font-weight: 800;
          line-height: 1;
          transition: box-shadow 180ms ease;
        }

        .down-counter__circle--running {
          box-shadow:
            0 20px 36px rgba(45, 103, 208, 0.42),
            inset 0 -10px 16px rgba(77, 123, 205, 0.23);
        }

        .down-counter__circle--finished {
          animation: down-counter-pop 480ms ease-in-out 2;
        }

        .down-counter__progress {
          width: 180px;
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(63, 102, 165, 0.18);
        }

        .down-counter__progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #408cff, #a17bea);
          transition: width 250ms linear;
        }

        .down-counter__status {
          min-height: 24px;
          color: #000;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.5;
        }

        .down-counter__time-picker,
        .down-counter__manual {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .down-counter__label {
          color: #000;
          font-size: 1rem;
          font-weight: 600;
        }

        .down-counter__presets {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .down-counter__presets--single-line {
          flex-wrap: nowrap;
          justify-content: center;
        }

        .down-counter__units {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .down-counter__unit {
          min-height: 40px;
          padding: 0 16px;
          border: 1px solid #777;
          border-radius: 10px;
          color: #000;
          background: #fff;
          cursor: pointer;
          font: inherit;
          font-weight: 700;
          transition: background 140ms ease, box-shadow 140ms ease;
        }

        .down-counter__unit:hover:not(:disabled) {
          background: #e5f1ff;
        }

        .down-counter__unit--selected {
          border-color: #357edb;
          background: #7cb7ff;
          box-shadow: 0 4px 12px rgba(48, 120, 220, 0.35);
        }

        .down-counter__chip {
          min-width: 0;
          flex: 1 1 0;
          min-height: 48px;
          padding: 0 6px;
          border: 1px solid #777;
          border-radius: 10px;
          color: #000;
          background: #fff;
          cursor: pointer;
          font: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          transition: background 140ms ease, box-shadow 140ms ease, transform 140ms ease;
        }

        .down-counter__chip:hover:not(:disabled) {
          background: #e5f1ff;
        }

        .down-counter__chip--selected {
          border-color: #357edb;
          background: #7cb7ff;
          box-shadow: 0 4px 12px rgba(48, 120, 220, 0.35);
        }

        .down-counter__manual-row {
          width: 100%;
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 12px;
        }

        .down-counter__input {
          width: 0;
          min-width: 0;
          min-height: 58px;
          flex: 1 1 auto;
          padding: 0 16px;
          border: 1px solid #999;
          border-radius: 12px;
          color: #000;
          background: #fff;
          font: inherit;
          font-size: 1rem;
        }

        .down-counter__input:focus {
          border-color: #438de3;
          outline: 3px solid rgba(67, 141, 227, 0.35);
          outline-offset: 2px;
        }

        .down-counter__button {
          position: relative;
          min-height: 58px;
          border: 1px solid rgba(0, 0, 0, 0.22);
          border-radius: 18px;
          color: #000;
          cursor: pointer;
          font: inherit;
          font-size: 1rem;
          font-weight: 800;
          transition: transform 100ms ease, filter 140ms ease, box-shadow 100ms ease;
        }

        .down-counter__button:focus-visible,
        .down-counter__chip:focus-visible,
        .down-counter__unit:focus-visible {
          outline: 3px solid #145fb8;
          outline-offset: 3px;
        }

        .down-counter__button:hover:not(:disabled) {
          filter: brightness(1.04);
        }

        .down-counter__button:active:not(:disabled) {
          transform: translateY(5px);
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
        }

        .down-counter__button:disabled,
        .down-counter__chip:disabled,
        .down-counter__unit:disabled,
        .down-counter__input:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .down-counter__set {
          min-width: 82px;
          padding: 0 18px;
          border-radius: 14px;
          background: linear-gradient(180deg, #ffb0b4, #f08088);
          box-shadow: 0 5px 0 #bd5962;
        }

        .down-counter__set:active:not(:disabled) {
          box-shadow: 0 1px 0 #bd5962;
        }

        .down-counter__actions {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          margin-top: 2px;
        }

        .down-counter__link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 999px;
          color: #0f5bd6;
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 18px rgba(23, 79, 147, 0.14);
          font-size: 0.95rem;
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: transform 100ms ease, background 140ms ease;
        }

        .down-counter__link:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        .down-counter__start {
          background: linear-gradient(180deg, #a7d3ff, #70aff4);
          box-shadow: 0 7px 0 #3474c2;
        }

        .down-counter__stop {
          background: linear-gradient(180deg, #ffd0d4, #ed9fab);
          box-shadow: 0 7px 0 #bf7480;
        }

        .down-counter__start:active:not(:disabled),
        .down-counter__stop:active:not(:disabled) {
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.24);
        }

        @keyframes down-counter-pop {
          0%, 100% { transform: scale(1); }
          35% { transform: scale(1.08); }
          70% { transform: scale(0.98); }
        }

        @media (max-width: 420px) {
          .down-counter {
            padding: 28px 18px;
          }

          .down-counter__actions {
            gap: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .down-counter *,
          .down-counter *::before,
          .down-counter *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <h1>Down Counter</h1>

      <div
        className={[
          'down-counter__circle',
          isRunning ? 'down-counter__circle--running' : '',
          isFinished ? 'down-counter__circle--finished' : '',
        ].filter(Boolean).join(' ')}
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          fontSize: `${circleFontSize}rem`,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {displayedCount}
      </div>

      <div
        className="down-counter__progress"
        role="progressbar"
        aria-label="Time remaining"
        aria-valuemin={0}
        aria-valuemax={startDuration}
        aria-valuenow={count}
      >
        <div
          className="down-counter__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="down-counter__status" role="status">
        {status}
      </div>

      <div className="down-counter__time-picker">
        <span className="down-counter__label">Time unit</span>
        <div className="down-counter__units" aria-label="Time unit">
          {TIME_UNITS.map((unit) => (
            <button
              key={unit.value}
              type="button"
              className={[
                'down-counter__unit',
                timeUnit === unit.value ? 'down-counter__unit--selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setTime(startValue, unit.value)}
              disabled={isRunning}
              aria-pressed={timeUnit === unit.value}
            >
              {unit.label}
            </button>
          ))}
        </div>
        <label className="down-counter__label">Predefined time</label>
        <div
          className={[
            'down-counter__presets',
            timeUnit === 'minutes' ? 'down-counter__presets--single-line' : '',
          ].filter(Boolean).join(' ')}
        >
          {PRESET_TIMES.map((time) => (
            <button
              key={time}
              type="button"
              className={[
                'down-counter__chip',
                startValue === time ? 'down-counter__chip--selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setTime(time)}
              disabled={isRunning}
              aria-pressed={startValue === time}
            >
              {time}{selectedUnit.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <form className="down-counter__manual" onSubmit={handleManualSubmit}>
        <label className="down-counter__label" htmlFor="down-counter-manual-time">
          Manual time ({timeUnit})
        </label>
        <div className="down-counter__manual-row">
          <input
            id="down-counter-manual-time"
            className="down-counter__input"
            type="number"
            min="1"
            step="1"
            value={manualValue}
            onChange={(event) => setManualValue(event.target.value)}
            disabled={isRunning}
          />
          <button
            className="down-counter__button down-counter__set"
            type="submit"
            disabled={isRunning}
          >
            Set
          </button>
        </div>
      </form>

      <div className="down-counter__actions">
        <button
          className="down-counter__button down-counter__start"
          type="button"
          onClick={() => setIsRunning(true)}
          disabled={isRunning || isFinished}
        >
          {hasPaused ? 'Resume' : 'Start'}
        </button>
        <button
          className="down-counter__button down-counter__stop"
          type="button"
          onClick={handleStop}
          disabled={!isRunning}
        >
          Stop
        </button>
      </div>

      <a
        className="down-counter__link"
        href="https://react.dev"
        target="_blank"
        rel="noreferrer"
      >
        Learn React
      </a>
    </section>
  );
}

export default DownCounter;
