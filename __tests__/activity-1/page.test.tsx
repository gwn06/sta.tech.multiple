import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "@/app/(protected)/activity-1/page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { handleAddTodo, handleEditTodo, handleRemoveTodo } from "@/app/(protected)/activity-1/utils/todoHelpers";

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
  handleRemoveTodo: jest.fn(),
  handleEditTodo: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Activity 1 signed out user", () => {
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
});

describe("Todo app signed in user", () => {
  beforeEach(async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "validUserID" } },
          error: false,
        }),
      },
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
    render(await Page());
  });

  it("renders todo list correctly", () => {
    expect(screen.getByText("To-do List Supabase")).toBeInTheDocument();
  });
  it("adds new todo item and updates UI", async () => {
    // Mock handleAddTodo to simulate successful insert
    (handleAddTodo as jest.Mock).mockImplementation(
      (_, text, userId, todos, setTodos, setTodo) => {
        const newTodo = {
          id: 1,
          task: text,
          user_id: userId,
          is_complete: false,
          created_at: new Date().toISOString(),
        };
        setTodos([...todos, newTodo]);
        setTodo("");
        return Promise.resolve({ data: newTodo, error: null });
      }
    );

    const input = screen.getByPlaceholderText("Enter a task");
    fireEvent.change(input, { target: { value: "New Todo Item" } });
    fireEvent.click(screen.getByText("Add"));

    expect(handleAddTodo).toHaveBeenCalledWith(
      expect.any(Object),
      "New Todo Item",
      "validUserID",
      [],
      expect.any(Function),
      expect.any(Function)
    );

    // Wait for the todo to appear in the UI
    const newTodoElement = await screen.findByText("New Todo Item");
    expect(newTodoElement).toBeInTheDocument();

    // Verify input is cleared
    expect(input).toHaveValue("");
  });


  it("adds new todo item and delete todo ", async () => {
    const newTodo = {
        id: 1,
        task: "New Todo Item",
        user_id: "validUserID",
        is_complete: false,
        created_at: new Date().toISOString(),
    };
    // Mock handleAddTodo to simulate successful insert
    (handleAddTodo as jest.Mock).mockImplementation(
      (_, text, userId, todos, setTodos, setTodo) => {
        setTodos([...todos, newTodo]);
        setTodo("");
        return Promise.resolve({ data: newTodo, error: null });
      }
    );
    (handleRemoveTodo as jest.Mock).mockImplementation(
      (_, userId, todos, setTodos) => {
        const updatedTodos = todos.filter((todo) => todo.id !== userId);
        setTodos(updatedTodos);
        return Promise.resolve({  error: null });
      }
    );

    const input = screen.getByPlaceholderText("Enter a task");
    fireEvent.change(input, { target: { value: "New Todo Item" } });
    fireEvent.click(screen.getByText("Add"));

    expect(handleAddTodo).toHaveBeenCalledWith(
      expect.any(Object),
      "New Todo Item",
      "validUserID",
      [],
      expect.any(Function),
      expect.any(Function)
    );

    // Wait for the todo to appear in the UI
    const newTodoElement = await screen.findByText("New Todo Item");
    expect(newTodoElement).toBeInTheDocument();
    // Verify input is cleared
    expect(input).toHaveValue("");


    fireEvent.click(screen.getByText("Remove"));
    expect(handleRemoveTodo).toHaveBeenCalledWith(
      expect.any(Object),
      1,
      [newTodo],
      expect.any(Function),
    );


    expect(screen.queryByText(newTodo.task)).toBeNull();
  });



  it("adds new todo item and edit todo todo ", async () => {
    const newTodo = {
        id: 1,
        task: "New Todo Item",
        user_id: "validUserID",
        is_complete: false,
        created_at: new Date().toISOString(),
    };
    // Mock handleAddTodo to simulate successful insert
    (handleAddTodo as jest.Mock).mockImplementation(
      (_, text, userId, todos, setTodos, setTodo) => {
        setTodos([...todos, newTodo]);
        setTodo("");
        return Promise.resolve({ data: newTodo, error: null });
      }
    );
    (handleEditTodo as jest.Mock).mockImplementation(
      (_, id, todos, setTodos) => {
        const updatedTask = "Updated todo";
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, task: updatedTask } : todo
        );
        setTodos(updatedTodos);
        return Promise.resolve({data: updatedTask,  error: null });
      }
    );

    const input = screen.getByPlaceholderText("Enter a task");
    fireEvent.change(input, { target: { value: "New Todo Item" } });
    fireEvent.click(screen.getByText("Add"));

    expect(handleAddTodo).toHaveBeenCalledWith(
      expect.any(Object),
      "New Todo Item",
      "validUserID",
      [],
      expect.any(Function),
      expect.any(Function)
    );

    // Wait for the todo to appear in the UI
    const newTodoElement = await screen.findByText("New Todo Item");
    expect(newTodoElement).toBeInTheDocument();
    // Verify input is cleared
    expect(input).toHaveValue("");


    fireEvent.click(screen.getByText("Edit"));
    expect(handleEditTodo).toHaveBeenCalledWith(
      expect.any(Object),
      1,
      [newTodo],
      expect.any(Function),
    );


    expect(await screen.findByText("Updated todo")).toBeInTheDocument();
  });
});
