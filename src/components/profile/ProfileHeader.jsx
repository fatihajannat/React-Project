// components/profile/ProfileHeader.jsx
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatJoinedDate } from '../../utils/helpers';

export default function ProfileHeader({ user, isOwner, onEditClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800/60">
      <div
        className="h-40 w-full sm:h-56"
        style={
          user.coverImage
            ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #3fc7b7 0%, #f9694c 100%)' }
        }
      />
      <div className="relative px-6 pb-6">
        <div className="-mt-10 flex items-end justify-between">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="lg"
            className="border-4 border-white dark:border-slate-800"
          />
          {isOwner && (
            <Button variant="secondary" size="sm" onClick={onEditClick} className="mb-1">
              Edit Profile
            </Button>
          )}
        </div>

        <h1 className="mt-3 font-display text-xl font-bold text-slate-800 dark:text-slate-100">
          {user.name}
        </h1>
        {user.bio && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user.bio}</p>}

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          {user.location && <span>📍 {user.location}</span>}
          <span>🗓️ Joined {formatJoinedDate(user.joinedAt)}</span>
        </div>
      </div>
    </div>
  );
}
