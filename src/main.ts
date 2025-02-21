import { z } from "zod";

const schema = z.object({
  body: z.array(
    z.object({
      client_encounters: z.object({
        results: z.array(
          z.object({
            user: z.object({
              their_vote: z.number(),
              name: z.string(),
              age: z.number(),
              profile_fields: z.array(
                z.object({
                  id: z.string(),
                  display_value: z.string(),
                })
              ),
            }),
          })
        ),
      }),
    })
  ),
});

type User = {
  name: string;
  age: number;
  height: string;
};

function parseJson(raw: string): User[] | undefined {
  try {
    const json = JSON.parse(raw);
    const data = schema.parse(json);
    const users = data.body[0].client_encounters.results
      .filter((result) => result.user.their_vote === 2)
      .map(({ user }) => ({
        name: user.name,
        age: user.age,
        height:
          user.profile_fields.find((field) => field.id === "lifestyle_height")
            ?.display_value ?? "Not found",
      }));
    return users;
  } catch (_error) {
    console.log("error?");
    displayError(
      "Error: incorrect format for JSON. Try copying and pasting again."
    );
  }
}

function createListItem({ name, age, height }: User): HTMLLIElement {
  const li = document.createElement("li");
  li.textContent = `${name}, ${age} ${height}`;
  return li;
}

function renderDisplay(element: HTMLElement) {
  const display = document.getElementById("like-display");
  if (display) {
    const old = display.firstChild;
    if (old) {
      display.replaceChild(element, old);
    } else {
      display.appendChild(element);
    }
  }
}

function parseAndDisplay(raw: string): void {
  const users = parseJson(raw);

  if (users?.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No likes. 💔";
    renderDisplay(message);
  } else if (users) {
    const list = document.createElement("ul");
    list.append(...users.map(createListItem));
    renderDisplay(list);
  }
}

function displayError(message: string): void {
  document.getElementById("error-display")!.textContent = message;

  const jsonField = document.getElementById("json")!;
  if (message) {
    jsonField.setAttribute("aria-invalid", "true");
  } else {
    jsonField.removeAttribute("aria-invalid");
  }
}

const form = document.getElementById("like-form");
form?.addEventListener("submit", (event) => {
  displayError("");
  if (event && event.target) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const json = data.get("json");
    parseAndDisplay(json?.toString() ?? "{}");
  }
});
