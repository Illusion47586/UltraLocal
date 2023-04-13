export class Literal {
  private _literal: string;
  private _params?: string[];
  private _constants?: string[];

  static VAR_REGEX =
    /(?=^|[^"'])((<variable>\S*<\/variable>)|(<var>\S*<\/var>))(?=$|[^"'])/gmu;
  static VAR_TAG_REGEX =
    /(?=^|[^"'])(<variable>|<\/variable>|<var>|<\/var>)(?=$|[^"'])/gmu;
  static CONST_REGEX =
    /(?=^|[^"'])((<nochange>\S*<\/nochange>)|(<nc>\S*<\/nc>))(?=$|[^"'])/gmu;
  static CONST_TAG_REGEX =
    /(?=^|[^"'])(<nochange>|<\/nochange>|<nc>|<\/nc>)(?=$|[^"'])/gmu;
  static genRegex = (word: string, use: "var" | "const" = "var") => {
    const varTags = ["variable", "var"];
    const constTags = ["nochange", "nc"];
    const tags = use === "var" ? varTags : constTags;

    const prefix = String.raw`(?=^|[^"'])(`;
    const postfix = String.raw`)(?=$|[^"'])`;
    let matches = String.raw``;

    tags.forEach((tag, i) => {
      matches += `<${tag}>${word}</${tag}>`;
      if (i !== tags.length - 1) matches += "|";
    });

    return new RegExp(prefix + matches + postfix, "gmu");
  };

  private getParams = () =>
    this._literal
      .match(Literal.VAR_REGEX)
      ?.map((v) => v.trim().replace(Literal.VAR_TAG_REGEX, ""));

  private getConstants = () =>
    this._literal
      .match(Literal.CONST_REGEX)
      ?.map((v) => v.replace(Literal.CONST_TAG_REGEX, ""));

  constructor(literal: string) {
    this._literal = literal;
    this._params = this.getParams();
    this._constants = this.getConstants();
  }

  public evaluate = (...values: string[]) => {
    let literal = this._literal;
    this._params?.forEach((param, i) => {
      const replacement = i < values.length ? values[i] : "";
      literal = literal.replace(Literal.genRegex(param), replacement);
    });
    this._constants?.forEach((constant) => {
      literal = literal.replace(Literal.genRegex(constant, "const"), constant);
    });
    return literal;
  };

  get numberOfParams() {
    return this._params?.length;
  }

  get params() {
    return this._params;
  }
}
