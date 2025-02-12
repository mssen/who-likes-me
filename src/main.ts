type Result = {
  user: {
    match_message: string;
    name: string;
  };
};

function createListItem(name: string): HTMLLIElement {
  const li = document.createElement("li");
  li.textContent = name;
  return li;
}

function parseAndDisplay(raw: string): void {
  const json = JSON.parse(raw);
  const users: string[] = json.body[0].client_encounters.results
    .filter(
      (result: Result) =>
        result.user.match_message ===
        "They like you too! Keep the buzz going and message them within 24 hours."
    )
    .map((result: Result) => result.user.name);
  console.log(users);

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
