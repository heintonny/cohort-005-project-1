import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { ProfileMenu } from "~/components/profile-menu";

function render(user: Parameters<typeof ProfileMenu>[0]["user"]) {
  const Stub = createRoutesStub([
    { path: "/", Component: () => <ProfileMenu user={user} /> },
  ]);
  return renderToStaticMarkup(<Stub initialEntries={["/"]} />);
}

const bossy = { name: "Bossy McBossface", role: "student", avatarUrl: null };

describe("ProfileMenu", () => {
  it("shows the full name without truncating it", () => {
    const html = render(bossy);
    expect(html).toContain(">Bossy McBossface</div>");
    expect(html).toContain('title="Bossy McBossface"');
    const nameDiv = html.match(/<div class="([^"]*)" title="Bossy McBossface"/);
    expect(nameDiv?.[1]).not.toContain("truncate");
    expect(nameDiv?.[1]).toContain("break-words");
  });

  it("shows the role", () => {
    expect(render(bossy)).toContain(">student</div>");
  });

  it("links to settings and posts sign out to the logout action", () => {
    const html = render(bossy);
    const settings = html.match(/<a [^>]*title="Settings"[^>]*>/)?.[0];
    expect(settings).toContain('href="/settings"');
    const form = html.match(/<form [^>]*>/)?.[0];
    expect(form).toContain('action="/api/logout"');
    expect(form).toContain('method="post"');
    expect(html).toContain('title="Sign out"');
  });
});
