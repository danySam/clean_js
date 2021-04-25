const MAX_ELIGIBILITY_AGE = 100;

const users = [
  { name: 'Alice', age: 30, loans: 2 },
  { name: 'Bob', age: 29, loans: 4 },
  { name: 'Dragon', age: 1000, loans: 40 },
];

const totalLoans = users
  .filter((user) => user.age < MAX_ELIGIBILITY_AGE)
  .reduce((total, user) => total + user.loans, 0);

console.log(totalLoans);
