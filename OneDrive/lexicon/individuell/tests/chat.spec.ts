import { test, expect } from "@playwright/test";

test.describe("Study Buddy chatbot", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Plants use light to make food.",
        }),
      });
    });

    await page.goto("/");
  });

  test("allows the user to send a message and receive a response", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("Ask away!");
    const sendButton = page.getByRole("button", {
      name: "Send message",
    });

    await input.fill("Explain photosynthesis");
    await sendButton.click();

    await expect(
      page.getByText("Explain photosynthesis")
    ).toBeVisible();

    await expect(
      page.getByText("Plants use light to make food.")
    ).toBeVisible();
  });

  test("shows a loading state while waiting for the response", async ({
    page,
  }) => {
    await page.unrouteAll();

    let resolveRequest: (() => void) | undefined;

    await page.route("**/api/chat", async (route) => {
      await new Promise<void>((resolve) => {
        resolveRequest = resolve;
      });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Hi there!",
        }),
      });
    });

    const input = page.getByPlaceholder("Ask away!");
    const sendButton = page.getByRole("button", {
      name: "Send message",
    });

    await input.fill("Hello");
    await sendButton.click();

    await expect(page.getByText("Thinking...")).toBeVisible();
    await expect(sendButton).toBeDisabled();

    resolveRequest?.();

    await expect(page.getByText("Hi there!")).toBeVisible();
  });

  test("shows an error when the API request fails", async ({ page }) => {
    await page.unrouteAll();

    await page.route("**/api/chat", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Unable to get a response right now.",
        }),
      });
    });

    await page
      .getByPlaceholder("Ask away!")
      .fill("Hello");

    await page
      .getByRole("button", { name: "Send message" })
      .click();

    await expect(
      page.getByText("Unable to get a response right now.")
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Try again" })
    ).toBeVisible();
  });

  test("allows the user to retry after an error", async ({ page }) => {
    await page.unrouteAll();

    let requestCount = 0;

    await page.route("**/api/chat", async (route) => {
      requestCount++;

      if (requestCount === 1) {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Try again",
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Recovered response",
        }),
      });
    });

    await page
      .getByPlaceholder("Ask away!")
      .fill("Retry this");

    await page
      .getByRole("button", { name: "Send message" })
      .click();

    await expect(
      page.getByRole("button", { name: "Try again" })
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Try again" })
      .click();

    await expect(
      page.getByText("Recovered response")
    ).toBeVisible();

    expect(requestCount).toBe(2);
  });

  test("does not submit an empty message", async ({ page }) => {
    await page
      .getByRole("button", { name: "Send message" })
      .click();

    await expect(page.getByText("Thinking...")).not.toBeVisible();
  });

  test("clears the conversation", async ({ page }) => {
    await page
      .getByPlaceholder("Ask away!")
      .fill("Test message");

    await page
      .getByRole("button", { name: "Send message" })
      .click();

    await expect(
      page.getByText("Test message")
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Clear" })
      .click();

    await expect(
      page.getByText("Test message")
    ).not.toBeVisible();

    await expect(
      page.getByText(/How can I help you learn today/)
    ).toBeVisible();
  });

  test("scrolls to the newest assistant response", async ({ page }) => {
    // Return a long response so the page definitely has content
    // that can be scrolled.
    await page.unrouteAll();

    const longResponse = Array.from(
      { length: 30 },
      (_, index) => `Line ${index + 1}: This is part of the answer.`
    ).join("\n\n");

    await page.route("**/api/chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: longResponse,
        }),
      });
    });

    await page.goto("/");

    // Send the question.
    await page
      .getByPlaceholder("Ask away!")
      .fill("Give me a long answer");

    await page
      .getByRole("button", { name: "Send message" })
      .click();

    // Wait until the assistant response has been rendered.
    const response = page.locator(
      "article.message-row.assistant"
    ).last();

    await expect(response).toBeVisible();

    // Wait for smooth scrolling to finish and check
    // that the newest assistant message is near the top
    // of the viewport.
    await expect
      .poll(
        async () => {
          return response.evaluate((element) => {
            const rect = element.getBoundingClientRect();

            return {
              top: rect.top,
              scrollY: window.scrollY,
            };
          });
        },
        {
          timeout: 5000,
        }
      )
      .toEqual(
        expect.objectContaining({
          top: expect.any(Number),
        })
      );

    const responsePosition = await response.evaluate((element) => {
      const rect = element.getBoundingClientRect();

      return {
        top: rect.top,
        viewportHeight: window.innerHeight,
      };
    });

    expect(responsePosition.top).toBeGreaterThanOrEqual(0);
    expect(responsePosition.top).toBeLessThan(
      responsePosition.viewportHeight
    );
  });

  test("opens the Study Buddy explanation", async ({ page }) => {
    const explanation = page.getByText(
      /Study Buddy is an AI chatbot/
    );

    await expect(explanation).not.toBeVisible();

    await page
      .getByText("What is Study Buddy?")
      .click();

    await expect(explanation).toBeVisible();

    await expect(explanation).toContainText(
      "No data will be stored."
    );
  });
});