import { useState } from "react";

type NewSubscriptionModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

const NewSubscriptionModal = ({
  isModalOpen,
  setIsModalOpen,
}: NewSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: null as Date | null,
    hasEndDate: false,
    amount: 0,
    splitType: "EQUAL",
    billingCycle: "MONTHLY",
    participants: [{ email: "", percentage: 0 }],
    reminderEnabled: false,
  });

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.splitType === "PERCENTAGE") {
      const total = formData.participants.reduce(
        (acc, curr) => acc + curr.percentage,
        0,
      );
      if (total !== 100) {
        setError("Total percentage must equal 100%");
        return;
      }
    }
    console.log(formData);
  };

  const addParticipant = () => {
    setFormData({
      ...formData,
      participants: [...formData.participants, { email: "", percentage: 0 }],
    });
  };

  const removeParticipant = (index: number) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter((_, i) => i !== index),
    });
  };

  const updateParticipant = (
    index: number,
    email: string,
    percentage?: number,
  ) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = {
      email,
      percentage:
        percentage ??
        (formData.splitType === "EQUAL"
          ? 100 / formData.participants.length
          : newParticipants[index]?.percentage || 0),
    };
    setFormData({ ...formData, participants: newParticipants });
  };

  return (
    <dialog
      id="new_subscription_modal"
      className={`modal ${isModalOpen ? "modal-open" : ""}`}
    >
      <div className="modal-box max-w-2xl">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setIsModalOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="font-bold text-2xl mb-6">Create New Subscription</h3>

          {/* Basic Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Basic Details</h4>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Subscription Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Netflix Premium"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Brief description of the subscription"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Start Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={formData.startDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate: new Date(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Payment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Amount (in ₹)</span>
                </label>
                <label className="input-group">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="input input-bordered w-full"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: Number(e.target.value),
                      })
                    }
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Billing Cycle</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.billingCycle}
                  onChange={(e) =>
                    setFormData({ ...formData, billingCycle: e.target.value })
                  }
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="QUARTERLY">Quarterly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Split Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Split Details</h4>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Split Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formData.splitType}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    splitType: e.target.value,
                    participants: formData.participants.map((p) => ({
                      ...p,
                      percentage:
                        e.target.value === "EQUAL"
                          ? 100 / formData.participants.length
                          : 0,
                    })),
                  });
                  setError("");
                }}
              >
                <option value="EQUAL">Equal Split</option>
                <option value="PERCENTAGE">Percentage Split</option>
              </select>
            </div>

            {/* Participants */}
            <div className="space-y-3">
              <label className="label">
                <span className="label-text font-medium">Participants</span>
              </label>
              {formData.participants.map((participant, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="email"
                    placeholder="participant@example.com"
                    className="input input-bordered flex-1"
                    value={participant.email}
                    onChange={(e) =>
                      updateParticipant(
                        index,
                        e.target.value,
                        participant.percentage,
                      )
                    }
                    required
                  />
                  {formData.splitType === "PERCENTAGE" && (
                    <div className="flex-none w-32">
                      <label className="input-group">
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          value={participant.percentage}
                          onChange={(e) =>
                            updateParticipant(
                              index,
                              participant.email,
                              Number(e.target.value),
                            )
                          }
                          min="0"
                          max="100"
                          required
                        />
                        <span>%</span>
                      </label>
                    </div>
                  )}
                  {formData.participants.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-square btn-error btn-outline"
                      onClick={() => removeParticipant(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              {error && <p className="text-error text-sm">{error}</p>}
              {formData.splitType === "PERCENTAGE" && (
                <p className="text-sm text-base-content/70">
                  Total:{" "}
                  {formData.participants.reduce(
                    (acc, curr) => acc + curr.percentage,
                    0,
                  )}
                  %
                </p>
              )}
              <button
                type="button"
                className="btn btn-outline btn-sm gap-2"
                onClick={addParticipant}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Participant
              </button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="divider">Additional Options</div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">
                Enable Payment Reminders
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={formData.reminderEnabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reminderEnabled: e.target.checked,
                  })
                }
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Subscription
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setIsModalOpen(false)}>close</button>
      </form>
    </dialog>
  );
};

export default NewSubscriptionModal;
