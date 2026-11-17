import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { UserRole } from "~/db/schema";
import {
  SidebarUserCard,
  type SidebarUser,
} from "~/components/sidebar-user-card";

function render(user: SidebarUser) {
  const Stub = createRoutesStub([
    { path: "/", Component: () => <SidebarUserCard user={user} /> },
  ]);
  return renderToString(<Stub initialEntries={["/"]} />);
}

function nameElement(html: string) {
  const match = html.match(
    /<div data-testid="sidebar-user-name" class="([^"]*)">([^<]*)<\/div>/
  );
  if (!match) throw new Error(`No name element in: ${html}`);
  return { classes: match[1].split(" "), text: match[2] };
}

const james: SidebarUser = {
  name: "James Park",
  role: UserRole.Student,
  avatarUrl: null,
};

describe("SidebarUserCard", () => {
  it("shows the user's full name", () => {
    expect(nameElement(render(james)).text).toBe("James Park");
  });

  it("wraps a long name instead of cutting it off", () => {
    const { classes, text } = nameElement(
      render({ ...james, name: "Bossy McBossface Montgomery-Smythe" })
    );
    expect(text).toBe("Bossy McBossface Montgomery-Smythe");
    expect(classes).toContain("break-words");
    expect(classes).not.toContain("truncate");
    expect(classes.some((c) => c.startsWith("line-clamp"))).toBe(false);
  });

  it("keeps the role, Settings and Sign-out controls", () => {
    const html = render(james);
    expect(html).toContain(">student<");
    expect(html).toContain('href="/settings"');
    expect(html).toContain('title="Settings"');
    expect(html).toContain('action="/api/logout"');
    expect(html).toContain('title="Sign out"');
  });
});
