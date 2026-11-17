import { NavLink, Form } from "react-router";
import { LogOut, Settings } from "lucide-react";
import type { UserRole } from "~/db/schema";
import { UserAvatar } from "~/components/user-avatar";

export type SidebarUser = {
  name: string;
  role: UserRole;
  avatarUrl: string | null;
};

const iconButtonClass =
  "rounded-md p-1 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

// The sidebar is a fixed w-56. The Settings and Sign-out icons sit on the role
// line so the name gets the whole column, and the name wraps instead of
// truncating: a user must always be able to read their full name.
export function SidebarUserCard({ user }: { user: SidebarUser }) {
  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2">
      <UserAvatar
        name={user.name}
        avatarUrl={user.avatarUrl}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div
          data-testid="sidebar-user-name"
          className="break-words text-sm font-medium"
        >
          {user.name}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs capitalize text-sidebar-foreground/50">
            {user.role}
          </span>
          <div className="flex shrink-0 items-center">
            <NavLink
              to="/settings"
              title="Settings"
              className={iconButtonClass}
            >
              <Settings className="size-4" />
            </NavLink>
            <Form method="post" action="/api/logout">
              <button
                type="submit"
                title="Sign out"
                className={iconButtonClass}
              >
                <LogOut className="size-4" />
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
