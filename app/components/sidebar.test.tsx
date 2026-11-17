import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { UserRole } from "~/db/schema";
import { Sidebar } from "~/components/sidebar";

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
            avatarUrl: null,
          }}
        />
      ),
    },
  ]);
  return renderToStaticMarkup(<Stub initialEntries={["/"]} />);
}

const NAME = "Bossy McBossface";

function nameTag(html: string) {
  const match = html.match(new RegExp(`<div[^>]*>${NAME}</div>`));
  return match?.[0] ?? "";
}

function userRow(html: string) {
  const start = html.lastIndexOf("<div", html.indexOf(`>${NAME}</div>`));
  const rowStart = html.lastIndexOf('<div class="flex items-center', start);
  const roleEnd = html.indexOf("</div></div></div>", start);
  return html.slice(rowStart, roleEnd);
}

describe("Sidebar user row", () => {
  it("renders the full name, with the name as its title", () => {
    const tag = nameTag(renderSidebarFor(NAME));

    expect(tag).not.toBe("");
    expect(tag).toContain(`title="${NAME}"`);
  });

  it("wraps the name onto up to two lines instead of cutting it to one", () => {
    const tag = nameTag(renderSidebarFor(NAME));

    expect(tag).toMatch(/class="[^"]*\bline-clamp-2\b/);
    expect(tag).not.toMatch(/class="[^"]*\btruncate\b/);
  });

  it("puts Settings and Sign out on their own row, not beside the name", () => {
    const html = renderSidebarFor(NAME);
    const row = userRow(html);

    expect(row).toContain(`>${NAME}</div>`);
    expect(row).not.toContain('title="Settings"');
    expect(row).not.toContain('title="Sign out"');
    expect(html).toContain('title="Settings"');
    expect(html).toContain('title="Sign out"');
  });
});
