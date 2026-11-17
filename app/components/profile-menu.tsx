import { NavLink, Form } from "react-router";
import { LogOut, Settings } from "lucide-react";
import { UserAvatar } from "~/components/user-avatar";

type ProfileMenuUser = {
  name: string;
  role: string;
  avatarUrl: string | null;
};

const iconLinkClass =
  "rounded-md p-1 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

export function ProfileMenu({ user }: { user: ProfileMenuUser }) {
  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2">
      <UserAvatar
        name={user.name}
        avatarUrl={user.avatarUrl}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div
          className="break-words text-sm font-medium leading-tight"
          title={user.name}
        >
          {user.name}
        </div>
        <div className="truncate text-xs capitalize text-sidebar-foreground/50">
          {user.role}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-center">
        <NavLink to="/settings" title="Settings" className={iconLinkClass}>
          <Settings className="size-4" />
        </NavLink>
        <Form method="post" action="/api/logout">
          <button type="submit" title="Sign out" className={iconLinkClass}>
            <LogOut className="size-4" />
          </button>
        </Form>
      </div>
    </div>
  );
}
