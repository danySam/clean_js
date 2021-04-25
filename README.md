# Clean Code in JS

## Introduction

- Not going to spend much time talking about if writing clean code is an art or a skill
- Some of these are guidelines
- Some of these are specific to JS, but most can be applied into any language
- Not going to talk about software architecture, design patterns, complex abstractions
- Hoping that by the end of the talk you get a feel of what is clean code, how to make code cleaner, etc
- Myself: Software consultant from nilenso. Been working with Rupeek for over 6 months.
- The points discussed today are not exhaustive and they are not rules. I am going to addressing some code issues using examples from the services that I have worked with.

### Readability

- What makes sense to you doesn't necessarily mean the same to others

### Maintainability

### Reusability

## Naming

- Constants
- Meaningful
- Explicit
- Searchable
- Chose a style, camelCase, snake_case, but stick to it

Bad

```js
const user = [
  { name: 'Alice', age: 30, loans: 2 },
  { name: 'Bob', age: 29, loans: 4 },
];

const totalLoans = user.reduce((t, u) => t + u.loans, 0);
```

Better

- Meaningful names
- More explicit

```js
const users = [
  { name: 'Alice', age: 30, loans: 2 },
  { name: 'Bob', age: 29, loans: 4 },
];

const totalLoans = users.reduce((total, user) => total + user.loans, 0);
```

Bad

```js
const users = [
  { name: 'Alice', age: 30, loans: 2 },
  { name: 'Bob', age: 29, loans: 4 },
  { name: 'Dragon', age: 1000, loans: 40 },
];

const totalLoans = users
  .filter((user) => user.age < 100)
  .reduce((total, user) => total + user.loans, 0);
```

Better

- Searchable
- Meaningful
- No mental mapping required

```js
const MAX_ELIGIBILITY_AGE = 100;

const users = [
  { name: 'Alice', age: 30, loans: 2 },
  { name: 'Bob', age: 29, loans: 4 },
  { name: 'Dragon', age: 1000, loans: 40 },
];

const totalLoans = users
  .filter((user) => user.age < MAX_ELIGIBILITY_AGE)
  .reduce((total, user) => total + user.loans, 0);
```

Even Better

```js
const MAX_ELIGIBILITY_AGE = 100;

const users = [
  { name: 'Alice', age: 30, loans: 2 },
  { name: 'Bob', age: 29, loans: 4 },
  { name: 'Dragon', age: 1000, loans: 40 },
];

const totalLoansOfEligibleUsers = users
  .filter((user) => user.age < MAX_ELIGIBILITY_AGE)
  .reduce((total, user) => total + user.loans, 0);
```

Bad

```js
async function processLoanPayment(loan, sum, lenderId) {
  await PaymentService.closeLoan(loan.loanId);
  await CoreService.createNewLoan(sum, lenderId);
}
```

The intention here was to run a few cleans on different services after a payment for loan has been done.

Better

```js
async function runPostLoanPaymentActions(loan, amount) {
  await PaymentService.closeLoan(loan.loanId);
  await CoreService.createNewLoan(amount, loan.lenderId);
}
```

Even Better

```js
async function runPostLoanPaymentActions({ loanId, lenderId }, amount) {
  await PaymentService.closeLoan(loanId);
  await CoreService.createNewLoan(amount, lenderId);
}
```

Bad: Having a lot of arguments

```js
async function createNewScheme(id, name, loan, oldScheme, interestRate, daysSinceLastPayment, lender, netweight, goldRate) {
  const goldRate = await fetchGoldRate(lender, goldRate);
  if (netweight > 0) {
    // do something
  }
  const newSchemeId = await generateSchemeId()
  // do a lot of other things
}
```

### Uniformity in naming

- If the same name have different meaning it makes it more difficult to understand the code
- `get`, `fetch`

Loan implementation example

```js
const loan = [
  { id: 1, loanId: 2, netWeight: 23 },
  { id: 2, loanId: 3, netWeight: 0 }];
```

Another example

```js
const loan = [{
  id: 1,
  lpLoanId: 2,
  netWeight: 23,
  type: 'secure'
}, {
  id: 2,
  lpLoanId: 3,
  type: 'unsecure'
}]

```

Although both the loan objects correspond to the same data, they are structured differently. This makes it difficult to understand what to expect when you see a loan object.

### Don't leave them guessing

- It's not a thriller movie
- There shouldn't be any surprises in your code
- Functions should do what they say, and only that
- Variables should encapsulate on concept, it shouldn't mean different things based on context
- Use variables / functions over predicates that you need context to understand

Bad: This function doesn't give any info to the reader what it does

```js
function callFunctionInCore() {
  // does a lot of things
}
```

Bad: You have to reverse engineer the logic to understand what's happening here

```js
function createNewLoan(currentLoan, scheme) {
  let type = '1:1';
  if (currentLoan.loans.filter((loan) => loan.netweight > 0).length > 1) {
    type = 'N:1';
  }
  switch (type) {
    // create loans in different ways
  }
}
```

Better

```js
const isLoanSecure = (loan) => loan.netweight > 0;

function createNewLoan(currentLoan, scheme) {
  let type = '1:1';
  if (currentLoan.loans.filter(isLoanSecure).length > 1) {
    type = 'N:1';
  }
  switch (type) {
    // create loans in different ways
  }
}
```

Better?

```js
const isLoanSecure = (loan) => loan.netweight > 0;

const hasManySecureLoans = ({ loans }) => loans.filter(isLoanSecure).length > 1;

function createNewLoan(currentLoan, scheme) {
  let type = '1:1';
  if (hasManySecureLoans(currentLoan)) {
    type = 'N:1';
  }
  switch (type) {
    // create loans in different ways
  }
}
```

Even Better?

```js
const hasManySecureLoans = ({ loans }) => loans.filter(Loan.isSecure).length > 1;

function createNewLoan(currentLoan, scheme) {
  let type = '1:1';
  if (hasManySecureLoans(currentLoan)) {
    type = 'N:1';
  }
  switch (type) {
    // create loans in different ways
  }
}
```

You can still make this better by moving the code to find the `type` to a different function altogether.

## Composition

- Do not repeat
- Repetition is difficult to maintain
- Easier to test logic
- Easier to modify

Example:

``` javascript
const benchmark = _.get(_.find(scheme.baseSchemes, { type: 'unsecure' }), 'goldBenchmark', loan.lenderid);
```

## Mutation

- Mutation is bad in any language
- Use `const` > `let` >> `var`
- `var` should be considered deprecated
- Especially in javascript

## Guard Clauses

- If you start applying for a vaccination and only at the end they tell you that you have to be of certain age to get it, that's bad
- If your functions are expected to exit early put them at the beginning
- Don't exploit guard clauses
- They should be simple concepts that makes it easier to read and understand the code

## Clever one liners

- Adding code is easy
- Readability and maintainability is very difficult

## Functions should do one thing

## Do one thing at a time

- Whether it is doing a commit, or writing a function, don't try to do multiple things at a time
- Functions shouldn't try to solve 2 problems
- Your commits should clearly say what you did in that commit. Write descriptive commits
- Allows you to focus on one things, test it, get it working and not worry about the next thing

## Time

- Code takes time to write, easier to rewrite
- Easiest solution is not the best solution. Most of the time it's the worst possible approach
- Taking time to write good code will save time
  - Reduce production issues
  - Easier to debug
- We're all living in each other's paranoia
- For software engineering it's time

## Comments and Documentation

## Testing

- How does testing help in improving code quality?
  1. Understand code, adding tests will help you gather context
  2. Makes it easier to make improvements to the code (more confident)
  3. Add test, refactor, repeat
- Someone else will take a deep dive into testing
- Will add some references at the end

## Scouts Rule

- Leave things better than you found it
- If there was broken glass pieces on your floor you wouldn't just walk over it
- You may want to do this but might be afraid to break things
- Testing will help you be more confident in making these changes

## Dead code

- Adds to complexity
- Doesn't help with anything
- You can always look up git history
- Gives wrong info to someone trying to understand the system

## Automate

- Don't do things by hand
- Use linter
- Configure your editor to pick up linting config
- Add to your pipeline

## Standardization

- Validation / Coercion should happen at boundaries
- Naming should be understandable at an org level

## With freedom comes cost

- You can do a lot of things in Javascript without worrying about types or classes
- But this does not mean you can get away with the caveats
- It's up to you to make up for: type safety, modelling, etc

## Recovering from bad code

- Write tests
- Enforce linting
- Start small

## Recap

- Be mindful of the code you write
- Correctness over speed
- It takes time, to write clean code
- Review each others code
- Don't be afraid to ask questions
- It's okay to make mistakes
