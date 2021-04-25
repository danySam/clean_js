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

Bad

```js
if (user.age > 18 && !user.payments.find((payment) => payment.status === 'outstanding') && loans.every((loan) => loan.verified === true)) {
  // do something
}
```

Better

- Easy to understand
- Plain language
- Implementation is extracted

```js
const isAboveLegalAge = user.age > LEGAL_AGE;
const hasBackPayments = user.payments.find(User.isPaymentOutstanding);
const loansVerified = loans.every(Loan.isVerified);

if (isAboveLegalAge && !hasBackPayments && loansVerified) {
  // do something
}
```

## Composition

- Do not repeat
- Repetition is difficult to maintain
- Keep max 10 ~ 15 lines
- Easier to test logic
- Easier to modify

### Duplication

- Difficult to maintain
- Difficult to introduce changes
- Easy to miss during refactoring / changing the logic
- Difficult to test

Example:

Bad

- Difficult to read
- Difficult to change this logic

```js
const benchmark = _.get(_.find(scheme.baseSchemes, { type: 'unsecure' }), 'goldBenchmark', loan.lenderid);
```

Better

```js
function getBenchmarkFromScheme(scheme, loan) {
  return _.get(_.find(scheme.baseSchemes, { type: 'unsecure' }), 'goldBenchmark', loan.lenderid);
}

const benchmark = getBenchmarkFromScheme(scheme, loan);
```

Even Better

```js
function getBenchmarkFromScheme(scheme, loan) {
  const unsecureBaseScheme = _.find(scheme.baseSchemes, { type: 'unsecure' });
  return _.get(unsecureBaseScheme, 'goldBenchmark', loan.lenderid);
}

const benchmark = getBenchmarkFromScheme(scheme, loan);
```

Even Better?

```js
function getBenchmarkFromScheme(scheme, lenderId) {
  const unsecureBaseScheme = _.find(scheme.baseSchemes, { type: 'unsecure' });
  return _.get(unsecureBaseScheme, 'goldBenchmark', lenderId);
}

const benchmark = getBenchmarkFromScheme(scheme, loan.lenderId);
```

Even Better? Or should we default to passing in `loan`?

```js
function getBenchmarkFromScheme(scheme, defaultBenchmark) {
  const unsecureBaseScheme = _.find(scheme.baseSchemes, { type: 'unsecure' });
  return _.get(unsecureBaseScheme, 'goldBenchmark', defaultBenchmark);
}

const benchmark = getBenchmarkFromScheme(scheme, loan.lenderId);
```

- Easy to modify
- Confidently make changes
- Easy to search

> Could put this in `Scheme` module and call it `getBenchmark`

## Mutation

- Mutation is bad in any language
- Use `const` > `let` >> `var`
- `var` should be considered deprecated
- Especially in javascript

Example

```js
var startTime = new Date();

function getNewStartTime(someCondition) {
  var starttime = new Date();
  if (someCondition) {
    startTime = Date.parse('2021-01-01T20:46:56.875Z');
  }
  return starttime
}
```

### Pros of immutable code

- You'll be forced to write more composable functions
- Easier to read
- More descriptive
- Concurrency
- Pure functions

### Mutation in JS

Example

```js
function getLoanInterestForFederal(loan) {
  return loan.loanAmount * (loan.interestRate / 100) * loan.tenure;
}

function getLoanInterestForICICI(loan) {
  loan.loanAmount *= 1.05;
  return loan.loanAmount * (loan.interestRate / 100) * loan.tenure;
}

function printLoanInterestForLenders(loan) {
  console.log('Federal:', getLoanInterestForFederal(loan));
  console.log('ICICI:', getLoanInterestForICICI(loan));
}

const loan = {
  loanAmount: 100000,
  interestRate: 5,
  tenure: 4,
};

printLoanInterestForLenders(loan);
```

## Guard Clauses

- If you start applying for a vaccination and only at the end they tell you that you have to be of certain age to get it, that's bad
- If your functions are expected to exit early put them at the beginning
- Don't exploit guard clauses
- They should be simple concepts that makes it easier to read and understand the code

Bad:

- Mutation
- Difficult to read
- Harder to add more code

```js
function getCashback() {
  let result;
  if (isSecure) {
    result = getSecureCashback();
  } else if (isUnsecure) {
    result = getUnSecureCashback();
  } else if (isOldScheme) {
    result = getCashbackForOldScheme();
  } else {
    result = getNormalCashback();
  }
  return result;
}
```

Better

```js
function getCashback() {
  if (isSecure) return getSecureCashback();
  if (isUnsecure) return getUnSecureCashback();
  if (isOldScheme) return getCashbackForOldScheme();
  return getNormalCashback();
}
```

## Clever one liners

- Adding code is easy
- Readability and maintainability is very difficult

Bad

- Adds cost to your code
- Readability decreases
- Refactorability decreases

```js
async function sendSomeData(oldLoan, newLoan, newscheme) {
  const loan = {
    loan: newLoan,
    uloans: oldLoan.uloans,
    newamount: newLoan.newunsecureamount,
    oldamount: newLoan.oldunsecureamount,
    oldlploanid: newLoan.lploanid,
    oldscheme: newLoan.oldschemeid,
    newscheme: newLoan.newschemeid,
    newschemeobj: newscheme,
    pledgecardimage: newLoan.pledgecard,
    repledgedate: newLoan.newloandate,
    urepledgehistory: oldLoan.urepledgehistory,
    ...(oldLoan.netWeight > 0 && {
      uLoanIds: oldLoan.uLoanIds,
      unSecureScheme: oldLoan.scheme,
    }),
    renewalobj: {
      ...(newLoan.printerpledgecardimage && {
        combinedpledgecardimage: newLoan.printerpledgecardimage,
      }),
      ...(newLoan.renewalpledgecard && {
        renewalpledgecard: newLoan.renewalpledgecard,
      }),
      ...(newLoan.signedpledgecard && {
        signedpledgecard: newLoan.signedpledgecard,
      }),
    },
  };

  await LoanService.update(loan);
}
```

```js
const array1 = [1, 2, 3, 4];
const array2 = [5, 6, 7, 8];
const array3 = [...array1, ...array2];

const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { d: 4, e: 5, a: 6 };
const obj3 = { ...obj1, ...obj2 };

function pick(...keys) {
  // pick and return
}

const keys = ['id', 'netweight'];
const data = pick(...keys);
```

Little Better

```js
function buildLoanUpdateRequest(oldLoan, newLoan, newscheme) {
  return {
    loan: newLoan,
    uloans: oldLoan.uloans,
    newamount: newLoan.newunsecureamount,
    oldamount: newLoan.oldunsecureamount,
    oldlploanid: newLoan.lploanid,
    oldscheme: newLoan.oldschemeid,
    newscheme: newLoan.newschemeid,
    newschemeobj: newscheme,
    pledgecardimage: newLoan.pledgecard,
    repledgedate: newLoan.newloandate,
    urepledgehistory: oldLoan.urepledgehistory,
    ...(oldLoan.netWeight > 0 && {
      uLoanIds: oldLoan.uLoanIds,
      unSecureScheme: oldLoan.scheme,
    })
  };
}

async function sendSomeData(oldLoan, newLoan, newscheme) {
  const loan = buildLoanUpdateRequest(oldLoan, newLoan, newscheme);
  await LoanService.update(loan);
}
```

Better

```js
function buildLoanUpdateRequest(oldLoan, newLoan, newscheme) {
  const loan = {
    loan: newLoan,
    uloans: oldLoan.uloans,
    newamount: newLoan.newunsecureamount,
    oldamount: newLoan.oldunsecureamount,
    oldlploanid: newLoan.lploanid,
    oldscheme: newLoan.oldschemeid,
    newscheme: newLoan.newschemeid,
    newschemeobj: newscheme,
    pledgecardimage: newLoan.pledgecard,
    repledgedate: newLoan.newloandate,
    urepledgehistory: oldLoan.urepledgehistory,
  };

  if (isSecure(oldLoan)) {
    Object.assign(loan, {
      uLoanIds: oldLoan.uLoanIds,
      unSecureScheme: oldLoan.scheme,
    });
  }

  return loan;
}

async function sendSomeData(oldLoan, newLoan, newscheme) {
  const loan = buildLoanUpdateRequest(oldLoan, newLoan, newscheme);
  await LoanService.update(loan);
}
```

>“We have far too many ways to interpret past events for our own good.”
>
>― Nassim Nicholas Taleb, The Black Swan

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
