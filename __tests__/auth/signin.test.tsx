import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "@/app/(auth-pages)/sign-in/page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";
import { Message } from "@/components/form-message";
import { signInAction } from "@/app/actions";

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "example-anon-key";

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

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/utils/utils", () => ({
  encodedRedirect: jest.fn(),
}));

describe("Sign in route", () => {
  it("displays sign in", async () => {
    const searchParams: Promise<Message> = {};
    render(await Page({ searchParams }));
    expect(
      screen.getByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your password/i)).toBeInTheDocument();
  });
});

describe("Sign in action", () => {
  let mockFormData: FormData;
  let mockSupabase: any;
  let mockSignInWithPassword: jest.Mock;

  beforeEach(() => {
    mockFormData = new FormData();
    mockFormData.append("email", "test@example.com");
    mockFormData.append("password", "password123");

    // Create a mock Supabase client
    mockSignInWithPassword = jest.fn();
    mockSupabase = {
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    };

    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it("should successfully sign in and redirect on success", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    await signInAction(mockFormData);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(redirect).toHaveBeenCalledWith("/");
    expect(encodedRedirect).not.toHaveBeenCalled();
  });

  it("should handle sign-in error and call encodedRedirect", async () => {
    const mockError = new Error("Invalid credentials");
    mockSignInWithPassword.mockResolvedValue({ error: mockError });

    await signInAction(mockFormData);

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(redirect).not.toHaveBeenCalled();
    expect(encodedRedirect).toHaveBeenCalledWith(
      "error",
      "/sign-in",
      "Invalid credentials"
    );
  });
});
