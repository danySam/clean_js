# Clean Code in JS

## Introduction
- Not going to spend much time talking about if writing clean code is an art or a skill
- Some of these are guidlines
- Hoping that by the end of the talk you get a feel of what is clean code, how to make code cleaner, etc
- Myself: Software consultant from nilenso. Been working with Rupeek for over 6 months.
- The points discussed today are not exhaustive and they are not rules. I am going to addressing some code issues using examples from the services that I have worked with.


### Readability

### Maintainability

### Reusability

## Naming
- Constants
- Meaninful
- Explicit
- Chose a style, camelCase, snake_case, but stick to it

> examples of refactoring code
> variable names, funciton names, argument names, etc

### Uniformity in naming
> Similar to ## Standardization

### Don't leave them guessing
- It's not a thriller movie
- There shouldn't be any surprises in your code
- Functions should do what they say, and only that
- Variables should encapsulate on concept, it shouldn't mean different things based on context
- Use variables / functions over predicates that you need context to understand

## Composition
- Do not repeat
- Repetition is difficult to maintain
- Easier to test logic
- Easier to modify

Example:

```
const benchmark = _.get(_.find(scheme.baseSchemes, { type: 'unsecure' }), 'goldBenchmark', loan.lenderid);
```

## Mututaion
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
  -

## Comments and Documentation

## Testing

## Scouts Rule
- Leave things in a better than you found it
- If there was broken glass pieces on your floor you wouldn't just walk over it
- You may want to do this but might be afraid to break things
- Testing will help you be more confident in making these changes

## Do one thing at a time

## Dead code

## Automate
- Don't do things by hand
- Use linter
- Configure your editor to pick up linting config
- Add to your pipeline

## Standardaization
- Validation / Coercion should happen at boundaries

## Functions should do one thing
