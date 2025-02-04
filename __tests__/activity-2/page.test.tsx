
import { render, screen, fireEvent } from "@testing-library/react";
import Activity2 from "@/app/(protected)/activity-2/page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "example-anon-key";

// Mock the Supabase client
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn().mockImplementation(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn(),
      select: jest.fn(),
    }),
  })),
}));



// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Activity 2 Google Drive lite test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to sign-in when no user found", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: { id: null } }, error: true }),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    await Activity2({});

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

});
