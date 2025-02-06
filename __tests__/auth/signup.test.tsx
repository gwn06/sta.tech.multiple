import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/(auth-pages)/sign-up/page";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { Message } from "@/components/form-message";
import { signUpAction } from "@/app/actions";
import { headers } from "next/headers";

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "example-anon-key";

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn()
}));

jest.mock("@/utils/utils", () => ({
  encodedRedirect: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

describe("Sign up route", () => {
  it("displays sign up", async () => {
    const searchParams: Promise<Message> = {};
    render(await Page({ searchParams }));
    expect(
      screen.getByRole("heading", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your password/i)).toBeInTheDocument();
  });
});

describe("Sign up action", () => {
  let mockFormData: FormData;
  let mockSupabase: any;
  let mockSignUp: jest.Mock;
  let mockHeaders: jest.Mock;

  beforeEach(() => {
    (createClient as jest.Mock).mockClear();
    (headers as jest.Mock).mockClear();

    mockFormData = new FormData();
    mockFormData.append("email", "test@example.com");
    mockFormData.append("password", "password123");
    mockHeaders = jest.fn();

    mockSignUp = jest.fn();
    mockSupabase = {
      auth: {
        signUp: mockSignUp,
      },
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("http://localhost"),
    });
  });

  it("should successfully sign up and encodedRedirect should be called", async () => {
    mockSignUp.mockResolvedValue({ error: null });

    await signUpAction(mockFormData);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    expect(encodedRedirect).toHaveBeenCalledWith(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  });

  it("should sign up fail and encodedRedirect should be called", async () => {
    mockSignUp.mockResolvedValue({ error: true });

    await signUpAction(mockFormData);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    expect(encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/sign-up",
      undefined
    );
  });
});
