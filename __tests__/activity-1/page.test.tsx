import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "@/app/(protected)/activity-1/page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { handleAddTodo } from "@/app/(protected)/activity-1/utils/todoHelpers";

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

jest.mock("@/app/(protected)/activity-1/utils/todoHelpers", () => ({
  handleAddTodo: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Activity 1 To-do list test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to sign-in when no user", async () => {
    const mockSupabase = {
      auth: {
        getUser: jest
          .fn()
          .mockResolvedValue({ data: { user: { id: null } }, error: true }),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    await Page();

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });




  it("renders todo list when user is authenticated", async () => {
    const mockUser = { id: "123" };
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({
          data: [{ task: "New Todo Item" }],
          error: null,
        }),
      }),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    const { container } = render(await Page());

    expect(screen.getByText("To-do List Supabase")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("max-w-md");
  });




  it("allows adding a new todo", async () => {
    const mockUser = { id: "123" };
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);

    render(await Page());

    const input = screen.getByPlaceholderText("Enter a task");
    fireEvent.change(input, { target: { value: "New Todo Item" } });

    // handleAddTodo.mockImplementation(() =>
    //   Promise.resolve({
    //     task: "New Todo Item",
    //     is_complete: false,
    //     user_id: "123",
    //   })
    // );

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    expect(handleAddTodo).toHaveBeenCalledWith(
      expect.any(Object), // supabase instance
      "New Todo Item", // todo text
      "123", // user ID
      [], // current todos array
      expect.any(Function), // setTodos function
      expect.any(Function) // setTodo function
    );
  });
});
