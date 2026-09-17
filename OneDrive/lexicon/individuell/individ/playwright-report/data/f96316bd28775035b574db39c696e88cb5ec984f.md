# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chat.spec.ts >> Study Buddy chatbot >> opens the Study Buddy explanation
- Location: tests\chat.spec.ts:268:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('details.about-study-buddy')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('details.about-study-buddy') with timeout 5000ms
  - waiting for locator('details.about-study-buddy')

```

```yaml
- main:
  - region "Study Buddy chat":
    - img "Study Buddy logo"
    - paragraph: Your learning companion
    - heading "Study Buddy" [level=1]
    - button "Clear" [disabled]
    - article:
      - text: Study Buddy
      - paragraph: Hi, I’m Study Buddy. How can I help you learn today?
    - text: Your question
    - textbox "Your question":
      - /placeholder: Ask away!
    - button "Send message"
- alert
```

# Test source

```ts
  173 |     await expect(
  174 |       page.getByText("Test message")
  175 |     ).toBeVisible();
  176 | 
  177 |     await page
  178 |       .getByRole("button", { name: "Clear" })
  179 |       .click();
  180 | 
  181 |     await expect(
  182 |       page.getByText("Test message")
  183 |     ).not.toBeVisible();
  184 | 
  185 |     await expect(
  186 |       page.getByText(/How can I help you learn today/)
  187 |     ).toBeVisible();
  188 |   });
  189 | 
  190 |   test("scrolls to the newest assistant response", async ({ page }) => {
  191 |     // Return a long response so the page definitely has content
  192 |     // that can be scrolled.
  193 |     await page.unrouteAll();
  194 | 
  195 |     const longResponse = Array.from(
  196 |       { length: 30 },
  197 |       (_, index) => `Line ${index + 1}: This is part of the answer.`
  198 |     ).join("\n\n");
  199 | 
  200 |     await page.route("**/api/chat", async (route) => {
  201 |       await route.fulfill({
  202 |         status: 200,
  203 |         contentType: "application/json",
  204 |         body: JSON.stringify({
  205 |           message: longResponse,
  206 |         }),
  207 |       });
  208 |     });
  209 | 
  210 |     await page.goto("/");
  211 | 
  212 |     // Send the question.
  213 |     await page
  214 |       .getByPlaceholder("Ask away!")
  215 |       .fill("Give me a long answer");
  216 | 
  217 |     await page
  218 |       .getByRole("button", { name: "Send message" })
  219 |       .click();
  220 | 
  221 |     // Wait until the assistant response has been rendered.
  222 |     const response = page.locator(
  223 |       "article.message-row.assistant"
  224 |     ).last();
  225 | 
  226 |     await expect(response).toBeVisible();
  227 | 
  228 |     // Wait for smooth scrolling to finish and check
  229 |     // that the newest assistant message is near the top
  230 |     // of the viewport.
  231 |     await expect
  232 |       .poll(
  233 |         async () => {
  234 |           return response.evaluate((element) => {
  235 |             const rect = element.getBoundingClientRect();
  236 | 
  237 |             return {
  238 |               top: rect.top,
  239 |               scrollY: window.scrollY,
  240 |             };
  241 |           });
  242 |         },
  243 |         {
  244 |           timeout: 5000,
  245 |         }
  246 |       )
  247 |       .toEqual(
  248 |         expect.objectContaining({
  249 |           top: expect.any(Number),
  250 |         })
  251 |       );
  252 | 
  253 |     const responsePosition = await response.evaluate((element) => {
  254 |       const rect = element.getBoundingClientRect();
  255 | 
  256 |       return {
  257 |         top: rect.top,
  258 |         viewportHeight: window.innerHeight,
  259 |       };
  260 |     });
  261 | 
  262 |     expect(responsePosition.top).toBeGreaterThanOrEqual(-10);
  263 |     expect(responsePosition.top).toBeLessThan(
  264 |       responsePosition.viewportHeight
  265 |     );
  266 |   });
  267 | 
  268 |   test("opens the Study Buddy explanation", async ({ page }) => {
  269 |   const details = page.locator("details.about-study-buddy");
  270 |   const summary = details.locator("summary");
  271 |   const explanation = details.locator("p");
  272 | 
> 273 |   await expect(details).toBeVisible();
      |                         ^ Error: expect(locator).toBeVisible() failed
  274 |   await expect(summary).toHaveText("What is Study Buddy?");
  275 |   await expect(explanation).not.toBeVisible();
  276 | 
  277 |   console.log(await page.locator("body").innerText());
  278 |   console.log("summary count:", await page.locator("summary").count());
  279 |   console.log("details count:", await page.locator("details").count());
  280 | 
  281 | 
  282 |   await summary.click();
  283 | 
  284 |   await expect(explanation).toBeVisible();
  285 |   await expect(explanation).toContainText("No data will be stored.");
  286 | });
  287 | 
  288 | });
```