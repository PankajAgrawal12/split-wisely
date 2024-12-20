// components/SubscriptionCard.tsx
import { formatDistanceToNow } from "date-fns";
import { FaMoneyBillWave, FaUsers, FaCalendar } from "react-icons/fa";

interface Subscription {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  splitType: string;
  billingCycle: string;
  owner: {
    id: string;
    name?: string;
  };
  participants: {
    userId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  reminderEnabled: boolean;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  currentUserId: string;
}

export function SubscriptionCard({
  subscription,
  currentUserId,
}: SubscriptionCardProps) {
  const {
    name,
    description,
    amount,
    billingCycle,
    splitType,
    isActive,
    reminderEnabled,
    startDate,
    endDate,
    owner,
    participants,
  } = subscription;

  const isOwner = subscription.owner.id === currentUserId;
  const participantsCount = participants.length + 1; // +1 to include owner

  const getTimeRemaining = () => {
    return formatDistanceToNow(new Date(endDate), { addSuffix: true });
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="card-body">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title text-xl font-bold">{name}</h2>
            {description && (
              <p className="text-sm text-base-content/70 mt-1">{description}</p>
            )}
          </div>
          <div
            className={`badge ${isActive ? "badge-success" : "badge-error"} badge-lg gap-2`}
          >
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="divider my-2"></div>

        {/* Price and Billing Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-base-200 p-2 rounded-lg">
              <i className="text-primary">
                <FaMoneyBillWave />
              </i>
            </div>
            <div>
              <p className="text-xl font-bold">{amount}</p>
              <p className="text-sm opacity-70">
                per {billingCycle.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Members Info */}
          <div className="flex items-center gap-3">
            <div className="bg-base-200 p-2 rounded-lg">
              <i className="fas fa-users text-primary">
                <FaUsers />
              </i>
            </div>
            <div>
              <p className="font-medium">{participantsCount} members</p>
              <p className="text-sm opacity-70">
                {isOwner ? "You're the owner" : `Owned by ${owner.name}`}
              </p>
            </div>
          </div>

          {/* Duration Info */}
          <div className="flex items-center gap-3">
            <div className="bg-base-200 p-2 rounded-lg">
              <i className="fas fa-calendar text-primary">
                <FaCalendar />
              </i>
            </div>
            <div>
              <p className="font-medium">Expires {getTimeRemaining()}</p>
              <p className="text-sm opacity-70">
                {new Date(startDate).toLocaleDateString()} -{" "}
                {new Date(endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="divider my-2"></div>

        {/* Split Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Split Type</span>
            <span className="badge badge-outline">
              {splitType.toLowerCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Your Share</span>
            <span className="badge badge-primary">
              {amount / participantsCount}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <i
              className={`fas fa-bell ${reminderEnabled ? "text-primary" : "opacity-50"}`}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}
