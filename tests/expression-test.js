"use strict";
const Parser = require("../src/index");

describe("expression", () => {
  it("primary", () => {
    expect(Parser.parse("this", parser => parser.expression())).toEqual({
      type: "THIS"
    });
  });

  it("identifier", () => {
    expect(Parser.parse("abc", parser => parser.expression())).toEqual({
      type: "IDENTIFIER",
      value: "abc"
    });
  });

  it("instanceofExpression", () => {
    expect(
      Parser.parse("this instanceof boolean", parser => parser.expression())
    ).toEqual({
      type: "INSTANCEOF_EXPRESSION",
      expression: {
        type: "THIS"
      },
      instanceof: {
        type: "PRIMITIVE_TYPE",
        value: "boolean"
      }
    });
  });

  it("squareExpression", () => {
    expect(Parser.parse("this[super]", parser => parser.expression())).toEqual({
      type: "SQUARE_EXPRESSION",
      expression: {
        type: "THIS"
      },
      squareExpression: {
        type: "SUPER"
      }
    });
  });

  it("postfixExpression", () => {
    expect(Parser.parse("this++", parser => parser.expression())).toEqual({
      type: "POSTFIX_EXPRESSION",
      postfix: "++",
      expression: {
        type: "THIS"
      }
    });
  });

  it("ifElseExpression", () => {
    expect(
      Parser.parse("this ? super : null", parser => parser.expression())
    ).toEqual({
      type: "IF_ELSE_EXPRESSION",
      condition: {
        type: "THIS"
      },
      if: {
        type: "SUPER"
      },
      else: {
        type: "NULL"
      }
    });
  });

  it("qualifiedExpression", () => {
    expect(Parser.parse("this.a()", parser => parser.expression())).toEqual({
      type: "QUALIFIED_EXPRESSION",
      expression: {
        type: "THIS"
      },
      rest: {
        type: "METHOD_INVOCATION",
        name: {
          type: "IDENTIFIER",
          value: "a"
        },
        parameters: []
      }
    });
  });

  it("qualifiedExpression with starting identifier", () => {
    expect(Parser.parse("a.b()", parser => parser.expression())).toEqual({
      type: "QUALIFIED_EXPRESSION",
      expression: {
        type: "IDENTIFIER",
        value: "a"
      },
      rest: {
        type: "METHOD_INVOCATION",
        name: {
          type: "IDENTIFIER",
          value: "b"
        },
        parameters: []
      }
    });
  });

  it("operatorExpression Star", () => {
    expect(Parser.parse("this*super", parser => parser.expression())).toEqual({
      type: "OPERATOR_EXPRESSION",
      left: {
        type: "THIS"
      },
      operator: "*",
      right: {
        type: "SUPER"
      }
    });
  });

  it("multiple operatorExpressions", () => {
    expect(
      Parser.parse("this*super+null", parser => parser.expression())
    ).toEqual({
      type: "OPERATOR_EXPRESSION",
      left: {
        type: "THIS"
      },
      operator: "*",
      right: {
        type: "OPERATOR_EXPRESSION",
        left: {
          type: "SUPER"
        },
        operator: "+",
        right: {
          type: "NULL"
        }
      }
    });
  });

  it("PrefixExpression", () => {
    expect(Parser.parse("+this", parser => parser.expression())).toEqual({
      type: "PREFIX_EXPRESSION",
      prefix: "+",
      expression: {
        type: "THIS"
      }
    });
  });

  it("parExpression", () => {
    expect(Parser.parse("(this)", parser => parser.expression())).toEqual({
      type: "PAR_EXPRESSION",
      expression: {
        type: "THIS"
      }
    });
  });

  it("lambdaExpression: one identifier with parens", () => {
    expect(Parser.parse("(a) -> {}", parser => parser.expression())).toEqual({
      type: "LAMBDA_EXPRESSION",
      parameters: {
        type: "IDENTIFIERS",
        identifiers: {
          type: "IDENTIFIER_LIST",
          identifiers: [
            {
              type: "IDENTIFIER",
              value: "a"
            }
          ]
        }
      },
      body: {
        type: "BLOCK",
        statements: []
      }
    });
  });

  it("lambdaExpression: one identifier without parens", () => {
    expect(Parser.parse("a -> {}", parser => parser.expression())).toEqual({
      type: "LAMBDA_EXPRESSION",
      parameters: {
        type: "IDENTIFIERS",
        identifiers: {
          type: "IDENTIFIER_LIST",
          identifiers: [
            {
              type: "IDENTIFIER",
              value: "a"
            }
          ]
        }
      },
      body: {
        type: "BLOCK",
        statements: []
      }
    });
  });

  it("methodReference: identifier", () => {
    expect(Parser.parse("B.C::A", parser => parser.expression())).toEqual({
      type: "QUALIFIED_EXPRESSION",
      expression: {
        type: "IDENTIFIER",
        value: "B"
      },
      rest: {
        type: "METHOD_REFERENCE",
        reference: {
          type: "IDENTIFIER",
          value: "C"
        },
        name: {
          type: "IDENTIFIER",
          value: "A"
        },
        typeArguments: undefined
      }
    });
  });

  it("identifier.identifier", () => {
    expect(Parser.parse("A.B", parser => parser.expression())).toEqual({
      type: "QUALIFIED_EXPRESSION",
      expression: {
        type: "IDENTIFIER",
        value: "A"
      },
      rest: {
        type: "IDENTIFIER",
        value: "B"
      }
    });
  });

  it("identifier.class", () => {
    expect(Parser.parse("A.class", parser => parser.expression())).toEqual({
      type: "QUALIFIED_EXPRESSION",
      expression: {
        type: "IDENTIFIER",
        value: "A"
      },
      rest: {
        type: "CLASS"
      }
    });
  });

  it("identifier.class with annotation", () => {
    expect(
      Parser.parse("@Bean A.class", parser => parser.expression())
    ).toEqual({
      type: "QUALIFIED_EXPRESSION",
      expression: {
        type: "TYPE_TYPE",
        modifiers: [
          {
            hasBraces: false,
            name: {
              name: [
                {
                  type: "IDENTIFIER",
                  value: "Bean"
                }
              ],
              type: "QUALIFIED_NAME"
            },
            type: "ANNOTATION",
            value: undefined
          }
        ],
        value: {
          type: "IDENTIFIER",
          value: "A"
        },
        cntSquares: 0
      },
      rest: { type: "CLASS" }
    });
  });

  // it("identifier.identifier.class", () => {
  //   expect(Parser.parse("A.B.class", parser => parser.expression())).toEqual({
  //     type: "CLASS_OR_INTERFACE_TYPE",
  //     elements: [
  //       {
  //         type: "IDENTIFIER",
  //         value: "A"
  //       },
  //       {
  //         type: "IDENTIFIER",
  //         value: "B.class"
  //       }
  //     ]
  //   });
  // });
});