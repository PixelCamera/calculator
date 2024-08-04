import { computed, reactive } from 'vue';
import { formatNumber } from '@/utils/formatNumber.js';
import Decimal from 'decimal.js';

const OPERATORS = ['+', '-', '×', '÷'];

const STATE_TYPE = {
  INIT: 'INIT',
  FIRST: 'FIRST',
  SECOND: 'SECOND',
  OP: 'OP',
  RESULT: 'RESULT',
};

export const calcState = reactive({
  current: STATE_TYPE.INIT,
  first: '0',
  second: '',
  op: null,
  result: null,
});

const isState = (...states) => states.includes(calcState.current);

// 计算显示表达式
export const expressionDisplay = computed(() => {
  if (isState(STATE_TYPE.RESULT)) {
    return `${formatNumber(calcState.first)} ${calcState.op} ${formatNumber(calcState.second)} =`;
  }
  if (isState(STATE_TYPE.SECOND, STATE_TYPE.OP)) {
    return `${formatNumber(calcState.first)} ${calcState.op}`;
  }
  return '';
});

// 计算显示值
export const valueDisplay = computed(() => {
  if (isState(STATE_TYPE.INIT, STATE_TYPE.FIRST)) {
    return formatNumber(calcState.first);
  }
  if (isState(STATE_TYPE.OP, STATE_TYPE.SECOND)) {
    return formatNumber(calcState.second || calcState.first);
  }
  if (isState(STATE_TYPE.RESULT)) {
    return formatNumber(calcState.result);
  }
  return '0';
});

function appendToOperand(operand, input) {
  if (input === '.' && operand.includes('.')) return operand;
  if (operand === '0' && input !== '.') return input;
  return operand + input;
}

function calculate() {
  const a = new Decimal(calcState.first);
  const b = new Decimal(calcState.second);
  const operations = {
    '+': a.plus(b),
    '-': a.minus(b),
    '×': a.times(b),
    '÷': b.isZero() ? 'Error' : a.dividedBy(b),
  };
  return operations[calcState.op]?.toString() ?? 'Error';
}

export function handleInput(input) {
  const actions = {
    [STATE_TYPE.INIT]: () => {
      if (input === 'C') return;
      if (OPERATORS.includes(input)) {
        calcState.op = input;
        calcState.current = STATE_TYPE.OP;
      } else if (input !== '=') {
        calcState.first = input === '.' ? '0.' : input;
        calcState.current = STATE_TYPE.FIRST;
      }
    },
    [STATE_TYPE.FIRST]: () => {
      if (input === 'C') {
        calcState.first = '0';
        calcState.current = STATE_TYPE.INIT;
      } else if (OPERATORS.includes(input)) {
        calcState.op = input;
        calcState.current = STATE_TYPE.OP;
        if (calcState.first.endsWith('.')) {
          calcState.first = calcState.first.slice(0, -1);
        }
      } else if (input !== '=') {
        calcState.first = appendToOperand(calcState.first, input);
      }
    },
    [STATE_TYPE.OP]: () => {
      if (input === 'C') {
        calcState.first = '0';
        calcState.op = null;
        calcState.current = STATE_TYPE.INIT;
      } else if (OPERATORS.includes(input)) {
        calcState.op = input;
      } else if (input !== '=') {
        calcState.second = input === '.' ? '0.' : input;
        calcState.current = STATE_TYPE.SECOND;
      }
    },
    [STATE_TYPE.SECOND]: () => {
      if (input === 'C') {
        calcState.second = '';
        calcState.current = STATE_TYPE.OP;
      } else if (OPERATORS.includes(input)) {
        calcState.result = calculate();
        calcState.first = calcState.result;
        calcState.second = '';
        calcState.op = input;
        calcState.current = STATE_TYPE.OP;
      } else if (input === '=') {
        calcState.result = calculate();
        calcState.current = STATE_TYPE.RESULT;
      } else {
        calcState.second = appendToOperand(calcState.second, input);
      }
    },
    [STATE_TYPE.RESULT]: () => {
      if (input === 'C') {
        calcState.first = '0';
        calcState.second = '';
        calcState.op = null;
        calcState.result = null;
        calcState.current = STATE_TYPE.INIT;
      } else if (OPERATORS.includes(input)) {
        calcState.first = calcState.result;
        calcState.second = '';
        calcState.op = input;
        calcState.current = STATE_TYPE.OP;
      } else if (input !== '=') {
        calcState.first = input === '.' ? '0.' : input;
        calcState.second = '';
        calcState.op = null;
        calcState.result = null;
        calcState.current = STATE_TYPE.FIRST;
      }
    },
  };

  actions[calcState.current]();
}
