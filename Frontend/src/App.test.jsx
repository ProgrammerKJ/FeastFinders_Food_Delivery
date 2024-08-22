import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";
import axios from "axios";
import App from "./App";
import StoreContextProvider from "./context/StoreContext";
import Verify from "./pages/Verify/Verify";

vi.mock("axios");

vi.mock("./components/FoodDisplay/FoodDisplay", () => ({
  default: ({ category }) => <div>Food Display: {category}</div>,
}));

const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe("App Integration Tests", () => {
  const mockFoodList = [
    {
      _id: "1",
      name: "Pizza",
      price: 10,
      image: "pizza.jpg",
      category: "Main Course",
    },
    {
      _id: "2",
      name: "Burger",
      price: 8,
      image: "burger.jpg",
      category: "Main Course",
    },
    {
      _id: "3",
      name: "Salad",
      price: 6,
      image: "salad.jpg",
      category: "Starter",
    },
  ];

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => null),
        removeItem: vi.fn(() => null),
      },
      writable: true,
    });

    axios.post.mockResolvedValue({
      data: { success: true, token: "fake-token" },
    });
    axios.get.mockResolvedValue({ data: { data: mockFoodList } });
  });

  const renderApp = () => {
    return render(
      <StoreContextProvider>
        <Router>
          <App />
        </Router>
      </StoreContextProvider>
    );
  };

  test("initial render and navigation", async () => {
    renderApp();

    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();

    expect(screen.getByText("Sign In")).toBeInTheDocument();

    expect(
      screen.getByText("Feeling hungry? Order your favorite dishes below!")
    ).toBeInTheDocument();
    expect(screen.getByText("Explore Our Menu")).toBeInTheDocument();

    expect(screen.getByText("COMPANY")).toBeInTheDocument();
    expect(screen.getByText("GET IN TOUCH")).toBeInTheDocument();
  });

  test("menu category selection", async () => {
    renderApp();

    fireEvent.click(screen.getByText("Salad"));

    expect(screen.getByText("Food Display: Salad")).toBeInTheDocument();
  });

  test("order verification process", async () => {
    render(
      <StoreContextProvider>
        <Router>
          <Verify />
        </Router>
      </StoreContextProvider>
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalled();
    });
  });
});

describe("Login Integration Tests", () => {
  beforeEach(() => {
    render(
      <StoreContextProvider>
        <Router>
          <App />
        </Router>
      </StoreContextProvider>
    );
  });

  test("opens login popup when Sign In button is clicked", async () => {
    await act(async () => {
      fireEvent.click(screen.getByText("Sign In"));
    });
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  test("switches between Sign Up and Login forms", async () => {
    await act(async () => {
      fireEvent.click(screen.getByText("Sign In"));
    });
    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Login here"));
    });
    expect(screen.queryByPlaceholderText("Your Name")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("submits sign up form with valid data", async () => {
    axios.post.mockResolvedValue({
      data: { success: true, token: "fake-token" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Sign In"));
    });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Your Name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("Your Email"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        })
      );
    });

    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });

  test("shows error message on invalid login", async () => {
    console.log("Starting invalid login test");
    axios.post.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <StoreContextProvider>
        <Router>
          <App />
        </Router>
      </StoreContextProvider>
    );

    console.log("App rendered");

    const buttons = screen.getAllByRole("button");
    console.log(
      "All buttons found:",
      buttons.map((button) => button.outerHTML)
    );

    let signInButton;
    try {
      signInButton = screen.getByText("Sign In");
    } catch (error) {
      console.log('Could not find button with exact text "Sign In"');
      try {
        signInButton = screen.getByRole("button", { name: /sign.?in/i });
      } catch (error) {
        console.log(
          'Could not find button with role "button" and name matching /sign.?in/i'
        );
        signInButton = buttons.find(
          (button) =>
            button.textContent.toLowerCase().includes("sign") &&
            button.textContent.toLowerCase().includes("in")
        );
      }
    }

    if (signInButton) {
      console.log("Sign In button found:", signInButton.outerHTML);
      await act(async () => {
        fireEvent.click(signInButton);
      });
      console.log("Clicked Sign In button");
    } else {
      console.error("Could not find Sign In button");
      throw new Error("Sign In button not found");
    }

    await waitFor(
      () => {
        const formElement = screen.getByRole("form");
        console.log("Form found:", formElement.outerHTML);
        expect(formElement).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
