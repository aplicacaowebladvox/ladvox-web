
let i = require('./index');

export class BasicCalculator {
  static solve(f: string): string {
    return i.evaluate(f);
  }
}

// export class BasicCalculator {
//   static evaluate(val: any): string {
//     let eqn = val;
//     if (eqn[0] == '+' || '-') {
//       eqn = '0' + eqn;
//     }
//     let rpn = Shunting.RPN(eqn);

//     var ans = 'Invalid input';

//     if (rpn) {
//       let tree = Shunting.parse(rpn);
//       ans = Shunting._eval(tree);
//     }

//     return ans;
//   }
// }

// class Shunting {
//   static TYPE_OP = 'o';
//   static TYPE_CONST = 'c';
//   static TYPE_FUNC = 'f';
//   static TYPE_ELSE = 'e';
//   static TYPE_LPAREN = '(';
//   static TYPE_RPAREN = ')';

//   static genFunc(_eval: any, type = Shunting.TYPE_FUNC, prec = 0, left = true) {
//     return {
//       underEval: _eval,
//       t: type,
//       prec: prec,
//       left: left,
//     };
//   }
//   static genNode(val: any, func = true, unary = true): any {
//     return {
//       val: val,
//       func: func,
//       unary: unary,
//       right: null,
//       left: null,
//       name: '',
//     };
//   }

//   static constants = {
//     pi: Math.PI,
//     e: Math.E,
//   };
//   static constant_names = Object.keys(Shunting.constants);
//   static unary_functions = {
//     sin: Shunting.genFunc((x: any) => Math.sin(x)),
//     cos: Shunting.genFunc((x: any) => Math.cos(x)),
//     tan: Shunting.genFunc((x: any) => Math.tan(x)),
//     ln: Shunting.genFunc((x: any) => Math.log(x)),
//     log: Shunting.genFunc((x: any) => Math.log10(x)),
//     sqrt: Shunting.genFunc((x: any) => Math.sqrt(x)),
//   };

//   static binary_functions = {
//     '+': Shunting.genFunc((x: number, y: number) => x + y, Shunting.TYPE_OP, 2),
//     '-': Shunting.genFunc((x: number, y: number) => x - y, Shunting.TYPE_OP, 2),
//     '*': Shunting.genFunc((x: number, y: number) => x * y, Shunting.TYPE_OP, 3),
//     '/': Shunting.genFunc((x: number, y: number) => x / y, Shunting.TYPE_OP, 3),
//     '%': Shunting.genFunc((x: number, y: number) => x % y, Shunting.TYPE_OP, 3),
//     '^': Shunting.genFunc((x: number, y: number) => Math.pow(x, y), Shunting.TYPE_OP, 4, false),
//     'max': Shunting.genFunc((x: number, y: number) => Math.max(x, y)),
//     'min': Shunting.genFunc((x: number, y: number) => Math.min(x, y)),
//   };

//   static functions = Object.keys(Shunting.unary_functions).concat(
//     Object.keys(Shunting.binary_functions)
//   );
//   static operators = '+-*/%^';
//   static left_brackets = '({[';
//   static right_brackets = ')}]';

//   static isNumber(c: any) {
//     if (typeof c === 'number') {
//       return true;
//     }

//     return !isNaN(c) || this.constant_names.includes(c) || c === '.';
//   }

//   static getNumVal(c: any): number {
//     if (typeof c === 'number') {
//       return <number>c;
//     } else if (Shunting.constant_names.includes(c)) {
//       if (c == 'e') return Shunting.constants.e;
//       else if (c == 'pi') return Shunting.constants.pi;
//       else return 0;
//     } else {
//       return parseFloat(c);
//     }
//   }

//   static isFunction(c: any) {
//     return Shunting.functions.includes(c);
//   }

//   static findElement(i: any, eqn: any, list: any) {
//     for (var j = 0, len = list.length; j < len; j++) {
//       var n = list[j].length;
//       if (eqn.substring(i, i + n) === list[j]) {
//         return [true, list[j], n];
//       }
//     }
//     return [false, '', 1];
//   }

//   static getPrecedence(op: any) {
//     switch (op) {
//       case '+':
//         return this.binary_functions['+'].prec;
//       case '-':
//         return this.binary_functions['-'].prec;
//       case '*':
//         return this.binary_functions['*'].prec;
//       case '/':
//         return this.binary_functions['/'].prec;
//       case '%':
//         return this.binary_functions['%'].prec;
//       case '^':
//         return this.binary_functions['^'].prec;
//       case 'max':
//         return this.binary_functions.max.prec;
//       case 'min':
//         return this.binary_functions.min.prec;
//     }

//     return 0;
//   }

//   static isLeftAssociative(op: any) {
//     switch (op) {
//       case '+':
//         return this.binary_functions['+'].left;
//       case '-':
//         return this.binary_functions['-'].left;
//       case '*':
//         return this.binary_functions['*'].left;
//       case '/':
//         return this.binary_functions['/'].left;
//       case '%':
//         return this.binary_functions['%'].left;
//       case '^':
//         return this.binary_functions['^'].left;
//       case 'max':
//         return this.binary_functions.max.left;
//       case 'min':
//         return this.binary_functions.min.left;
//     }
//     return true;
//   }

//   static RPN(eqn: any) {
//     let queue = [];
//     let stack = [];

//     let obj = '';
//     let type = '';

//     // for each token
//     for (var i = 0, eq_len = eqn.length; i < eq_len; i++) {
//       let t = eqn[i];

//       if (t === ' ' || t === ',') {
//         continue;
//       }

//       // determine what token is
//       if (Shunting.isNumber(t)) {
//         type = Shunting.TYPE_CONST;

//         obj = t;
//         if (i < eq_len - 1) {
//           // get entire number
//           while (Shunting.isNumber(eqn[i + 1])) {
//             obj += eqn[i + 1];
//             i++;
//             if (i >= eq_len - 1) {
//               break;
//             }
//           }
//         }
//         obj = Shunting.getNumVal(obj).toString();
//       } else {
//         let data = Shunting.findElement(i, eqn, Shunting.functions);
//         let found = data[0];
//         obj = data[1];
//         let n = data[2];
//         if (found) {
//           type = Shunting.operators.includes(obj) ? Shunting.TYPE_OP : Shunting.TYPE_FUNC;
//         } else {
//           data = Shunting.findElement(i, eqn, Shunting.constant_names);
//           found = data[0];
//           obj = data[1];
//           n = data[2];
//           if (found) {
//             type = Shunting.TYPE_CONST;
//           } else {
//             if (Shunting.left_brackets.includes(t)) {
//               type = Shunting.TYPE_LPAREN;
//             } else if (Shunting.right_brackets.includes(t)) {
//               type = Shunting.TYPE_RPAREN;
//             } else {
//               type = Shunting.TYPE_ELSE;
//             }
//           }
//         }
//         i += n - 1;
//       }

//       // do something with token
//       let last_stack = stack[stack.length - 1];
//       switch (type) {
//         case Shunting.TYPE_CONST:
//           queue.push(obj);
//           break;
//         case Shunting.TYPE_FUNC:
//           stack.push(obj);
//           break;
//         case Shunting.TYPE_OP:
//           if (stack.length != 0) {
//             while (
//               ((this.functions.includes(last_stack) && !this.operators.includes(last_stack)) ||
//                 this.getPrecedence(last_stack) > this.getPrecedence(obj) ||
//                 (this.getPrecedence(last_stack) === this.getPrecedence(obj) &&
//                   this.isLeftAssociative(last_stack))) &&
//               !this.left_brackets.includes(last_stack)
//             ) {
//               queue.push(stack.pop());
//               if (stack.length === 0) {
//                 break;
//               }
//               last_stack = stack[stack.length - 1];
//             }
//           }
//           stack.push(obj);
//           break;
//         case Shunting.TYPE_LPAREN:
//           stack.push('(');
//           break;
//         case Shunting.TYPE_RPAREN:
//           while (last_stack !== '(') {
//             queue.push(stack.pop());
//             last_stack = stack[stack.length - 1];
//           }
//           stack.pop();
//           break;
//         default:
//           return null;
//       }
//     }

//     while (stack.length > 0) {
//       queue.push(stack.pop());
//     }

//     return queue;
//   }

//   static genBinaryFunctions(v: any): any {
//     if (v == '+') return Shunting.binary_functions['+'];
//     if (v == '-') return Shunting.binary_functions['-'];
//     if (v == '*') return Shunting.binary_functions['*'];
//     if (v == '/') return Shunting.binary_functions['/'];
//     if (v == '%') return Shunting.binary_functions['%'];
//     if (v == '^') return Shunting.binary_functions['^'];
//     if (v == 'max') return Shunting.binary_functions.max;
//     if (v == 'min') return Shunting.binary_functions.min;
//   }

//   static genUnaryFunctions(v: any): any {
//     if (v == 'sin') return Shunting.unary_functions.sin;
//     if (v == 'cos') return Shunting.unary_functions.cos;
//     if (v == 'tan') return Shunting.unary_functions.tan;
//     if (v == 'ln') return Shunting.unary_functions.ln;
//     if (v == 'log') return Shunting.unary_functions.log;
//     if (v == 'sqrt') return Shunting.unary_functions.sqrt;
//   }
//   static parse(rpn: any) {
//     let stack: any[] = [];

//     Array.from(rpn).forEach((t: any) => {
//       let tr = null;
//       if (Shunting.isNumber(t)) {
//         tr = Shunting.genNode(t, false);
//       } else {
//         if (Object.keys(Shunting.binary_functions).includes(t)) {
//           tr = Shunting.genNode(Shunting.genBinaryFunctions(t), true, false);

//           let a = stack.pop();
//           let b = stack.pop();

//           if (typeof a === 'number') {
//             tr.right = Shunting.genNode(a, false);
//           } else {
//             tr.right = a;
//           }

//           if (typeof b === 'number') {
//             tr.left = Shunting.genNode(b, false);
//           } else {
//             tr.left = b;
//           }
//         } else if (Object.keys(Shunting.unary_functions).includes(t)) {
//           tr = Shunting.genNode(Shunting.genUnaryFunctions(t));

//           let a = stack.pop();

//           if (typeof a === 'number') {
//             tr.left = this.genNode(a, false);
//           } else {
//             tr.left = a;
//           }
//         }
//       }
//       tr.name = t;
//       stack.push(tr);
//     });

//     return stack.pop();
//   }

//   static _eval(tree: any) {
//     if (tree.func) {
//       if (tree.unary) {
//         return tree.val.eval(eval(tree.left));
//       } else {
//         return tree.val.eval(eval(tree.left), eval(tree.right));
//       }
//     } else {
//       if (Shunting.constant_names.includes(tree.val)) {
//         return Shunting.genConstants(tree.val);
//       } else {
//         return tree.val;
//       }
//     }
//   }

//   static genConstants(v: any) {
//     if (v == 'e') return Shunting.constants.e;
//     if (v == 'pi') return Shunting.constants.pi;
//   }
// }
