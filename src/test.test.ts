import DateHelper from ".";

describe("datehelper", () => {
  it("should display correctly AD", () => {
    const dh = new DateHelper("2024-03-01T00:00:00");
    expect(dh.getADYear()).toEqual(2024);
    expect(dh.getDisplayDate()).toEqual("01 March 2024");
  });

  it("should display correctly BD", () => {
    const dh = new DateHelper("2024-03-01T00:00:00", { useBD: true });
    expect(dh.getBDYear()).toEqual(2567);
    expect(dh.getDisplayDate()).toEqual("01 March 2567");
  });

  it("should display correctly Thai", () => {
    const dh = new DateHelper("2024-03-01T00:00:00", {
      useBD: true,
      lang: "th",
    });
    expect(dh.getBDYear()).toEqual(2567);
    expect(dh.getDisplayDate()).toEqual("01 มีนาคม 2567");
  });
});
