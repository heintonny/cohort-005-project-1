import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { Window } from "happy-dom";
import { UserRole } from "~/db/schema";
import { Sidebar } from "~/components/sidebar";

const LONG_NAME = "Bossy McBossface";
const AVATAR_URL = "https://example.com/avatar.png";

function renderSidebarFor(name: string) {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <Sidebar
          currentUser={{
            id: 10,
            name,
            role: UserRole.Student,
            avatarUrl: AVATAR_URL,
          }}
        />
      ),
    },
  ]);
  const { document } = new Window();
  document.body.innerHTML = renderToStaticMarkup(
    <Stub initialEntries={["/"]} />
  );
  return document;
}

type SidebarDocument = ReturnType<typeof renderSidebarFor>;

function nameElement(document: SidebarDocument, name: string) {
  const element = [...document.querySelectorAll("div")].find(
    (div) => div.children.length === 0 && div.textContent === name
  );
  if (!element) throw new Error(`No element shows the name "${name}"`);
  return element;
}

/** The smallest element that holds both the user's avatar and their name. */
function userRow(document: SidebarDocument, name: string) {
  const avatar = document.querySelector(`img[alt="${name}"]`);
  let row = nameElement(document, name).parentElement;
  while (row && avatar && !row.contains(avatar)) row = row.parentElement;
  if (!row) throw new Error("No element holds both the avatar and the name");
  return row;
}

describe("Sidebar user row", () => {
  it("renders the full name, with the name as its title", () => {
    const name = nameElement(renderSidebarFor(LONG_NAME), LONG_NAME);

    expect(name.getAttribute("title")).toBe(LONG_NAME);
  });

  it("wraps the name onto up to two lines instead of cutting it to one", () => {
    const name = nameElement(renderSidebarFor(LONG_NAME), LONG_NAME);

    expect(name.classList.contains("line-clamp-2")).toBe(true);
    expect(name.classList.contains("truncate")).toBe(false);
  });

  it("puts Settings and Sign out on their own row, not beside the name", () => {
    const document = renderSidebarFor(LONG_NAME);
    const row = userRow(document, LONG_NAME);

    expect(row.querySelector('[title="Settings"]')).toBeNull();
    expect(row.querySelector('[title="Sign out"]')).toBeNull();
    expect(document.querySelector('[title="Settings"]')).not.toBeNull();
    expect(document.querySelector('[title="Sign out"]')).not.toBeNull();
  });
});
