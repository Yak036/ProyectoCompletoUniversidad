declare const ACCEPTED = "accepted";
declare const ALPHA = "alpha";
declare const ALPHA_NUM = "alpha-num";
declare const ALPHA_NUM_DASH = "alpha-num-dash";
declare const BETWEEN_LENGTH = "between-length";
declare const BETWEEN_NUMBER = "between-number";
declare const DIGITS = "digits";
declare const EMAIL = "email";
declare const ENDS_WITH = "ends-with";
declare const EQUAL_LENGTH = "equal-length";
declare const EQUAL_NUMBER = "equal-number";
declare const GREATER_EQUAL = "greater-equal";
declare const INTEGER = "integer";
declare const LESS_EQUAL = "less-equal";
declare const MAX_LENGTH = "max-length";
declare const MIN_LENGTH = "min-length";
declare const NUM_DASH = "num-dash";
declare const NUMBER = "number";
declare const REGEX = "regex";
declare const REQUIRED = "required";
declare const STARTS_WITH = "starts-with";
declare const WITHIN = "within";

declare const rules_ACCEPTED: typeof ACCEPTED;
declare const rules_ALPHA: typeof ALPHA;
declare const rules_ALPHA_NUM: typeof ALPHA_NUM;
declare const rules_ALPHA_NUM_DASH: typeof ALPHA_NUM_DASH;
declare const rules_BETWEEN_LENGTH: typeof BETWEEN_LENGTH;
declare const rules_BETWEEN_NUMBER: typeof BETWEEN_NUMBER;
declare const rules_DIGITS: typeof DIGITS;
declare const rules_EMAIL: typeof EMAIL;
declare const rules_ENDS_WITH: typeof ENDS_WITH;
declare const rules_EQUAL_LENGTH: typeof EQUAL_LENGTH;
declare const rules_EQUAL_NUMBER: typeof EQUAL_NUMBER;
declare const rules_GREATER_EQUAL: typeof GREATER_EQUAL;
declare const rules_INTEGER: typeof INTEGER;
declare const rules_LESS_EQUAL: typeof LESS_EQUAL;
declare const rules_MAX_LENGTH: typeof MAX_LENGTH;
declare const rules_MIN_LENGTH: typeof MIN_LENGTH;
declare const rules_NUMBER: typeof NUMBER;
declare const rules_NUM_DASH: typeof NUM_DASH;
declare const rules_REGEX: typeof REGEX;
declare const rules_REQUIRED: typeof REQUIRED;
declare const rules_STARTS_WITH: typeof STARTS_WITH;
declare const rules_WITHIN: typeof WITHIN;
declare namespace rules {
  export {
    rules_ACCEPTED as ACCEPTED,
    rules_ALPHA as ALPHA,
    rules_ALPHA_NUM as ALPHA_NUM,
    rules_ALPHA_NUM_DASH as ALPHA_NUM_DASH,
    rules_BETWEEN_LENGTH as BETWEEN_LENGTH,
    rules_BETWEEN_NUMBER as BETWEEN_NUMBER,
    rules_DIGITS as DIGITS,
    rules_EMAIL as EMAIL,
    rules_ENDS_WITH as ENDS_WITH,
    rules_EQUAL_LENGTH as EQUAL_LENGTH,
    rules_EQUAL_NUMBER as EQUAL_NUMBER,
    rules_GREATER_EQUAL as GREATER_EQUAL,
    rules_INTEGER as INTEGER,
    rules_LESS_EQUAL as LESS_EQUAL,
    rules_MAX_LENGTH as MAX_LENGTH,
    rules_MIN_LENGTH as MIN_LENGTH,
    rules_NUMBER as NUMBER,
    rules_NUM_DASH as NUM_DASH,
    rules_REGEX as REGEX,
    rules_REQUIRED as REQUIRED,
    rules_STARTS_WITH as STARTS_WITH,
    rules_WITHIN as WITHIN,
  };
}

type ErrorCause = typeof rules;
type LangKeys = ErrorCause[keyof ErrorCause];
type Lang = Partial<Record<LangKeys, string>>;
type XRules = Record<string, unknown>;
interface ValidatorOptions {
    lang?: Lang;
    on?: Partial<Events>;
    renderErrors?: boolean;
    xRules?: XRules;
    onFieldChangeValidation?: boolean;
    onFieldChangeValidationDelay?: number;
}
interface ErrorDetail {
    element: FormInputElement;
    rule: string;
    cause: string;
    message: string;
    args: string[];
}
interface Events {
    'validation:start': (container: HTMLElement) => void;
    'validation:end': (container: HTMLElement, isSuccessful: boolean) => void;
    'validation:success': (container: HTMLElement) => void;
    'validation:failed': (container: HTMLElement) => void;
    'field:error': (container: HTMLElement, element: FormInputElement, errors: ErrorDetail[]) => void;
}
type EventsName = keyof Events;
type FormInputElement = HTMLInputElement | HTMLSelectElement;

declare class Validator {
    private validatorError;
    private events;
    private options;
    private container;
    constructor(container: HTMLElement, options?: ValidatorOptions);
    validate(fields?: NodeListOf<FormInputElement> | FormInputElement[], shouldFireResultsEvent?: boolean): boolean;
    on<K extends EventsName>(event: K, callback: Events[K]): void;
    off<K extends EventsName>(event: K, callback: Events[K]): void;
    private validateFields;
    private shouldStopOnFirstFailure;
    private isNullable;
    private getComputedFieldRules;
    private triggerFieldErrorEvent;
    private validateOnFieldChange;
    setLanguage(lang: Lang): void;
}

declare const enLang: Record<LangKeys, string>;

declare const faLang: Record<LangKeys, string>;

declare const frLang: Record<LangKeys, string>;

declare const deLang: Record<LangKeys, string>;

declare const itLang: Record<LangKeys, string>;

declare const zhLang: Record<LangKeys, string>;

declare const csLang: Record<LangKeys, string>;

declare const nlLang: Record<LangKeys, string>;

declare const createLang: (lang: Lang) => Lang;

export { Validator, createLang, csLang, deLang, enLang, faLang, frLang, itLang, nlLang, zhLang };
