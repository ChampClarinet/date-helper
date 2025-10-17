class FormatError extends Error {
  constructor(msg: string, at: string) {
    super();
    this.message = `Format error in ${at}:: ${msg}`;
  }
}
