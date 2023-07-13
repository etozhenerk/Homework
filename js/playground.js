module.exports = Sequence;

function Sequence(from, to, step) {
  if (!new.target) {
    return new Sequence(from, to, step);
  }

  const stepSymbol = Symbol.for("step");
  this[stepSymbol] = step;

  this[Symbol.toPrimitive] = function (hint) {
    if (hint === "string") {
      return `Sequence of numbers from ${from} to ${to} with step ${this[stepSymbol]}`;
    }

    if (hint === "number") {
      let length = 0;

      for (const _ of this) {
        length++;
      }

      return length;
    }
  };

  this[Symbol.iterator] = function* () {
    let startFrom = from;
    if (from > to) {
      while (from >= to) {
        yield from;
        from = from - this[stepSymbol];
      }
    } else {
      while (from <= to) {
        yield from;
        from = from + this[stepSymbol];
      }
    }

    from = startFrom;
  };

  this[Symbol.toStringTag] = "SequenceOfNumbers";
}

Sequence.prototype.setStep = function (step) {
  const stepSymbol = Symbol.for("step");
  this[stepSymbol] = step;
};

// ТЕСТЫ

let sequence = null;
let iterator = null;
let sequence2 = null;
let iterator2 = null;
let result = null;

// Преобразования к примитивам
sequence = Sequence(0, 10, 1);

console.assert(
  Object.prototype.toString.call(sequence) === "[object SequenceOfNumbers]"
);
console.assert(
  String(sequence) === "Sequence of numbers from 0 to 10 with step 1"
);
console.assert(Number(sequence) === 11);

// Работает в цикле for-of
sequence = Sequence(5, -5, 1);

result = [];
for (const item of sequence) {
  result.push(item);
}
console.assert(
  String([5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5]) === String(result)
);

// Работает деструктуризация последовательности
console.assert(
  String([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) === String([...Sequence(0, 10, 1)])
);

// Работает метод setStep
sequence = Sequence(0, 10, 2);
iterator = sequence[Symbol.iterator]();

iterator.next();
iterator.next();
sequence.setStep(4);

console.assert(Number(sequence) === 3);
console.assert(
  String(sequence) === "Sequence of numbers from 2 to 10 with step 4"
);
console.assert(String([...sequence]) === String([2, 6, 10]));

// Скрыты лишние свойства и методы
sequence = Sequence(0, 10, 1);

console.assert(String(Object.getOwnPropertyNames(sequence)) === String([]));
console.assert(
  String(Object.getOwnPropertyNames(Sequence.prototype).sort()) ===
    String(["constructor", "setStep"])
);

// Можно работать независимо с разными экземплярами последовательности
sequence = Sequence(0, 5, 1);
sequence2 = Sequence(10, 15, 1);
iterator = sequence[Symbol.iterator]();
iterator2 = sequence2[Symbol.iterator]();

iterator2.next();
iterator2.next();
iterator2.next();
sequence2.setStep(0.5);

iterator.next();
iterator.next();
sequence.setStep(2);

console.assert(String([1, 3, 5]) === String([...sequence]));
console.assert(
  String([12, 12.5, 13, 13.5, 14, 14.5, 15]) === String([...sequence2])
);
