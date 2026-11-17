import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { SidebarUserCard } from "~/components/sidebar-user-card";

function renderCard(name: string) {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <SidebarUserCard user={{ name, role: "student", avatarUrl: null }} />
      ),
    },
  ]);
  return renderToStaticMarkup(<Stub initialEntries={["/"]} />);
}

function nameElement(html: string, name: string) {
  const match = html.match(
    new RegExp(`<div class="([^"]*)" title="${name}">([^<]*)</div>`)
  );
  if (!match) throw new Error(`no name element for ${name} in ${html}`);
  return { className: match[1], text: match[2] };
}

describe("SidebarUserCard", () => {
  it("shows the whole name, with a title for hover", () => {
    const { text } = nameElement(renderCard("James Park"), "James Park");
    expect(text).toBe("James Park");
  });

  it("wraps the name instead of truncating it", () => {
    const { className } = nameElement(
      renderCard("Bossy McBossface"),
      "Bossy McBossface"
    );
    expect(className.split(" ")).toContain("break-words");
    expect(className.split(" ")).not.toContain("truncate");
  });

  it("keeps the Settings link and the Sign-out button", () => {
    const html = renderCard("James Park");
    expect(html).toMatch(/<a[^>]*aria-label="Settings"[^>]*href="\/settings"/);
    expect(html).toMatch(/<form[^>]*action="\/api\/logout"/);
    expect(html).toMatch(/<button[^>]*aria-label="Sign out"/);
  });
});
