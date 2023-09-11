
import { useReducer } from 'react';
import './App.css';
import DigitButtons from './DigitButtons';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR:'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE:'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite || state.currentOperand === null) {
        return {
          ...state,
          currentOperand: payload.digit === '.' ? '0.' : payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === '.' && state.currentOperand.includes('.')) {
        return state; // Avoid adding multiple decimal points
      }

      const newCurrentOperand = state.currentOperand + payload.digit;

      return {
        ...state,
        currentOperand: newCurrentOperand,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === null && state.previousOperand === null) {
        return state;
      }

      if (state.currentOperand === null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand === null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      // Evaluate the previous operation and continue chaining the current operation
      const evaluatedResult = evaluate(state);
      return {
        ...state,
        previousOperand: evaluatedResult,
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {
        currentOperand: null,
        previousOperand: null,
        operation: null,
        overwrite: true,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      if (state.currentOperand === null) {
        return state;
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      const trimmedCurrentOperand = state.currentOperand.slice(0, -1);
      return {
        ...state,
        currentOperand: trimmedCurrentOperand === '' ? null : trimmedCurrentOperand,
      };

    case ACTIONS.EVALUATE:
      if (state.operation === null || state.currentOperand === null || state.previousOperand === null) {
        return state;
      }

      const result = evaluate(state);
      return {
        ...state,
        previousOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: result,
      };

    default:
      return state;
  }
}


function evaluate({currentOperand,previousOperand,operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation) {
   
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break       
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

//const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  //maximumFractionDigits:0,
//}) 

//function formatOperand(operand){
  //if (operand == null) return
  //const[integer,decimal] = operand.split('.')
 // if (decimal == null) return INTEGER_FORMATTER.format(integer)
//}
function formatOperand(operand) {
  if (operand == null) return; // Return early if the operand is null

  const [integer, decimal] = operand.split('.');
  if (decimal == null) {
    // If there is no decimal part, format the integer part
    return INTEGER_FORMATTER.format(integer);
  } else {
    // If there is a decimal part, format the whole number
    return INTEGER_FORMATTER.format(integer) + '.' + decimal;
  }
}


function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer,{})

  return (
    <div className='calculator-grid'>
     <div className='output'>
        <div className="previous-operand">{formatOperand (previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand (currentOperand)}</div>
      </div>
      <button className="span-two" 
      onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>

      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}></OperationButton>

      <DigitButtons digit="1" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="2" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="3" dispatch={dispatch}></DigitButtons>
      
      <OperationButton operation="*" dispatch={dispatch}></OperationButton>

      <DigitButtons digit="4" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="5" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="6" dispatch={dispatch}></DigitButtons>
     
      <OperationButton operation="+" dispatch={dispatch}></OperationButton>

      <DigitButtons digit="7" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="8" dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="9" dispatch={dispatch}></DigitButtons>

      <OperationButton operation="-" dispatch={dispatch}></OperationButton>
      <DigitButtons digit="." dispatch={dispatch}></DigitButtons>
      <DigitButtons digit="0" dispatch={dispatch}></DigitButtons>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>

     </div>
    
  )
}

export default App;
