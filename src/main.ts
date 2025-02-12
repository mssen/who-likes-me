type Result = {
  user: {
    their_vote: number;
    name: string;
    age: number;
    profile_fields: Array<{ id: string; display_value: string }>;
  };
};

type User = {
  name: string;
  age: number;
  height: string;
};

function createListItem({ name, age, height }: User): HTMLLIElement {
  const li = document.createElement("li");
  li.textContent = `${name}, ${age} ${height}`;
  return li;
}

function parseAndDisplay(raw: string): void {
  const json = JSON.parse(raw);
  const users: User[] = json.body[0].client_encounters.results
    .filter((result: Result) => result.user.their_vote === 2)
    .map((result: Result) => ({
      name: result.user.name,
      age: result.user.age,
      height:
        result.user.profile_fields.find(
          (field) => field.id === "lifestyle_height"
        )?.display_value ?? "Not found",
    }));

  const list = document.createElement("ul");
  list.append(...users.map(createListItem));

  const display = document.getElementById("like-display");

  if (display) {
    const oldList = display.firstChild;
    if (oldList) {
      display.replaceChild(list, oldList);
    } else {
      display.appendChild(list);
    }
  }
}

function displayError(message: string): void {
  const error = document.getElementById("error-display");
  if (error) {
    error.textContent = message;
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
