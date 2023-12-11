'use strict';

class RuleError extends Error {
  constructor(cause, ...args) {
    super(cause);
    this.args = args;
  }
}

const ACCEPTED = "accepted";
const ALPHA = "alpha";
const ALPHA_NUM = "alpha-num";
const ALPHA_NUM_DASH = "alpha-num-dash";
const BETWEEN_LENGTH = "between-length";
const BETWEEN_NUMBER = "between-number";
const DIGITS = "digits";
const EMAIL = "email";
const ENDS_WITH = "ends-with";
const EQUAL_LENGTH = "equal-length";
const EQUAL_NUMBER = "equal-number";
const GREATER_EQUAL = "greater-equal";
const INTEGER = "integer";
const LESS_EQUAL = "less-equal";
const MAX_LENGTH = "max-length";
const MIN_LENGTH = "min-length";
const NUM_DASH = "num-dash";
const NUMBER = "number";
const REGEX = "regex";
const REQUIRED = "required";
const STARTS_WITH = "starts-with";
const WITHIN = "within";

function accepted(value) {
  if (value === "checked") {
    return true;
  }
  return new RuleError(ACCEPTED);
}

const email$1 = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const integer = /^[+-]?\d+$/;
const number$1 = /^[+-]?(\d+|\d*\.\d*)$/;
const alpha$1 = /^[\p{L}\p{M}]+$/u;
const alphaNum$1 = /^[\p{L}\p{M}\p{N}]+$/u;
const alphaNumDash$1 = /^[\p{L}\p{M}\p{N}_-]+$/u;
const numDash$1 = /^[\p{N}_-]+$/u;

function alpha(value) {
  return alpha$1.test(value) || new RuleError(ALPHA);
}

function alphaNum(value) {
  return alphaNum$1.test(value) || new RuleError(ALPHA_NUM);
}

function alphaNumDash(value) {
  return alphaNumDash$1.test(value) || new RuleError(ALPHA_NUM_DASH);
}

class Language {
  set(lang) {
    this.lang = lang;
  }
  get() {
    return typeof this.lang === "object" ? this.lang : {};
  }
}
const Language$1 = new Language();

const TYPE_CHECKBOX = "checkbox";
const TYPE_RADIO = "radio";

function toCamelCase(value) {
  return value.replace(/-./g, (match) => match[1].toUpperCase());
}
function getValue(element) {
  if (element instanceof HTMLInputElement) {
    if (element.type === TYPE_CHECKBOX || element.type === TYPE_RADIO) {
      return element.checked ? "checked" : "";
    }
    return element.value;
  }
  if (element instanceof HTMLTextAreaElement) {
    return element.value;
  }
  if (element instanceof HTMLSelectElement) {
    return Array.from(element.selectedOptions).map((option) => option.value).join(",");
  }
  return "";
}
function format(message, ...toReplace) {
  return message.replace(/\$(\d)/g, (_, index) => toReplace?.[index - 1] || "");
}
function processRule(rule, xRules) {
  let [name, argsText = ""] = rule.split(":");
  if (isXRule(rule)) {
    if (!hasArgument(rule)) {
      throw new Error(`${rule}: x-rules require an argument that is defined in the config.xRules object`);
    }
    name = name.substring(2);
    argsText = String(xRules?.[argsText]) || "";
  }
  return {
    name,
    argsText,
    args: processArgs(argsText)
  };
}
function processArgs(args) {
  return args ? args.split(",") : [];
}
function lang(key, ...args) {
  const languages = Language$1.get();
  let item = key;
  if (Object.prototype.hasOwnProperty.call(languages, key)) {
    item = languages[key];
  }
  return format(item, ...args);
}
function when(condition) {
  return {
    throwError(message) {
      if (condition) {
        throw new Error(message);
      }
    }
  };
}
function defaultErrorListeners(events) {
  events.on("field:error", (_parentEl, element, errors) => {
    errors.reverse().forEach((error) => {
      const messageElement = document.createElement("p");
      messageElement.classList.add("validator-err");
      messageElement.innerHTML = error.message;
      if (element.parentNode) {
        element.parentNode.insertBefore(messageElement, element.nextSibling);
      }
    });
  });
  events.on("validation:start", (container) => {
    container.querySelectorAll(".validator-err").forEach((el) => {
      el.remove();
    });
  });
}
function hasArgument(rule) {
  return rule.includes(":") && rule.split(":").length === 2;
}
function isXRule(rule) {
  return rule.startsWith("x-");
}

const ARGUMENT_MUST_BE_PROVIDED = "An argument must be provided";
const ARGUMENT_MUST_BE_A_NUMBER = "The argument must be a number";
const ARGUMENT_MUST_BE_POSITIVE = "The argument must be a positive number";
const ARGUMENT_MUST_BE_AN_INTEGER = "The argument must be an integer";
const INVALID_PATTERN = "Invalid pattern provided";

function between(value, args = "") {
  const [type, minArg, maxArg] = processArgs(args);
  when(!type).throwError(ARGUMENT_MUST_BE_PROVIDED);
  when(!minArg || !maxArg).throwError(ARGUMENT_MUST_BE_PROVIDED);
  const min = Number(minArg);
  const max = Number(maxArg);
  when(Number.isNaN(min) || Number.isNaN(max)).throwError(ARGUMENT_MUST_BE_A_NUMBER);
  when(min > max).throwError("min must be less than max");
  when(min === max).throwError("min and max must not be equal");
  if (type === "number") {
    return betweenForNumber(value, min, max);
  } else {
    return betweenForString(value, min, max);
  }
}
function betweenForNumber(value, min, max) {
  const valueInNumber = Number(value);
  if (value !== "" && !Number.isNaN(valueInNumber) && valueInNumber >= min && valueInNumber <= max) {
    return true;
  }
  return new RuleError(BETWEEN_NUMBER, String(min), String(max));
}
function betweenForString(value, min, max) {
  when(min < 0 || max < 0).throwError(ARGUMENT_MUST_BE_POSITIVE);
  if (value.length >= min && value.length <= max) {
    return true;
  }
  return new RuleError(BETWEEN_LENGTH, String(min), String(max));
}

function digits(value, digitLength = "") {
  when(digitLength === "").throwError(ARGUMENT_MUST_BE_PROVIDED);
  when(int(digitLength) !== true || +digitLength < 1).throwError(ARGUMENT_MUST_BE_AN_INTEGER);
  const regex = new RegExp(`^-?[0-9]{${digitLength}}$`);
  return regex.test(value) ? true : new RuleError(DIGITS, digitLength);
}

function endsWith(value, end = "") {
  when(end === "").throwError(ARGUMENT_MUST_BE_PROVIDED);
  return value.endsWith(end) || new RuleError(ENDS_WITH, end);
}

function email(value) {
  return email$1.test(value) || new RuleError(EMAIL);
}

function min(value, args = "") {
  const [type, min2] = processArgs(args);
  when(!type).throwError(ARGUMENT_MUST_BE_PROVIDED);
  when(!min2).throwError(ARGUMENT_MUST_BE_PROVIDED);
  const minInNumber = Number(min2);
  when(Number.isNaN(minInNumber)).throwError(ARGUMENT_MUST_BE_A_NUMBER);
  if (type === "number") {
    return minForNumber(value, minInNumber);
  } else {
    return minForString(value, minInNumber);
  }
}
function minForNumber(value, min2) {
  const valueInNumber = Number(value);
  if (value !== "" && !Number.isNaN(valueInNumber) && valueInNumber >= min2) {
    return true;
  }
  return new RuleError(GREATER_EQUAL, String(min2));
}
function minForString(value, min2) {
  when(min2 < 0).throwError(ARGUMENT_MUST_BE_POSITIVE);
  if (value.length >= min2) {
    return true;
  }
  return new RuleError(MIN_LENGTH, String(min2));
}

function int(value) {
  return integer.test(value) || new RuleError(INTEGER);
}

function max(value, args = "") {
  const [type, max2] = processArgs(args);
  when(!type).throwError(ARGUMENT_MUST_BE_PROVIDED);
  when(!max2).throwError(ARGUMENT_MUST_BE_PROVIDED);
  const maxInNumber = Number(max2);
  when(Number.isNaN(maxInNumber)).throwError(ARGUMENT_MUST_BE_A_NUMBER);
  if (type === "number") {
    return maxForNumber(value, maxInNumber);
  } else {
    return maxForString(value, maxInNumber);
  }
}
function maxForNumber(value, max2) {
  const valueInNumber = Number(value);
  if (value !== "" && !Number.isNaN(valueInNumber) && valueInNumber <= max2) {
    return true;
  }
  return new RuleError(LESS_EQUAL, String(max2));
}
function maxForString(value, max2) {
  when(max2 < 0).throwError(ARGUMENT_MUST_BE_POSITIVE);
  if (value.length <= max2) {
    return true;
  }
  return new RuleError(MAX_LENGTH, String(max2));
}

function number(value) {
  return number$1.test(value) || new RuleError(NUMBER);
}

function numDash(value) {
  return numDash$1.test(value) || new RuleError(NUM_DASH);
}

const isValidPattern = (pattern) => {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
};
const stringToRegex = (str) => {
  const main = str.match(/\/(.+)\/.*/)?.[1] ?? "";
  const options = str.match(/\/.+\/(.*)/)?.[1] ?? "";
  return new RegExp(main, options);
};
function regex(value, pattern) {
  when(!pattern).throwError(ARGUMENT_MUST_BE_PROVIDED);
  when(isValidPattern(pattern) === false).throwError(INVALID_PATTERN);
  const regExp = stringToRegex(pattern);
  return regExp.test(value) || new RuleError(REGEX);
}

function required(value) {
  return value.trim().length > 0 || new RuleError(REQUIRED);
}

function requiredIf(value, targetValue = "") {
  const isTargetValueProvided = required(targetValue);
  if (isTargetValueProvided === true) {
    return required(value);
  }
  return true;
}

function size(value, args = "") {
  const [type, size2] = processArgs(args);
  when(!type).throwError(ARGUMENT_MUST_BE_PROVIDED);
  when(!size2).throwError(ARGUMENT_MUST_BE_PROVIDED);
  const sizeInNumber = Number(size2);
  when(Number.isNaN(sizeInNumber)).throwError(ARGUMENT_MUST_BE_A_NUMBER);
  return type === "number" ? sizeForNumber(value, sizeInNumber) : sizeForString(value, sizeInNumber);
}
function sizeForNumber(value, size2) {
  const valueInNumber = Number(value);
  if (value !== "" && !Number.isNaN(valueInNumber) && valueInNumber === size2) {
    return true;
  }
  return new RuleError(EQUAL_NUMBER, String(size2));
}
function sizeForString(value, size2) {
  when(size2 < 0).throwError(ARGUMENT_MUST_BE_POSITIVE);
  if (value.length === size2) {
    return true;
  }
  return new RuleError(EQUAL_LENGTH, String(size2));
}

function startsWith(value, start = "") {
  when(start === "").throwError(ARGUMENT_MUST_BE_PROVIDED);
  return value.startsWith(start) || new RuleError(STARTS_WITH, start);
}

function within(value, values) {
  const [type, ...list] = processArgs(values);
  when(!type).throwError(ARGUMENT_MUST_BE_PROVIDED);
  if (type === "array") {
    const splittedValue = processArgs(value);
    for (const value2 of splittedValue) {
      if (!list.includes(value2)) {
        return new RuleError(WITHIN);
      }
    }
    return true;
  }
  return list.includes(value) || new RuleError(WITHIN);
}

const rules = {
  __proto__: null,
  accepted: accepted,
  alpha: alpha,
  alphaNum: alphaNum,
  alphaNumDash: alphaNumDash,
  between: between,
  digits: digits,
  email: email,
  endsWith: endsWith,
  in: within,
  int: int,
  integer: int,
  max: max,
  min: min,
  numDash: numDash,
  number: number,
  regex: regex,
  required: required,
  requiredIf: requiredIf,
  size: size,
  startsWith: startsWith,
  within: within
};

class ValidatorError {
  constructor() {
    this.lang = Language$1.get();
    this.errorsList = [];
  }
  setError(element, rule, ruleError) {
    let errors = this.errorsList.find((error) => error[0].element === element);
    if (!errors) {
      errors = [];
      this.errorsList.push(errors);
    }
    const errorMessage = lang(ruleError.message, ...ruleError.args);
    const errorDetail = {
      message: errorMessage,
      element,
      rule,
      cause: ruleError.message,
      args: ruleError.args
    };
    errors.push(errorDetail);
  }
  get hasError() {
    return Object.keys(this.errorsList).length > 0;
  }
  get errors() {
    return this.errorsList;
  }
  clearErrors() {
    this.errorsList = [];
  }
}

class EventBus {
  constructor(events = {}) {
    this.events = {};
    const keys = Object.keys(events);
    keys.forEach((key) => {
      if (typeof events[key] === "function") {
        this.events[key] = [];
        this.events[key].push(events[key]);
      }
    });
  }
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    const events = this.events[event];
    events.push(callback);
  }
  off(event, callback) {
    if (typeof this.events[event] === "undefined") {
      return;
    }
    const events = this.events[event];
    const index = events.indexOf(callback);
    if (index !== -1) {
      events.splice(index, 1);
    }
  }
  call(event, ...args) {
    if (typeof this.events[event] !== "undefined") {
      const events = this.events[event];
      events.forEach((callback) => {
        callback(...args);
      });
    }
  }
  clear() {
    this.events = {};
  }
}

const mapMethods = {
  requiredIf: prependTargetValue,
  between: prependType,
  size: prependType,
  min: prependType,
  max: prependType,
  in: prependType
};
function adaptRule(rule, rules, field, container, xRules) {
  const ruleName = toCamelCase(processRule(rule, xRules).name);
  return mapMethods[ruleName]?.(rule, rules, field, container, xRules) || rule;
}
function prependType(rule, rules, _field, _parentEl, xRules) {
  const { name, argsText } = processRule(rule, xRules);
  const indexOfRule = rules.indexOf(rule);
  const rulesBeforeRule = rules.slice(0, indexOfRule);
  let type = "string";
  if (rulesBeforeRule.includes("number") || rulesBeforeRule.includes("int") || rulesBeforeRule.includes("integer")) {
    type = "number";
  } else if (rulesBeforeRule.includes("array")) {
    type = "array";
  }
  return `${name}:${type},${argsText}`;
}
function prependTargetValue(rule, _rules, _field, _parentEl, xRules) {
  const { name, args } = processRule(rule, xRules);
  if (args.length === 0)
    return name;
  let targetValue = "";
  if (args.length > 0) {
    const targetField = document.getElementById(args[0]);
    if (targetField !== null) {
      targetValue = getValue(targetField);
    }
  }
  args.splice(0, 1, targetValue);
  return `${name}:${args.join(",")}`;
}

const defaultOptions = {
  renderErrors: true,
  onFieldChangeValidationDelay: 500
};
class Validator {
  constructor(container, options = {}) {
    if (container === null || !(container instanceof HTMLElement)) {
      throw new Error("Invalid container element");
    }
    this.options = Object.assign(defaultOptions, options);
    this.validatorError = new ValidatorError();
    this.events = new EventBus(this.options.on);
    this.container = container;
    Language$1.set(this.options.lang);
    if (this.options.renderErrors) {
      defaultErrorListeners(this.events);
    }
    this.events.on("validation:start", () => this.validatorError.clearErrors());
    this.events.on("validation:failed", () => this.triggerFieldErrorEvent());
    if (options.onFieldChangeValidation) {
      this.validateOnFieldChange();
    }
  }
  validate(fields, shouldFireResultsEvent = true) {
    this.events.call("validation:start", this.container);
    let isSuccessful = true;
    let status = "success";
    if (fields === void 0) {
      fields = this.container.querySelectorAll("[data-rules]");
    }
    if (fields.length > 0) {
      isSuccessful = this.validateFields(Array.from(fields));
      status = isSuccessful ? "success" : "failed";
    }
    this.events.call("validation:end", this.container, isSuccessful);
    if (shouldFireResultsEvent) {
      this.events.call(`validation:${status}`, this.container);
    }
    return isSuccessful;
  }
  on(event, callback) {
    this.events.on(event, callback);
  }
  off(event, callback) {
    this.events.off(event, callback);
  }
  validateFields(fields) {
    for (const field of fields) {
      const fieldRules = field.getAttribute("data-rules")?.split("|");
      if (fieldRules && fieldRules.length > 0) {
        const value = getValue(field);
        const shouldStopOnFirstFailure = this.shouldStopOnFirstFailure(fieldRules);
        const computedFieldRules = this.getComputedFieldRules(fieldRules, field);
        for (const fieldRule of computedFieldRules) {
          const { name: ruleName, argsText: ruleArgs } = processRule(fieldRule, this.options.xRules);
          const ruleKey = toCamelCase(ruleName);
          if (this.isNullable(ruleKey) && value === "") {
            break;
          }
          if (ruleKey in rules) {
            try {
              const result = rules[ruleKey](value, ruleArgs);
              if (result instanceof RuleError) {
                this.validatorError.setError(field, ruleName, result);
                if (shouldStopOnFirstFailure) {
                  break;
                }
              }
            } catch (error) {
              console.error(new Error(`${ruleName}: ${error.message}`));
              return false;
            }
          }
        }
      }
    }
    return !this.validatorError.hasError;
  }
  shouldStopOnFirstFailure(givenRules) {
    return givenRules.includes("bail");
  }
  isNullable(givenRules) {
    return givenRules === "nullable";
  }
  getComputedFieldRules(givenRules, field) {
    return givenRules.map((rule) => adaptRule(rule, givenRules, field, this.container, this.options.xRules));
  }
  triggerFieldErrorEvent() {
    const totalErrors = this.validatorError.errors;
    totalErrors.forEach((fieldErrors) => {
      if (fieldErrors.length === 0)
        return;
      this.events.call("field:error", this.container, fieldErrors[0].element, fieldErrors);
    });
  }
  validateOnFieldChange() {
    let timeout;
    this.container.addEventListener("input", (event) => {
      window.clearTimeout(timeout);
      const delay = this.options.onFieldChangeValidationDelay;
      timeout = window.setTimeout(() => {
        const target = event.target;
        if (target.matches("[data-rules]")) {
          const result = this.validate([target], false);
          if (result === false) {
            this.triggerFieldErrorEvent();
          }
        }
      }, delay);
    });
  }
  setLanguage(lang) {
    Language$1.set(lang);
  }
}
const Validator$1 = Validator;

const enLang = {
  [ACCEPTED]: "Please accept this field",
  [ALPHA]: "Please enter only alphabetic characters",
  [ALPHA_NUM]: "Please enter only alpha-numeric characters",
  [ALPHA_NUM_DASH]: "Please enter only alpha-numeric characters, dashes, and underscores",
  [BETWEEN_LENGTH]: "The value must have between $1 and $2 characters",
  [BETWEEN_NUMBER]: "Please enter a number between $1 and $2",
  [DIGITS]: "The value must be a $1-digits number",
  [EMAIL]: "Please enter a valid email address",
  [ENDS_WITH]: 'The value must ends with "$1"',
  [EQUAL_LENGTH]: "The value must have $1 characters",
  [EQUAL_NUMBER]: "The value must be equal to $1",
  [GREATER_EQUAL]: "Please enter a number greater than or equal to $1",
  [INTEGER]: "The value must be a valid integer",
  [LESS_EQUAL]: "Please enter a number less than or equal to $1",
  [MAX_LENGTH]: "Max length is $1",
  [MIN_LENGTH]: "Min length is $1",
  [NUM_DASH]: "Please enter numbers with dashes and underscores",
  [NUMBER]: "Please enter a valid number",
  [REGEX]: "The value doesn't match the pattern",
  [REQUIRED]: "This field is required",
  [STARTS_WITH]: 'The value must start with "$1"',
  [WITHIN]: "The value is incorrect"
};
const enLang$1 = enLang;

const faLang = {
  [ACCEPTED]: "\u0644\u0637\u0641\u0627 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0631\u0627 \u062A\u06CC\u06A9 \u0628\u0632\u0646\u06CC\u062F",
  [ALPHA]: "\u0644\u0637\u0641\u0627\u064B \u0641\u0642\u0637 \u062D\u0631\u0648\u0641 \u0627\u0644\u0641\u0628\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [ALPHA_NUM]: "\u0644\u0637\u0641\u0627\u064B \u0641\u0642\u0637 \u0627\u0639\u062F\u0627\u062F\u060C \u0632\u06CC\u0631 \u062E\u0637 \u0648 \u062E\u0637 \u0641\u0627\u0635\u0644\u0647 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [ALPHA_NUM_DASH]: "\u0644\u0637\u0641\u0627\u064B \u0641\u0642\u0637 \u062D\u0631\u0648\u0641 \u0627\u0644\u0641\u0628\u0627\u060C \u0627\u0639\u062F\u0627\u062F\u060C \u0632\u06CC\u0631 \u062E\u0637 \u0648 \u062E\u0637 \u0641\u0627\u0635\u0644\u0647 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [BETWEEN_LENGTH]: "\u0645\u0642\u062F\u0627\u0631 \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 $1 \u0648 $2 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F",
  [BETWEEN_NUMBER]: "\u0644\u0637\u0641\u0627 \u06CC\u06A9 \u0639\u062F\u062F \u0628\u06CC\u0646 $1 \u0648 $2 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [DIGITS]: "\u0645\u0642\u062F\u0627\u0631 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0628\u0627\u06CC\u062F $1 \u0631\u0642\u0645 \u0628\u0627\u0634\u062F",
  [EMAIL]: "\u0644\u0637\u0641\u0627 \u06CC\u06A9 \u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644 \u0645\u0639\u062A\u0628\u0631 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [ENDS_WITH]: '\u0645\u0642\u062F\u0627\u0631 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0628\u0627\u06CC\u062F \u0628\u0627 "$1" \u067E\u0627\u06CC\u0627\u0646 \u062F\u0627\u062F\u0647 \u0634\u0648\u062F',
  [EQUAL_LENGTH]: "\u0645\u0642\u062F\u0627\u0631 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0628\u0627\u06CC\u062F $1 \u062D\u0631\u0641 \u0628\u0627\u0634\u062F",
  [EQUAL_NUMBER]: "\u0645\u0642\u062F\u0627\u0631 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0628\u0627\u06CC\u062F $1 \u0628\u0627\u0634\u062F",
  [GREATER_EQUAL]: "\u0644\u0637\u0641\u0627 \u06CC\u06A9 \u0639\u062F\u062F \u0628\u0632\u0631\u06AF\u062A\u0631 \u06CC\u0627 \u0645\u0633\u0627\u0648\u06CC $1 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [INTEGER]: "\u0645\u0642\u062F\u0627\u0631 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0628\u0627\u06CC\u062F \u06CC\u06A9 \u0639\u062F\u062F \u0635\u062D\u06CC\u062D \u0628\u0627\u0634\u062F",
  [LESS_EQUAL]: "\u0644\u0637\u0641\u0627 \u06CC\u06A9 \u0639\u062F\u062F \u06A9\u0648\u0686\u06A9\u062A\u0631 \u06CC\u0627 \u0645\u0633\u0627\u0648\u06CC $1 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [MAX_LENGTH]: "\u062D\u062F\u0627\u06A9\u062B\u0631 \u0637\u0648\u0644 \u0645\u062C\u0627\u0632 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F $1 \u0627\u0633\u062A",
  [MIN_LENGTH]: "\u062D\u062F\u0627\u0642\u0644 \u0637\u0648\u0644 \u0645\u062C\u0627\u0632 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F $1 \u0627\u0633\u062A",
  [REGEX]: "\u0645\u0642\u062F\u0627\u0631 \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC \u0645\u0634\u062E\u0635 \u0634\u062F\u0647 \u0647\u0645\u062E\u0648\u0627\u0646\u06CC \u0646\u062F\u0627\u0631\u062F",
  [REQUIRED]: "\u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A",
  [NUM_DASH]: "\u0644\u0637\u0641\u0627\u064B \u0641\u0642\u0637 \u0627\u0639\u062F\u0627\u062F \u0628\u0627 \u0632\u06CC\u0631\u062E\u0637 \u0648 \u062E\u0637 \u0641\u0627\u0635\u0644\u0647 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [NUMBER]: "\u0644\u0637\u0641\u0627 \u06CC\u06A9 \u0639\u062F\u062F \u0645\u0639\u062A\u0628\u0631 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F",
  [STARTS_WITH]: '\u0645\u0642\u062F\u0627\u0631 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0628\u0627\u06CC\u062F \u0628\u0627 "$1" \u0634\u0631\u0648\u0639 \u0634\u0648\u062F',
  [WITHIN]: "\u0645\u0642\u062F\u0627\u0631 \u0627\u06CC\u0646 \u0641\u06CC\u0644\u062F \u0646\u0627\u062F\u0631\u0633\u062A \u0627\u0633\u062A"
};
const faLang$1 = faLang;

const frLang = {
  [ACCEPTED]: "Veuillez accepter ce champ",
  [ALPHA]: "Veuillez saisir uniquement des caract\xE8res alphab\xE9tiques",
  [ALPHA_NUM]: "Veuillez saisir uniquement des caract\xE8res alphanum\xE9riques",
  [ALPHA_NUM_DASH]: "Veuillez saisir uniquement des caract\xE8res alphanum\xE9riques, des tirets et des caract\xE8res de soulignement",
  [BETWEEN_LENGTH]: "La valeur doit comporter entre $1 et $2 caract\xE8res",
  [BETWEEN_NUMBER]: "Veuillez saisir un nombre entre $1 et $2 caract\xE8res",
  [DIGITS]: "La valeur doit \xEAtre un nombre \xE0 $1 chiffre",
  [EMAIL]: "Veuillez saisir une adresse \xE9lectronique valide",
  [ENDS_WITH]: 'La valeur doit se terminer par "$1"',
  [EQUAL_LENGTH]: "La valeur doit avoir des caract\xE8res de $1",
  [EQUAL_NUMBER]: "La valeur doit \xEAtre \xE9gale \xE0 $1",
  [GREATER_EQUAL]: "Veuillez saisir un nombre sup\xE9rieur ou \xE9gal \xE0 $1",
  [INTEGER]: "La valeur doit \xEAtre un nombre entier valide",
  [LESS_EQUAL]: "Veuillez entrer un nombre inf\xE9rieur ou \xE9gal \xE0 $1",
  [MAX_LENGTH]: "La longueur maximale est de $1",
  [MIN_LENGTH]: "La longueur minimale est de $1",
  [NUM_DASH]: "Veuillez saisir les chiffres avec des tirets et des caract\xE8res de soulignement",
  [NUMBER]: "Veuillez entrer un nombre valide",
  [REGEX]: "La valeur ne correspond pas au mod\xE8le",
  [REQUIRED]: "Ce champ est obligatoire",
  [STARTS_WITH]: 'La valeur doit commencer par "$1"',
  [WITHIN]: "La valeur est incorrecte"
};
const frLang$1 = frLang;

const deLang = {
  [ACCEPTED]: "Bitte akzeptieren Sie dieses Feld",
  [ALPHA]: "Bitte geben Sie nur alphabetische Zeichen ein",
  [ALPHA_NUM]: "Bitte geben Sie nur alphanumerische Zeichen ein",
  [ALPHA_NUM_DASH]: "Bitte geben Sie nur alphanumerische Zeichen, Bindestriche und Unterstriche ein",
  [BETWEEN_LENGTH]: "Der Wert muss zwischen $1 und $2 Zeichen haben",
  [BETWEEN_NUMBER]: "Bitte geben Sie eine Zahl zwischen $1 und $2 ein",
  [DIGITS]: "Der Wert muss eine $1-stellige Zahl sein",
  [EMAIL]: "Bitte geben Sie eine g\xFCltige E-Mail-Adresse ein",
  [ENDS_WITH]: 'Der Wert muss mit "$1" enden',
  [EQUAL_LENGTH]: "Der Wert muss $1 Zeichen haben",
  [EQUAL_NUMBER]: "Der Wert muss gleich $1 sein",
  [GREATER_EQUAL]: "Bitte geben Sie eine Zahl ein, die gr\xF6\xDFer oder gleich $1 ist",
  [INTEGER]: "Der Wert muss eine g\xFCltige Ganzzahl sein",
  [LESS_EQUAL]: "Bitte geben Sie eine Zahl ein, die kleiner oder gleich $1 ist",
  [MAX_LENGTH]: "Maximale L\xE4nge ist $1",
  [MIN_LENGTH]: "Die Mindestl\xE4nge ist $1",
  [NUM_DASH]: "Bitte geben Sie Zahlen mit Bindestrichen und Unterstrichen ein",
  [NUMBER]: "Bitte geben Sie eine g\xFCltige Zahl ein",
  [REGEX]: "Der Wert stimmt nicht mit dem Muster \xFCberein",
  [REQUIRED]: "Dieses Feld ist erforderlich",
  [STARTS_WITH]: 'Der Wert muss mit "$1" beginnen',
  [WITHIN]: "Der Wert ist falsch"
};
const deLang$1 = deLang;

const itLang = {
  [ACCEPTED]: "Si prega di accettare questo campo",
  [ALPHA]: "Inserire solo caratteri alfabetici",
  [ALPHA_NUM]: "Inserire solo caratteri alfanumerici",
  [ALPHA_NUM_DASH]: "Inserire solo caratteri alfanumerici, trattini e trattini bassi",
  [BETWEEN_LENGTH]: "Il valore deve essere compreso tra $1 e $2 caratteri",
  [BETWEEN_NUMBER]: "Inserire un numero compreso tra $1 e $2",
  [DIGITS]: "Il valore deve essere un numero di $1 cifra",
  [EMAIL]: "Inserire un indirizzo e-mail valido",
  [ENDS_WITH]: 'Il valore deve terminare con "$1"',
  [EQUAL_LENGTH]: "Il valore deve avere caratteri da $1",
  [EQUAL_NUMBER]: "Il valore deve essere uguale a $1",
  [GREATER_EQUAL]: "Inserisci un numero maggiore o uguale a $1",
  [INTEGER]: "Il valore deve essere un numero intero valido",
  [LESS_EQUAL]: "Inserire un numero minore o uguale a $1",
  [MAX_LENGTH]: "La lunghezza massima \xE8 $1",
  [MIN_LENGTH]: "La lunghezza minima \xE8 $1",
  [NUM_DASH]: "Inserisci numeri con trattini e trattini bassi",
  [NUMBER]: "Inserire un numero valido",
  [REGEX]: "Il valore non corrisponde al modello",
  [REQUIRED]: "Questo campo \xE8 obbligatorio",
  [STARTS_WITH]: 'Il valore deve iniziare con "$1"',
  [WITHIN]: "Il valore non \xE8 corretto"
};
const itLang$1 = itLang;

const zhLang = {
  [ACCEPTED]: "\u8BF7\u63A5\u53D7\u6B64\u5B57\u6BB5",
  [ALPHA]: "\u8BF7\u4EC5\u8F93\u5165\u5B57\u6BCD\u5B57\u7B26",
  [ALPHA_NUM]: "\u8BF7\u4EC5\u8F93\u5165\u5B57\u6BCD\u6570\u5B57\u5B57\u7B26",
  [ALPHA_NUM_DASH]: "\u8BF7\u4EC5\u8F93\u5165\u5B57\u6BCD\u6570\u5B57\u5B57\u7B26\u3001\u7834\u6298\u53F7\u548C\u4E0B\u5212\u7EBF",
  [BETWEEN_LENGTH]: "\u503C\u5FC5\u987B\u4ECB\u4E8E $1 \u548C $2 \u4E4B\u95F4",
  [BETWEEN_NUMBER]: "\u8BF7\u8F93\u5165\u4E00\u4E2A\u4ECB\u4E8E $1 \u548C $2 \u4E4B\u95F4\u7684\u6570\u5B57",
  [DIGITS]: "\u8BE5\u503C\u5FC5\u987B\u662F $1 \u4F4D\u6570",
  [EMAIL]: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7535\u5B50\u90AE\u4EF6\u5730\u5740",
  [ENDS_WITH]: "\u503C\u5FC5\u987B\u4EE5\u201C$1\u201D\u7ED3\u5C3E",
  [EQUAL_LENGTH]: "\u503C\u5FC5\u987B\u6709 $1 \u4E2A\u5B57\u7B26",
  [EQUAL_NUMBER]: "\u503C\u5FC5\u987B\u7B49\u4E8E $1",
  [GREATER_EQUAL]: "\u8BF7\u8F93\u5165\u4E00\u4E2A\u5927\u4E8E\u6216\u7B49\u4E8E $1 \u7684\u6570\u5B57",
  [INTEGER]: "\u8BE5\u503C\u5FC5\u987B\u662F\u4E00\u4E2A\u6709\u6548\u7684\u6574\u6570",
  [LESS_EQUAL]: "\u8BF7\u8F93\u5165\u4E00\u4E2A\u5C0F\u4E8E\u6216\u7B49\u4E8E $1 \u7684\u6570\u5B57",
  [MAX_LENGTH]: "\u6700\u5927\u957F\u5EA6\u4E3A $1",
  [MIN_LENGTH]: "\u6700\u5C0F\u957F\u5EA6\u4E3A $1",
  [NUM_DASH]: "\u8BF7\u8F93\u5165\u5E26\u7834\u6298\u53F7\u548C\u4E0B\u5212\u7EBF\u7684\u6570\u5B57",
  [NUMBER]: "\u8BF7\u8F93\u5165\u4E00\u4E2A\u6709\u6548\u7684\u6570\u5B57",
  [REGEX]: "\u8BE5\u503C\u4E0E\u6A21\u5F0F\u4E0D\u5339\u914D",
  [REQUIRED]: "\u6B64\u5B57\u6BB5\u662F\u5FC5\u9700\u7684",
  [STARTS_WITH]: "\u503C\u5FC5\u987B\u4EE5\u201C$1\u201D\u5F00\u5934",
  [WITHIN]: "\u503C\u4E0D\u6B63\u786E"
};
const zhLang$1 = zhLang;

const csLang = {
  [ACCEPTED]: "P\u0159ijm\u011Bte toto pole",
  [ALPHA]: "Zadejte pouze abecedn\xED znaky",
  [ALPHA_NUM]: "Zadejte pouze alfanumerick\xE9 znaky",
  [ALPHA_NUM_DASH]: "Zadejte pouze alfanumerick\xE9 znaky, poml\u010Dky a podtr\u017E\xEDtka",
  [BETWEEN_LENGTH]: "Hodnota mus\xED m\xEDt $1 a\u017E $2 znak\u016F",
  [BETWEEN_NUMBER]: "Zadejte \u010D\xEDslo od $1 do $2",
  [DIGITS]: "Hodnota mus\xED b\xFDt \u010D\xEDslo s $1 \u010D\xEDslicemi",
  [EMAIL]: "Zadejte platnou emailovou adresu",
  [ENDS_WITH]: "Hodnota mus\xED kon\u010Dit znaky \u201E$1\u201C",
  [EQUAL_LENGTH]: "Hodnota mus\xED m\xEDt $1 znak\u016F",
  [EQUAL_NUMBER]: "Hodnota mus\xED b\xFDt rovna $1",
  [GREATER_EQUAL]: "Zadejte \u010D\xEDslo v\u011Bt\u0161\xED nebo rovn\xE9 $1",
  [INTEGER]: "Hodnota mus\xED b\xFDt platn\xE9 cel\xE9 \u010D\xEDslo",
  [LESS_EQUAL]: "Zadejte \u010D\xEDslo men\u0161\xED nebo rovn\xE9 $1",
  [MAX_LENGTH]: "Maxim\xE1ln\xED d\xE9lka je $1",
  [MIN_LENGTH]: "Minim\xE1ln\xED d\xE9lka je $1",
  [NUM_DASH]: "Zadejte \u010D\xEDsla s poml\u010Dkami a podtr\u017E\xEDtky",
  [NUMBER]: "Zadejte platn\xE9 \u010D\xEDslo",
  [REGEX]: "Hodnota neodpov\xEDd\xE1 vzoru",
  [REQUIRED]: "Toto pole je povinn\xE9",
  [STARTS_WITH]: "Hodnota mus\xED za\u010D\xEDnat znaky \u201E$1\u201C",
  [WITHIN]: "Hodnota je nespr\xE1vn\xE1"
};
const csLang$1 = csLang;

const nlLang = {
  [ACCEPTED]: "Accepteer dit veld a.u.b.",
  [ALPHA]: "Voer alleen alfabetische tekens in",
  [ALPHA_NUM]: "Alleen alfanumerieke tekens a.u.b",
  [ALPHA_NUM_DASH]: "Voer alleen alfanumerieke tekens, streepjes en underscores in",
  [BETWEEN_LENGTH]: "De waarde moet tussen $1 en $2 tekens liggen",
  [BETWEEN_NUMBER]: "Voer een getal tussen $1 en $2 in",
  [DIGITS]: "De waarde moet een getal van 1 cijfer zijn.",
  [EMAIL]: "Voer een geldig e-mailadres in",
  [ENDS_WITH]: 'De waarde moet eindigen op "$1"',
  [EQUAL_LENGTH]: "De waarde moet uit $1 tekens bestaan",
  [EQUAL_NUMBER]: "De waarde moet gelijk zijn aan $1",
  [GREATER_EQUAL]: "Voer a.u.b. een getal in groter dan of gelijk aan $1",
  [INTEGER]: "De waarde moet een geldig geheel getal zijn",
  [LESS_EQUAL]: "Voer a.u.b. een getal in kleiner dan of gelijk aan $1",
  [MAX_LENGTH]: "Max. lengte is $1",
  [MIN_LENGTH]: "Min. lengte is $1",
  [NUM_DASH]: "Voer getallen met streepjes en underscores in.",
  [NUMBER]: "Voer een geldig getal in",
  [REGEX]: "De waarde komt niet overeen met het patroon",
  [REQUIRED]: "Dit veld is verplicht",
  [STARTS_WITH]: 'De waarde moet beginnen met "$1"',
  [WITHIN]: "De waarde is onjuist"
};
const nlLang$1 = nlLang;

const createLang = (lang) => lang;

exports.Validator = Validator$1;
exports.createLang = createLang;
exports.csLang = csLang$1;
exports.deLang = deLang$1;
exports.enLang = enLang$1;
exports.faLang = faLang$1;
exports.frLang = frLang$1;
exports.itLang = itLang$1;
exports.nlLang = nlLang$1;
exports.zhLang = zhLang$1;
