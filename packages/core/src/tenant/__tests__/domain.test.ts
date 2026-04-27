import { describe, it, expect } from "vitest";
import { extractSchoolDomain, resolveSchoolName, getSchoolDisplayName, resolveSchoolFromEmail } from "../domain";

describe("extractSchoolDomain", () => {
  it("extracts domain from a valid email", () => {
    expect(extractSchoolDomain("user@abc.edu.vn")).toBe("abc.edu.vn");
  });

  it("extracts domain from email with uppercase", () => {
    expect(extractSchoolDomain("User@FPT.edu.vn")).toBe("fpt.edu.vn");
  });

  it("trims whitespace", () => {
    expect(extractSchoolDomain("  user@hust.edu.vn  ")).toBe("hust.edu.vn");
  });

  it("returns null for invalid email (no @)", () => {
    expect(extractSchoolDomain("invalid-email")).toBeNull();
  });

  it("returns null for email with no domain part", () => {
    expect(extractSchoolDomain("user@")).toBeNull();
  });

  it("returns null for email with no local part", () => {
    expect(extractSchoolDomain("@domain.com")).toBeNull();
  });

  it("returns null for domain without a dot", () => {
    expect(extractSchoolDomain("user@localhost")).toBeNull();
  });

  it("handles multiple @ signs (uses last one)", () => {
    expect(extractSchoolDomain("user@company@school.edu.vn")).toBe("school.edu.vn");
  });
});

describe("resolveSchoolName", () => {
  it("strips .edu.vn suffix", () => {
    expect(resolveSchoolName("abc.edu.vn")).toBe("abc");
  });

  it("strips .edu suffix", () => {
    expect(resolveSchoolName("mit.edu")).toBe("mit");
  });

  it("strips .ac.vn suffix", () => {
    expect(resolveSchoolName("school.ac.vn")).toBe("school");
  });

  it("strips .com.vn suffix", () => {
    expect(resolveSchoolName("company.com.vn")).toBe("company");
  });

  it("strips .vn suffix", () => {
    expect(resolveSchoolName("my-school.vn")).toBe("my-school");
  });

  it("returns domain as-is for unrecognized suffix", () => {
    expect(resolveSchoolName("school.ac.uk")).toBe("school.ac.uk");
  });

  it("handles uppercase input", () => {
    expect(resolveSchoolName("FPT.EDU.VN")).toBe("fpt");
  });

  it("prefers longer suffix match (.edu.vn over .vn)", () => {
    expect(resolveSchoolName("hust.edu.vn")).toBe("hust");
  });
});

describe("getSchoolDisplayName", () => {
  it("maps well-known school domains to display names", () => {
    expect(getSchoolDisplayName("fpt.edu.vn")).toBe("FPT");
    expect(getSchoolDisplayName("hust.edu.vn")).toBe("HUST");
    expect(getSchoolDisplayName("ueh.edu.vn")).toBe("UEH");
  });

  it("returns short name for unknown schools", () => {
    expect(getSchoolDisplayName("unknown-school.edu.vn")).toBe("unknown-school");
  });
});

describe("resolveSchoolFromEmail", () => {
  it("resolves full pipeline: email → display name", () => {
    expect(resolveSchoolFromEmail("student@fpt.edu.vn")).toBe("FPT");
  });

  it("returns null for invalid email", () => {
    expect(resolveSchoolFromEmail("not-an-email")).toBeNull();
  });

  it("returns short name for unknown school", () => {
    expect(resolveSchoolFromEmail("user@random-school.edu.vn")).toBe("random-school");
  });
});
