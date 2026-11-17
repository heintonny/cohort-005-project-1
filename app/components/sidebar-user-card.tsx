import { NavLink, Form } from "react-router";
import { LogOut, Settings } from "lucide-react";
import { UserAvatar } from "~/components/user-avatar";

type SidebarUser = {
  name: string;
  role: string;
  avatarUrl: string | null;
};

const iconButtonClass =
  "rounded-md p-1 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

// The sidebar is a fixed 224px. Settings and Sign out sit on their own row so
// the name gets the full width beside the avatar, and it wraps rather than
// truncates: every seeded name overflowed the old single-row layout.
export function SidebarUserCard({ user }: { user: SidebarUser }) {
  return (
    <div className="rounded-md px-3 py-2">
      <div className="flex items-start gap-3">
        <UserAvatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div
            className="break-words text-sm font-medium leading-snug"
            title={user.name}
          >
            {user.name}
          </div>
          <div className="truncate text-xs capitalize text-sidebar-foreground/50">
            {user.role}
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1 pl-10">
        <NavLink
          to="/settings"
          title="Settings"
          aria-label="Settings"
          className={iconButtonClass}
        >
          <Settings className="size-4" />
        </NavLink>
        <Form method="post" action="/api/logout">
          <button
            type="submit"
            title="Sign out"
            aria-label="Sign out"
            className={iconButtonClass}
          >
            <LogOut className="size-4" />
          </button>
        </Form>
      </div>
    </div>
  );
}
