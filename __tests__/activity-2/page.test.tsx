import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "@/app/(protected)/activity-2/page";
import { createClient } from "@/utils/supabase/server";
import {
  redirect,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { getDriveliteImages } from "@/app/actions";
import { use } from "react";

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "example-anon-key";

// Mock the Supabase client
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("react", () => ({
  use: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
  }),
  usePathname: jest.fn(),
  useRouter: jest.fn().mockReturnValue({
    replace: jest.fn(),
  }),
  redirect: jest.fn(),
}));

jest.mock("@/app/actions", () => ({
  getDriveliteImages: jest.fn(),
}));

describe("Activity 2 signed out user", () => {
  beforeEach(() => {
    (createClient as jest.Mock).mockClear();
  });

  it("redirects to sign-in when no user", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: { id: null } }, error: false }),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
    render(await Page({}));

    expect(useSearchParams).toHaveBeenCalled();
    expect(usePathname).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
    expect(getDriveliteImages).toHaveBeenCalled();
    expect(use).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
});
