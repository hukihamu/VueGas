declare namespace Parser {
  interface From {
    from(text: string): Parser.To
  }
  interface To {
    to(text: string): Parser.Iterate
  }
  interface Iterate {
    iterate(): string[]
  }
  function data(text: string): Parser.From
}
