import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { History, Delete } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression('');
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const inputPercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
      setExpression(`${inputValue} ${nextOperator}`);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      if (operator === '+') newValue = currentValue + inputValue;
      else if (operator === '−' || operator === '-') newValue = currentValue - inputValue;
      else if (operator === '×' || operator === '*') newValue = currentValue * inputValue;
      else if (operator === '÷' || operator === '/') newValue = currentValue / inputValue;

      setPrevValue(newValue);
      setDisplay(String(newValue));
      setExpression(`${newValue} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator && prevValue !== null) {
      let result = prevValue;
      if (operator === '+') result = prevValue + inputValue;
      else if (operator === '−' || operator === '-') result = prevValue - inputValue;
      else if (operator === '×' || operator === '*') result = prevValue * inputValue;
      else if (operator === '÷' || operator === '/') result = prevValue / inputValue;

      const fullExpr = `${prevValue} ${operator} ${inputValue} = ${result}`;
      setHistory((prev) => [fullExpr, ...prev.slice(0, 9)]);
      setDisplay(String(result));
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      setExpression('');
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDecimal();
      else if (e.key === '+' || e.key === '-') performOperation(e.key === '-' ? '−' : '+');
      else if (e.key === '*') performOperation('×');
      else if (e.key === '/') performOperation('÷');
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Escape') clearAll();
      else if (e.key === 'Backspace') {
        setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [display, prevValue, operator, waitingForOperand]);

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-white p-3 select-none">
      {/* Expression line & History toggle */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2 h-6">
        <span>{expression}</span>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-1 rounded hover:bg-white/10 ${showHistory ? 'text-amber-400' : ''}`}
          title="歷史計算記錄"
        >
          <History size={14} />
        </button>
      </div>

      {/* Main Display */}
      <div className="h-16 flex items-end justify-end px-3 pb-2 text-right">
        <span className="text-4xl font-light tracking-tight font-mono tabular-nums overflow-hidden text-ellipsis">
          {display}
        </span>
      </div>

      {showHistory ? (
        <div className="flex-1 bg-black/40 rounded-xl p-3 overflow-y-auto font-mono text-xs text-slate-300 space-y-2">
          <div className="text-[11px] text-slate-500 uppercase font-semibold">歷史計算記錄</div>
          {history.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">尚無歷史計算記錄</div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="p-1.5 rounded hover:bg-white/5 border-b border-white/5">
                {item}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Keypad Grid */
        <div className="flex-1 grid grid-cols-4 gap-2 pt-2">
          {/* Row 1 */}
          <button
            onClick={clearAll}
            className="rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-medium text-sm flex items-center justify-center transition-colors active:scale-95"
          >
            {display !== '0' || prevValue !== null ? 'C' : 'AC'}
          </button>
          <button
            onClick={toggleSign}
            className="rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-medium text-sm flex items-center justify-center transition-colors active:scale-95"
          >
            ±
          </button>
          <button
            onClick={inputPercent}
            className="rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black font-medium text-sm flex items-center justify-center transition-colors active:scale-95"
          >
            %
          </button>
          <button
            onClick={() => performOperation('÷')}
            className={`rounded-full text-white font-medium text-lg flex items-center justify-center transition-colors active:scale-95 ${
              operator === '÷' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb03b]'
            }`}
          >
            ÷
          </button>

          {/* Row 2 */}
          <button
            onClick={() => inputDigit('7')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            7
          </button>
          <button
            onClick={() => inputDigit('8')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            8
          </button>
          <button
            onClick={() => inputDigit('9')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            9
          </button>
          <button
            onClick={() => performOperation('×')}
            className={`rounded-full text-white font-medium text-lg flex items-center justify-center transition-colors active:scale-95 ${
              operator === '×' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb03b]'
            }`}
          >
            ×
          </button>

          {/* Row 3 */}
          <button
            onClick={() => inputDigit('4')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            4
          </button>
          <button
            onClick={() => inputDigit('5')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            5
          </button>
          <button
            onClick={() => inputDigit('6')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            6
          </button>
          <button
            onClick={() => performOperation('−')}
            className={`rounded-full text-white font-medium text-lg flex items-center justify-center transition-colors active:scale-95 ${
              operator === '−' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb03b]'
            }`}
          >
            −
          </button>

          {/* Row 4 */}
          <button
            onClick={() => inputDigit('1')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            1
          </button>
          <button
            onClick={() => inputDigit('2')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            2
          </button>
          <button
            onClick={() => inputDigit('3')}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            3
          </button>
          <button
            onClick={() => performOperation('+')}
            className={`rounded-full text-white font-medium text-lg flex items-center justify-center transition-colors active:scale-95 ${
              operator === '+' ? 'bg-white text-[#ff9f0a]' : 'bg-[#ff9f0a] hover:bg-[#ffb03b]'
            }`}
          >
            +
          </button>

          {/* Row 5 */}
          <button
            onClick={() => inputDigit('0')}
            className="col-span-2 rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center pl-7 transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={inputDecimal}
            className="rounded-full bg-[#333333] hover:bg-[#444444] text-white font-medium text-base flex items-center justify-center transition-colors active:scale-95"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="rounded-full bg-[#ff9f0a] hover:bg-[#ffb03b] text-white font-medium text-lg flex items-center justify-center transition-colors active:scale-95"
          >
            =
          </button>
        </div>
      )}
    </div>
  );
};
